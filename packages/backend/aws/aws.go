package aws

import (
	"context"
	"fmt"
	"io"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gofor-little/env"
)


var S3Client *s3.Client
var bucketName = "coursecrafter"




func LoadS3() error {
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
		return err
	}

	S3Client = s3.NewFromConfig(cfg)


	return nil
}


func UploadFileToS3(objectKey string, file io.Reader) error {

		

	_, err := S3Client.PutObject(context.TODO(), &s3.PutObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(objectKey),
		Body:   file,
	})
	

	return err

}