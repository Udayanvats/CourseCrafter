package rmq

import (
	"CourseCrafter/aws"
	"context"
	"encoding/json"
	"fmt"

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

func ListenToNotification()  {
	fmt.Println("Listening to notification")
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
		extracted_text,err:=aws.GetTextFromS3(notification.Object_path)

		if err != nil {
			fmt.Println("Failed to get text from S3:", err)
		}
		fmt.Println(extracted_text, "Extracted text")

		//continue with building the gpt logic


		fmt.Println("Notification received")

	}

	// return nil

}
