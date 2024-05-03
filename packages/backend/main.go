package main

import (
	"CourseCrafter/aws"
	"CourseCrafter/database"
	"CourseCrafter/rmq"
	"CourseCrafter/utils"
	"encoding/json"
	"fmt"
	"strconv"

	// "sync"

	// "fmt"

	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {

	// Create S3 client
	err := aws.LoadS3()
	if err != nil {
		panic("Failed to load S3: " + err.Error())
	}

	err = rmq.Connect()
	if err != nil {
		panic("failed to connect to RabbitMQ: " + err.Error())
	}
	defer rmq.Disconnect()

	go rmq.ListenToNotification()

	err = database.Connect()
	if err != nil {
		panic("failed to connect to database: " + err.Error())
	}
	defer database.Disconnect()

	if err != nil {
		panic("failed to declare a queue: " + err.Error())
	}

	r := gin.Default()
	r.Use(cors.Default())

	r.POST("/upload", func(c *gin.Context) {
		form, err := c.MultipartForm()
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
			return
		}

		docs := form.File["docs"]

		// docs:= c.Request.MultipartForm.File["docs"]
		// if err != nil {
		// 	c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		// 	return
		// }
		// pyqs:=c.Request.MultipartForm.File["pyqs"]
		pyqs := form.File["pyqs"]
		title := c.Request.FormValue("title")
		modeStr := c.Request.FormValue("mode")
		userId := c.Request.FormValue("userId")

		mode, err := strconv.Atoi(modeStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid mode"})
			return
		}

		// if err != nil {
		// 	c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		// 	return
		// }
		// fmt.Println(docs)

		var docsArr []string
		var pyqsArr []string

		for _, header := range docs {
			fmt.Println("hello")
			file, err := header.Open()
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			objectKey := "files/" + header.Filename
			err = aws.UploadFileToS3(objectKey, file)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			// err = rmq.PublishFile("extract", header.Filename)
			// if err != nil {
			// 	c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			// 	return
			// }
			docsArr = append(docsArr, objectKey)
			fmt.Println(objectKey, "objectKey")

			defer file.Close()
		}

		for _, header := range pyqs {
			file, err := header.Open()
			if err != nil {

				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			objectKey := "files/" + header.Filename
			err = aws.UploadFileToS3(objectKey, file)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			pyqsArr = append(pyqsArr, objectKey)
			defer file.Close()
		}

		// objectKey := "files/" + header.Filename
		// err=aws.UploadFileToS3(objectKey, file)
		// if err != nil {
		// 	c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		// 	return
		// }
		var course utils.Course
		course.Title = title
		course.Mode = mode
		course.Docs = docsArr
		course.Pyqs = pyqsArr
		course.UserId = userId

		courseId, err := database.AddCourse(course)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		newChannel := make(chan []byte)
		utils.CourseMutex.Lock()
		utils.CourseChannels[courseId] = newChannel
		utils.CourseMutex.Unlock()

		var response struct {
			CourseId string   `json:"courseId"`
			Docs     []string `json:"docs"`
			Pyqs     []string `json:"pyqs"`
		}

		response.CourseId = courseId
		response.Docs = docsArr
		response.Pyqs = pyqsArr

		jsonResponse, err := json.Marshal(response)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		err = rmq.PublishFile("extract", string(jsonResponse))

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "File uploaded successfully", "courseId": courseId})
	})

	r.GET("/courses/:courseId/status", func(c *gin.Context) {
		courseId := c.Param("courseId")
		client := c.Writer
		client.Header().Set("Content-Type", "text/event-stream")
		client.Header().Set("Cache-Control", "no-cache")
		client.Header().Set("Connection", "keep-alive")

		fmt.Fprintf(client, "data: Initial message\n\n")
		client.Flush()

		channel := utils.CourseChannels[courseId]

		for {
			select {

			case message := <-channel:
				fmt.Fprintf(client, "data: %s\n\n", message)
				client.Flush()
				if string(message) == "done" {
					fmt.Fprintf(client, "done")
					client.Flush()
					utils.CourseMutex.Lock()
					delete(utils.CourseChannels, courseId)
					utils.CourseMutex.Unlock()

					return
				}

			}
		}

	})

	r.Run("localhost:8080")
}
