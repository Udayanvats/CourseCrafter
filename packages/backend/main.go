package main

import (
	"CourseCrafter/aws"
	"CourseCrafter/rmq"

	"fmt"

	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

)



func main() {
	

	// Create S3 client
	err:=aws.LoadS3()
	if err != nil {
		panic("Failed to load S3: "+ err.Error())
	}

	err = rmq.Connect()
	if err != nil {
		panic("failed to connect to RabbitMQ: " + err.Error())
	}
	defer rmq.Disconnect()

	go rmq.ListenToNotification()

	


	if err != nil {
		panic("failed to declare a queue: " + err.Error())
	}

	r := gin.Default()
	r.Use(cors.Default())

	r.POST("/upload", func(c *gin.Context) {
		file, header, err := c.Request.FormFile("file")

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
			return
		}
		defer file.Close()
		objectKey := "files/" + header.Filename
		err=aws.UploadFileToS3(objectKey, file)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		rmq.PublishFile("extract", header.Filename)


		
		if err != nil {
			fmt.Println("Failed to publish message:", err)
		}

		c.JSON(http.StatusOK, gin.H{"message": "File uploaded successfully"})
	})

	r.Run("localhost:8080")
}
