package rmq

import (
	// "CourseCrafter/aws"
	// "CourseCrafter/cohere"
	"context"
	"encoding/json"
	"fmt"
	"os"
	"sync"

	// "github.com/gofor-little/env"
	"CourseCrafter/aws"
	"CourseCrafter/cohere"
	"CourseCrafter/database"
	"CourseCrafter/utils"

	amqp "github.com/rabbitmq/amqp091-go"
)

var conn *amqp.Connection

func Connect() error {
	rabbitMQURL := "amqp://guest:guest@localhost:5672/"
	conection, err := amqp.Dial(rabbitMQURL)
	conn = conection
	if err != nil {
		return err

	}

	return nil
}

func Disconnect() {
	conn.Close()
}

func PublishFile(queueName, json string) error {
	ch, err := conn.Channel()
	if err != nil {
		panic("failed to open a channel: " + err.Error())
	}
	defer ch.Close()

	_, err = ch.QueueDeclare(
		queueName,
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return err
	}

	err = ch.PublishWithContext(
		context.Background(),
		"",
		queueName,
		false,
		false,
		amqp.Publishing{
			ContentType: "text/plain",
			Body:        []byte(json),
		},
	)
	if err != nil {
		return err
	}

	return nil
}

func ListenToNotification() {
	fmt.Println("Listening to notification")
	type Notification struct {
		Error       string      `json:"error"`
		Status      bool        `json:"status"`
		Object_path *string     `json:"object_path"`
		CourseId    string      `json:"courseId"`
		Message     string      `json:"message"`
		Mode        *utils.Mode `json:"mode"`
	}

	ch, err := conn.Channel()
	if err != nil {
		panic("failed to open a channel: " + err.Error())
		// return err
	}

	_, err = ch.QueueDeclare(
		"notification",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		panic("failed to declare a queue: " + err.Error())
		// return err
	}

	msgs, err := ch.Consume(
		"notification",
		"",
		true,
		false,
		false,
		false,
		nil,
	)

	if err != nil {
		// return err
		panic("failed to register a consumer: " + err.Error())
	}

	for msg := range msgs {
		// Do something with the message
		fmt.Println("THIS IS THE MESSAGE I RECEIVED ", string(msg.Body))

		var notification Notification
		err := json.Unmarshal(msg.Body, &notification)

		if err != nil {
			panic("failed to unmarshal message: " + err.Error())
			// return err
		}

		fmt.Println(notification.Error)
		if !notification.Status {
			fmt.Println("Error in uploading file")
		}
		fmt.Println(notification.Object_path, "Object path", "notificatiion couse id", notification.CourseId, "notification message", notification.Message)
		if string(notification.CourseId) != "" && string(notification.Message) != "done" {
			err = database.UpdateProcessingStatus(notification.CourseId, notification.Message, true)
			if err != nil {
				fmt.Println("Error in updating processing status", err.Error())
			}
		}

		fmt.Println("SENDING MESSAGE", notification.Message)

		courseProcessingChannel := utils.CourseProcessingChannels[notification.CourseId]
		if courseProcessingChannel == nil {
			courseProcessingChannel = make(chan []byte)
			utils.CourseProcessingChannels[notification.CourseId] = courseProcessingChannel
		}
		fmt.Println("SENDING MESSAGE", notification.Message)
		if notification.Message == "done" {
			fmt.Println("DONE MESSAGE", notification.Message)
			if utils.CourseContentMap[notification.CourseId] == nil {
				utils.CourseContentMap[notification.CourseId] = &utils.CourseContent{
					Content:      "",
					ContentMutex: sync.Mutex{},
				}
			}
			extracted_json, err := aws.GetTextFromS3(*notification.Object_path)
			if err != nil {
				fmt.Println("Failed to get text from S3 asededed:", err)
			}
			fmt.Println("starrting topic generation MODE", *notification.Mode)
			topicList := cohere.StartGenerationTopics(extracted_json, notification.CourseId)
			fmt.Println("TOPIC LIST", topicList)

			// utils.CourseStreamMutex.Lock()
			channel := utils.CourseStreamChannels[notification.CourseId]
			fmt.Println(channel, "channell")

			go func() {
				*channel <- utils.StreamResponse{
					TopicList: &topicList,
				}
			}()
			go cohere.PyqsGeneration(extracted_json, topicList, *channel, notification.CourseId)
			// utils.CourseStreamMutex.Unlock()
			fmt.Println("done sending to channel")
			file, err := os.Create(notification.CourseId + ".txt")
			if err != nil {
				fmt.Println("Error creating file", err)
			}

			if err != nil {
				fmt.Println("Error marshalling json", err)
			}

			file.Write([]byte(topicList))
			// fmt.Println("TOPIC LIST", topicList)
			_, err = file.Seek(0, 0)
			if err != nil {
				fmt.Println("Error seeking file:", err)
				return
			}

			err = aws.UploadFileToS3("topicList/"+notification.CourseId+".txt", file)
			if err != nil {
				fmt.Println("Error uploading file to s3", err)
			}

			file.Close()
			os.Remove(notification.CourseId + ".txt")
			courseProcessingChannel <- []byte(notification.Message)

			var receivedMode utils.Mode
			if notification.Mode != nil {
				receivedMode = utils.Mode(*notification.Mode)
			} else {
				receivedMode = utils.Simple
			}

			fmt.Println("MODE", receivedMode)
			filePath := "text/" + notification.CourseId + ".json"

			pyqContent, err := aws.GetTextFromS3(filePath)
			if err != nil {
				panic("failed to get text from S3 121212: " + err.Error())
			}
			var data utils.Data
			if err := json.Unmarshal([]byte(pyqContent), &data); err != nil {
				fmt.Println("Error:", err)
				return
			}

			if err != nil {
				fmt.Println("Error creating pyqFile", err)
			}

			if receivedMode == utils.Simple {
				go cohere.StartGeneration(extracted_json, notification.CourseId, topicList, *channel)

			} else if receivedMode == utils.Detailed {
				go cohere.StartDetailedGeneration(extracted_json, notification.CourseId, topicList, *channel)
			} else {
				go cohere.StartGeneration(extracted_json, notification.CourseId, topicList, *channel)
			}

			// Create goa reader from byte slice.

		} else {
			fmt.Println("NOT DNONE", notification.Message)
			courseProcessingChannel <- []byte(notification.Message)
		}

		// if err != nil {
		// 	fmt.Println("Failed to get text from S3:", err)
		// }
		// prompt := fmt.Sprintf(`
		// "Please analyze the following extracted text from a presentation ."
		// %s
		// Instructions for Note Generation:

		// Detail-Oriented Notes: Break down the extracted text into detailed study notes. Include explanations, examples, and definitions to ensure comprehensive coverage of the topic. Provide real-world examples to illustrate key concepts and enhance understanding.

		// Clarity and Simplicity: Ensure that the generated notes are clear and easy to understand. Use concise language and keep the explanations straightforward to facilitate quick comprehension.

		// Scoring Optimization: Aim to produce study materials that can help students score well in exams. Prioritize accuracy, relevance, and completeness in the generated notes.

		// Overall, the generated notes should be detailed, informative, and engaging enough for a student that studies from these notes shouldn't have to search for the same topic ever again.

		// Additional Context:
		// The extracted text contains key concepts, definitions, and explanations presented in a lecture. The goal is to create detailed study notes that include examples and explanations in simple language to assist students in understanding the material thoroughly and quickly, thereby improving their academic performance.
		// `, extracted_text)

		// generateContent, err := cohere.CallCohere(cohereToken, prompt)
		// if err != nil {
		// 	panic("failed to generate content: " + err.Error())
		// }
		// fmt.Println(generateContent, "Extracted text")

		//continue with building the gpt logic

		fmt.Println("Notification received")

	}

	// return nil

}
