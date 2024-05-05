package main

import (
	"CourseCrafter/aws"
	"CourseCrafter/database"
	"CourseCrafter/rmq"
	"CourseCrafter/utils"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"

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

			pyqsArr = append(pyqsArr, objectKey)
			defer file.Close()
		}

		var course utils.Course
		course.Title = title
		course.Mode = mode
		course.Docs = docsArr
		course.Pyqs = pyqsArr
		course.UserId = userId
		course.ProcessingData = make(map[string]utils.ProcessingData)

		for _, doc := range docsArr {
			fmt.Println(doc, "doc")
			filename := strings.Split(doc, "/")[1]
			course.ProcessingData[filename] = utils.ProcessingData{
				Status: false,
				Type:   "doc",
			}
		}

		for _, pyq := range pyqsArr {
			fmt.Println(pyq, "pyq")
			filename := strings.Split(pyq, "/")[1]

			course.ProcessingData[filename] = utils.ProcessingData{
				Status: false,
				Type:   "pyq",
			}
		}

		fmt.Println(course.ProcessingData, "course")

		courseId, err := database.AddCourse(course)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"erroerer": err.Error()})
			return
		}

		fmt.Println("THIS IS COURSE ID", courseId)

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
		fmt.Printf("started streaming for course %s\n", courseId)

		course, err := database.GetCourse(courseId)
		if err != nil {
			fmt.Println("error while getting course", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			c.Writer.Header().Set("Connection", "close")

			return
		}
		fmt.Println(course)

		processingData, err := json.Marshal(course.ProcessingData)
		fmt.Println("processing data stinfff ", string(processingData))
		if err != nil {
			fmt.Println("error while converting processing data to json", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			c.Writer.Header().Set("Connection", "close")

			return
		}

		type ProcessingES struct {
			Data           string `json:"data"`
			ProcessingData string `json:"processingData"`
			Error          string `json:"error"`
			Done           bool   `json:"done"`
		}

		var initailReponse ProcessingES

		initailReponse.ProcessingData = string(processingData)

		initailReponseString, err := json.Marshal(initailReponse)
		if err != nil {
			fmt.Println("error while converting inital res to json", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			c.Writer.Header().Set("Connection", "close")

			return
		}

		client.Write([]byte("data: " + string(initailReponseString) + "\n\n"))
		client.Flush()

		// if all processing is done
		allDone := true
		for _, data := range course.ProcessingData {
			if !data.Status {
				allDone = false
				break
			}
		}

		if allDone {
			var doneResponse ProcessingES
			doneResponse.Done = true
			doneResponseString, err := json.Marshal(doneResponse)
			if err != nil {
				fmt.Println("error while converting done res to json", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				c.Writer.Header().Set("Connection", "close")

				return
			}
			client.Write([]byte("data: " + string(doneResponseString) + "\n\n"))
			client.Flush()
			c.Writer.Header().Set("Connection", "close")

			return
		}

		channel := utils.CourseChannels[courseId]

		for message := range channel {
			fmt.Println("messageeeee", string(message))
			if string(message) == "done" {
				var doneResponse ProcessingES
				doneResponse.Done = true
				doneResponseString, err := json.Marshal(doneResponse)
				if err != nil {
					fmt.Println("error while converting done res to json", err)
					c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
					return
				}
				client.Write([]byte("data: " + string(doneResponseString) + "\n\n"))
				client.Flush()
				break

			}
			var response ProcessingES
			response.Data = string(message)

			responseJson, err := (json.Marshal(response))
			if err != nil {
				fmt.Println("error while converting response to json", err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				c.Writer.Header().Set("Connection", "close")

				return
			}

			client.Write([]byte("data: " + string(responseJson) + "\n\n"))
			client.Flush()

		}

		client.Flush()
		c.Writer.Header().Set("Connection", "close")


	})

	r.Run("localhost:8080")
}
