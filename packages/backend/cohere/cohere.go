package cohere

import (
	// "CourseCrafter/aws"
	"CourseCrafter/aws"
	"CourseCrafter/database"
	"CourseCrafter/utils"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"os"
	"sync"

	"github.com/gofor-little/env"
	openai "github.com/sashabaranov/go-openai"
)

func CallCohere(authToken string, prompt string) (openai.ChatCompletionResponse, error) {
	client := openai.NewClient(authToken)

	response, err := client.CreateChatCompletion(
		context.TODO(),
		openai.ChatCompletionRequest{
			Model: openai.GPT3Dot5Turbo,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: prompt,
				},
			},
		},
	)
	if err != nil {
		return response, err
	}

	return response, nil
}

func StartGeneration(extractedJSON string, courseID string, topicLists string, channel chan utils.StreamResponse) {
	var gptToken = env.Get("GPT_API_KEY", "")
	fmt.Println(courseID, "cohere Course Id")

	inputPrompt := utils.InputPrompt(extractedJSON, topicLists)

	// client := cohereclient.NewClient(cohereclient.WithToken(cohereToken))
	client := openai.NewClient(gptToken)

	// stream, err := client.ChatStream(
	// 	context.TODO(),
	// 	&cohere.ChatStreamRequest{
	// 		Message: inputPrompt,
	// 	},
	// )
	stream, err := client.CreateChatCompletionStream(
		context.TODO(),
		openai.ChatCompletionRequest{
			Model:  openai.GPT3Dot5Turbo,
			Stream: true,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: inputPrompt,
				},
			},
		},
	)

	fmt.Println("pree course stream mutex")

	// utils.CourseStreamMutex.Lock()
	// var channel chan utils.StreamResponse
	// if utils.CourseStreamChannels[courseID] == nil {
	// 	channel = make(chan utils.StreamResponse)
	// 	utils.CourseStreamChannels[courseID] = &channel
	// }else{
	// 	channel = *utils.CourseStreamChannels[courseID]
	// }

	// utils.CourseStreamMutex.Unlock()

	var courseContent string

	if err != nil {
		errMessage := err.Error()
		channel <- utils.StreamResponse{Error: &errMessage}
	}
	defer stream.Close()

	if utils.CourseContentMap[courseID] == nil {
		utils.CourseContentMap[courseID] = &utils.CourseContent{
			Content:      "",
			ContentMutex: sync.Mutex{},
		}
	}

	for {
		message, err := stream.Recv()
		if errors.Is(err, io.EOF) {
			fmt.Println("EOF")
			channel <- utils.StreamResponse{Done: true}

			break
		} else if err != nil {
			fmt.Println("error while receiving message", err)
			errMessage := err.Error()
			channel <- utils.StreamResponse{Error: &errMessage}
		}

		if message.Choices[0].Delta.Content != "" {

			channel <- utils.StreamResponse{Message: message.Choices[0].Delta.Content}
		}
	}

	file, err := os.Create(courseID + ".txt")
	if err != nil {
		fmt.Println("Error creating temporary file:", err)
		return
	}
	defer os.Remove(file.Name())

	_, err = file.WriteString(courseContent)
	if err != nil {
		fmt.Println("Error writing to file:", err)
		return
	}

	_, err = file.Seek(0, 0)
	if err != nil {
		fmt.Println("Error seeking file:", err)
		return
	}

	// utils.CourseContentMap[courseID].ContentMutex.Unlock()

	err = aws.UploadFileToS3("courses/"+courseID+".txt", file)
	if err != nil {
		fmt.Println("Error uploading file to S3:", err)
		return
	}

	fmt.Println("file uploaded to s3")
}

func StartDetailedGeneration(extracted_json string, courseID string, topicListString string, channel chan utils.StreamResponse) {
	var cohereToken = env.Get("GPT_API_KEY", "")
	fmt.Println("STARTING DETAILED GENERATION")
	fmt.Println(courseID, "cohere Course Id", cohereToken)

	var topicListObject []utils.TopicListObjectType

	err := json.Unmarshal([]byte(topicListString), &topicListObject)
	if err != nil {
		fmt.Println("error while unmarshalling topic list", err)
		panic("failed to generate content: " + err.Error())
	}
	var courseContent string = "["

	channel <- utils.StreamResponse{Message: "["}
	for i := 0; i < len(topicListObject); i++ {
		client := openai.NewClient(cohereToken)

		fmt.Println(topicListObject[i].Topic, "topic")
		inputPrompt := utils.DetailedPrompt(extracted_json, topicListObject[i])
		fmt.Println("input prompt", inputPrompt)
		stream, err := client.CreateChatCompletionStream(
			context.TODO(),
			openai.ChatCompletionRequest{
				Model:  openai.GPT3Dot5Turbo,
				Stream: true,
				Messages: []openai.ChatCompletionMessage{
					{
						Role:    openai.ChatMessageRoleUser,
						Content: inputPrompt,
					},
				},
				MaxTokens: 4000,
			},
		)

		if err != nil {
			errMessage := err.Error()
			channel <- utils.StreamResponse{Error: &errMessage}
		}

		defer stream.Close()

		for {
			message, err := stream.Recv()
			if errors.Is(err, io.EOF) {
				fmt.Println("EOF")
				break
			} else if err != nil {
				fmt.Println("error while receiving message", err)
				errMessage := err.Error()
				channel <- utils.StreamResponse{Error: &errMessage}
				break

			}

			if message.Choices[0].Delta.Content != "" {
				courseContent += message.Choices[0].Delta.Content
				// fmt.Println(message.TextGeneration.Text, "message")
				channel <- utils.StreamResponse{Message: message.Choices[0].Delta.Content}
			}
		}
		// if i != len(topicListObject)-1 {
		channel <- utils.StreamResponse{Message: ","}
		courseContent += ","
		// }

	}

	channel <- utils.StreamResponse{Message: "]"}

	courseContent += "]"
	channel <- utils.StreamResponse{Done: true}

	file, err := os.Create(courseID + ".txt")
	if err != nil {
		fmt.Println("Error creating temporary file:", err)
		return
	}
	defer os.Remove(file.Name())

	_, err = file.WriteString(courseContent)
	if err != nil {
		fmt.Println("Error writing to file:", err)
		return
	}

	_, err = file.Seek(0, 0)
	if err != nil {
		fmt.Println("Error seeking file:", err)
		return
	}

	// utils.CourseContentMap[courseID].ContentMutex.Unlock()

	err = aws.UploadFileToS3("courses/"+courseID+".txt", file)
	if err != nil {
		fmt.Println("Error uploading file to S3:", err)
		return
	}

	fmt.Println("file uploaded to s3")

}

func StartGenerationTopics(extracted_json string, courseId string) string {
	var cohereToken = env.Get("GPT_API_KEY", "")
	fmt.Println(courseId, "cohere Course Id", cohereToken)
	inputPrompt := utils.ListTopicsPrompt(extracted_json)
	fmt.Println("input prompt")
	topicsList, err := CallCohere(cohereToken, inputPrompt)
	if err != nil {
		fmt.Println("error while starting generation", err)
		panic("failed to generate content: " + err.Error())
	}
	generatedText := topicsList.Choices[0].Message.Content

	var topicsLists []struct {
		Topic     string   `json:"topic"`
		SubTopics []string `json:"subtopics"`
	}
	json.Unmarshal([]byte(generatedText), &topicsLists)

	fmt.Println(len(topicsLists), "topics list")
	err = database.UpdateTotalChapters(courseId, len(topicsLists))

	if err != nil {
		fmt.Println("error while updating total chapters", err)
	}

	return generatedText

}

func PyqsGeneration(extracted_json string, topicListString string, channel chan utils.StreamResponse, courseId string) {
	var cohereToken = env.Get("GPT_API_KEY", "")
	fmt.Println("STARTING PYQS GENERATION")
	inputPrompt := utils.GeneratePYQanalaysis(extracted_json, topicListString)
	// fmt.Println("input prompt")
	pyqAnalaysis, err := CallCohere(cohereToken, inputPrompt)
	if err != nil {
		fmt.Println("error while starting generation", err)
		panic("failed to generate content: " + err.Error())
	}
	pyqContent := pyqAnalaysis.Choices[0].Message.Content
	fmt.Println("pyq content", pyqContent)

	file, err := os.CreateTemp("", "pyqs"+courseId+".txt")
	if err != nil {
		fmt.Println("Error creating temporary file:", err)
		panic("Error creating temporary: " + err.Error())
	}
	file.Write([]byte(pyqContent))
	_, err = file.Seek(0, 0)
	if err != nil {
		fmt.Println("Error seeking file:", err)
		panic("Error seeking file: " + err.Error())
	}
	defer os.Remove(file.Name())
	aws.UploadFileToS3("pyqs/"+courseId+".txt", file)
	fmt.Println("file uploaded to s3")
	channel <- utils.StreamResponse{
		PyqContent: &pyqContent,
	}

}
