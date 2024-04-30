package main

import (
	"context"
	// "fmt"
	"io"
	"log"
	"net/http"
	// "os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gin-gonic/gin"
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
	// Initialize AWS session
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		log.Fatalf("unable to load AWS config, %v", err)
	}

	// Create S3 client
	s3Client := s3.NewFromConfig(cfg)
	basics := &BucketBasics{S3Client: s3Client}

	r := gin.Default()

	// Handle file upload
	r.POST("/upload", func(c *gin.Context) {
		file, header, err := c.Request.FormFile("file")
		
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
			return
		}
		defer file.Close()

		bucketName := "your-bucket-name"
		objectKey := header.Filename

		err = basics.UploadFile(bucketName, objectKey, file)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "File uploaded successfully"})
	})

	r.Run("localhost:8080")
}