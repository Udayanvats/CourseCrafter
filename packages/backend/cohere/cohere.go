package cohere

import (
	// "CourseCrafter/aws"
	"CourseCrafter/aws"
	"CourseCrafter/utils"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"os"
	"sync"

	cohere "github.com/cohere-ai/cohere-go/v2"
	cohereclient "github.com/cohere-ai/cohere-go/v2/client"
	"github.com/gofor-little/env"
	// "github.com/sashabaranov/go-openai"
)

func CallCohere(authToken string, prompt string) (*cohere.NonStreamedChatResponse, error) {
	client := cohereclient.NewClient(cohereclient.WithToken(authToken))

	response, err := client.Chat(
		context.TODO(),
		&cohere.ChatRequest{
			Message: prompt,
		},
	)
	if err != nil {
		return response, err
	}

	return response, nil
}

func StartGeneration(extractedJSON string, courseID string, topicLists string, channel chan utils.StreamResponse) {
	var cohereToken = env.Get("COHERE_API_KEY", "")
	fmt.Println(courseID, "cohere Course Id")

	inputPrompt := utils.InputPrompt(extractedJSON, topicLists)

	client := cohereclient.NewClient(cohereclient.WithToken(cohereToken))

	stream, err := client.ChatStream(
		context.TODO(),
		&cohere.ChatStreamRequest{
			Message: inputPrompt,
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

		if message.TextGeneration != nil && message.TextGeneration.Text != "" {

			channel <- utils.StreamResponse{Message: message.TextGeneration.Text}
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
	var cohereToken = env.Get("COHERE_API_KEY", "")
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
		client := cohereclient.NewClient(cohereclient.WithToken(cohereToken))

		fmt.Println(topicListObject[i].Topic, "topic")
		inputPrompt := utils.DetailedPrompt(extracted_json, topicListObject[i])
		fmt.Println("input prompt", inputPrompt)
		stream, err := client.ChatStream(
			context.TODO(),
			&cohere.ChatStreamRequest{
				Message: inputPrompt,
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

			if message.TextGeneration != nil && message.TextGeneration.Text != "" {
				courseContent += message.TextGeneration.Text
				// fmt.Println(message.TextGeneration.Text, "message")
				channel <- utils.StreamResponse{Message: message.TextGeneration.Text}
			}
		}

		channel <- utils.StreamResponse{Message: ","}
		courseContent += ","

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
	var cohereToken = env.Get("COHERE_API_KEY", "")
	fmt.Println(courseId, "cohere Course Id", cohereToken)
	inputPrompt := utils.ListTopicsPrompt(extracted_json)
	fmt.Println("input prompt")
	topicsList, err := CallCohere(cohereToken, inputPrompt)
	if err != nil {
		fmt.Println("error while starting generation", err)
		panic("failed to generate content: " + err.Error())
	}
	return topicsList.Text

}

func PyqsGeneration(extracted_json string, topicListString string, channel chan utils.StreamResponse,courseId string)  {
	var cohereToken = env.Get("COHERE_API_KEY", "")
	inputPrompt := utils.GeneratePYQanalaysis(extracted_json, topicListString)
	// fmt.Println("input prompt")
	pyqAnalaysis, err := CallCohere(cohereToken, inputPrompt)
	if err != nil {
		fmt.Println("error while starting generation", err)
		panic("failed to generate content: " + err.Error())
	}
	pyqContent := pyqAnalaysis.Text

	file,err:= os.CreateTemp("","pyqs/"+courseId+".json")
	if err != nil {
		fmt.Println("Error creating temporary file:", err)
		panic("Error creating temporary: " + err.Error())
	}
	defer os.Remove(file.Name())
	aws.UploadFileToS3("pyqs/"+courseId+".json",file)
	channel <- utils.StreamResponse{
		PyqContent: &pyqContent,
	}

	
}
