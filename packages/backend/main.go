package main

import (
	"context"
	"fmt"

	// "fmt"
	"io"

	"net/http"

	// "os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gin-gonic/gin"
	"github.com/gofor-little/env"
	"github.com/gin-contrib/cors"
)

type BucketBasics struct {
	S3Client *s3.Client
}

func (basics *BucketBasics) UploadFile(bucketName string, objectKey string, file io.Reader) error {
	_, err := basics.S3Client.PutObject(context.TODO(), &s3.PutObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(objectKey),
		Body:   file,
	})

	return err
}

func main() {
	env.Load(".env")

	// Initialize AWS session
	var AWS_ACCESS_KEY = env.Get("AWS_ACCESS_KEY", "")
	var AWS_SECRET_KEY = env.Get("AWS_SECRET_KEY", "")
	fmt.Println(AWS_ACCESS_KEY, AWS_SECRET_KEY, "printt")
	cfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(
			AWS_ACCESS_KEY,
			AWS_SECRET_KEY,
			"",
		)),
		config.WithRegion("ap-south-1"))
	if err != nil {
		panic("configuration error, " + err.Error())
	}

	// Create S3 client
	s3Client := s3.NewFromConfig(cfg)
	basics := &BucketBasics{S3Client: s3Client}

	r := gin.Default()
	r.Use(cors.Default())


	// Handle file upload
	r.POST("/upload", func(c *gin.Context) {
		file, header, err := c.Request.FormFile("file")

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
			return
		}
		defer file.Close()

		bucketName := "coursecrafter"
		objectKey := "files/"+header.Filename

		err = basics.UploadFile(bucketName, objectKey, file)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "File uploaded successfully"})
	})

	r.Run("localhost:8080")
}
