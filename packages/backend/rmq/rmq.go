package rmq

import (
	"context"

	amqp "github.com/rabbitmq/amqp091-go"
)

var conn *amqp.Connection

func Connect() error {
	rabbitMQURL := "amqp://guest:guest@localhost:5672/"
	conection, err := amqp.Dial(rabbitMQURL)
	conn=conection
	if err !=nil {
		return err
		
	}

	return nil
}

func Disconnect(){
	conn.Close()
}

func PublishFile(queueName ,fileName string) error {
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

