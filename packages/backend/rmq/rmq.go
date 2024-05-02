package rmq

import (
	"CourseCrafter/aws"
	"CourseCrafter/cohere"
	"context"
	"encoding/json"
	"fmt"

	"github.com/gofor-little/env"
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

func PublishFile(queueName, fileName string) error {
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
			Body:        []byte("files/" + fileName),
		},
	)
	if err != nil {
		return err
	}

	return nil
}

func ListenToNotification() {
	fmt.Println("Listening to notification")
	var cohereToken = env.Get("COHERE_API_KEY", "")
	type Notification struct {
		Error       string `json:"error"`
		Status      bool   `json:"status"`
		Object_path string `json:"object_path"`
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
		fmt.Println(string(msg.Body))

		var notification Notification
		err := json.Unmarshal(msg.Body, &notification)

		if err != nil {
			panic("failed to unmarshal message: " + err.Error())
			// return err
		}

		fmt.Println(notification.Error)
		if notification.Status == false {
			fmt.Println("Error in uploading file")
		}
		fmt.Println(notification.Object_path, "Object path")
		extracted_text, err := aws.GetTextFromS3(notification.Object_path)

		if err != nil {
			fmt.Println("Failed to get text from S3:", err)
		}
		prompt := fmt.Sprintf(`
		"Please analyze the following extracted text from a presentation ."
		%s
		Instructions for Note Generation:
		
		Detail-Oriented Notes: Break down the extracted text into detailed study notes. Include explanations, examples, and definitions to ensure comprehensive coverage of the topic. Provide real-world examples to illustrate key concepts and enhance understanding.
		
		Clarity and Simplicity: Ensure that the generated notes are clear and easy to understand. Use concise language and keep the explanations straightforward to facilitate quick comprehension.
		
		Scoring Optimization: Aim to produce study materials that can help students score well in exams. Prioritize accuracy, relevance, and completeness in the generated notes.
		
		Overall, the generated notes should be detailed, informative, and engaging enough for a student that studies from these notes shouldn't have to search for the same topic ever again.
		
		Additional Context:
		The extracted text contains key concepts, definitions, and explanations presented in a lecture. The goal is to create detailed study notes that include examples and explanations in simple language to assist students in understanding the material thoroughly and quickly, thereby improving their academic performance.
		`, extracted_text)

		generateContent, err := cohere.CallCohere(cohereToken, prompt)
		if err != nil {
			panic("failed to generate content: " + err.Error())
		}
		fmt.Println(generateContent, "Extracted text")

		//continue with building the gpt logic

		fmt.Println("Notification received")

	}

	// return nil

}
