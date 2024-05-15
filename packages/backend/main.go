package main

import (
	"CourseCrafter/auth"
	"CourseCrafter/aws"
	"CourseCrafter/cohere"
	"context"
	"io"
	"runtime"

	// "CourseCrafter/cohere"
	// "CourseCrafter/cohere"
	"CourseCrafter/database"
	"CourseCrafter/rmq"
	"CourseCrafter/utils"

	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func handleStreamingRequest(ctx context.Context, c *gin.Context, courseId string) {
	type Response struct {
		Data           *string `json:"data"`
		Error          *string `json:"error"`
		Done           bool    `json:"done"`
		InitailReponse *string `json:"initailReponse"`
		TopicList      *string `json:"topicList"`
		PyqContent     *string `json:"pyqContent"`
	}

	client := c.Writer
	client.Header().Set("Content-Type", "text/event-stream")
	client.Header().Set("Cache-Control", "no-cache")
	client.Header().Set("Connection", "keep-alive")
	fmt.Printf("started streaming for course %s\n", courseId)
	fmt.Println("file", "topicList/"+courseId+".txt")
	client.Flush()

	channel := utils.CourseStreamChannels[courseId]

	fmt.Println("got here adds")
	topicList, err := aws.GetTextFromS3("topicList/" + courseId + ".txt")

	if err != nil {
		fmt.Println("Failed to get text from S3 fdffdf:", err)
	}
	var topicResponse Response = Response{
		Data:           nil,
		Error:          nil,
		Done:           false,
		InitailReponse: nil,
		TopicList:      &topicList,
	}
	topicJsonResponse, err := json.Marshal(topicResponse)
	if err != nil {
		fmt.Println("error while converting inital res to json", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		c.Writer.Header().Set("Connection", "close")
		return
	}
	client.Write([]byte("data: " + string(topicJsonResponse) + "\n\n"))

	client.Flush()
	utils.CourseContentMutex.Lock()

	utils.CourseContentMutex.Unlock()

	if channel == nil {
		fmt.Println("channel is nil")
		response, err := aws.GetTextFromS3("courses/" + courseId + ".txt")
		// fmt.Println("file reesss", response)
		if err != nil {

			fmt.Println("Failed to get text from S3:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		var res Response = Response{
			Data:           &response,
			Error:          nil,
			Done:           true,
			InitailReponse: nil,
		}
		var jsonResponse, err2 = json.Marshal(res)
		if err2 != nil {
			fmt.Println("error while converting inital res to json", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			c.Writer.Header().Set("Connection", "close")
			return
		}

		client.Write([]byte("data: " + string(jsonResponse) + "\n\n"))
		client.Flush()

		c.Writer.Header().Set("Connection", "close")

		return

	}

	if utils.CourseContentMap[courseId] != nil {
		fmt.Println("HEJED")
		(utils.CourseContentMap[courseId]).ContentMutex.Lock()
		var res Response = Response{
			Data:           &utils.CourseContentMap[courseId].Content,
			Error:          nil,
			Done:           false,
			InitailReponse: nil,
		}
		var jsonResponse, err = json.Marshal(res)
		if err != nil {
			fmt.Println("error while converting inital res to json", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			c.Writer.Header().Set("Connection", "close")
			return
		}

		client.Write([]byte("data: " + string(jsonResponse) + "\n\n"))
		client.Flush()
		utils.CourseContentMap[courseId].ContentMutex.Unlock()
	}

	for {
		select {
		case <-ctx.Done():
			fmt.Println("Context canceled, stopping streaming")
			return
		case message := <-*channel:
			if message.Error != nil {

				fmt.Println("Error received as ", message.Error)
				c.JSON(http.StatusInternalServerError, gin.H{"error": message.Error})
				c.Writer.Header().Set("Connection", "close")
				return

			} else if message.Done {
				fmt.Println("Done received as ", message.Done)
				var res Response = Response{
					Data:           nil,
					Error:          nil,
					Done:           true,
					InitailReponse: nil,
				}

				var jsonResponse, err = json.Marshal(res)
				if err != nil {
					fmt.Println("error while converting inital res to json", err)
					c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
					c.Writer.Header().Set("Connection", "close")
					return
				}

				client.Write([]byte("data: " + string(jsonResponse) + "\n\n"))
				client.Flush()
				break
			} else if message.TopicList != nil {
				fmt.Println("TopicList received as ", message.TopicList)
				var res Response = Response{
					Data:           nil,
					Error:          nil,
					Done:           false,
					InitailReponse: nil,
					TopicList:      message.TopicList,
				}

				var jsonResponse, err = json.Marshal(res)
				if err != nil {
					fmt.Println("error while converting inital res to json", err)
					c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})

					c.Writer.Header().Set("Connection", "close")
					return
				}

				client.Write([]byte("data: " + string(jsonResponse) + "\n\n"))
				client.Flush()
			} else if message.PyqContent != nil {
				fmt.Println("PyqContent received as ", message.PyqContent)
				var res Response = Response{
					Data:           nil,
					Error:          nil,
					Done:           false,
					InitailReponse: nil,
					PyqContent:     message.PyqContent,
				}

				var jsonResponse, err = json.Marshal(res)
				if err != nil {
					fmt.Println("error while converting inital res to json", err)
					c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
					c.Writer.Header().Set("Connection", "close")
					return
				}

				client.Write([]byte("data: " + string(jsonResponse) + "\n\n"))

				client.Flush()

			} else {
				// fmt.Println("Message received as ", message.Message)
				utils.CourseContentMap[courseId].ContentMutex.Lock()
				utils.CourseContentMap[courseId].Content += message.Message
				utils.CourseContentMap[courseId].ContentMutex.Unlock()
				var res Response = Response{
					Data:           &message.Message,
					Error:          nil,
					Done:           false,
					InitailReponse: nil,
				}
				var jsonResponse, err = json.Marshal(res)
				if err != nil {
					fmt.Println("error while converting inital res to json", err)
					c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
					c.Writer.Header().Set("Connection", "close")
					return
				}

				client.Write([]byte("data: " + string(jsonResponse) + "\n\n"))
				client.Flush()
			}
		}
	}
}

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
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type"},
		AllowCredentials: true,
	}))

	r.POST("/pyqs", func(c *gin.Context) {
		// topicList := cohere.StartGenerationTopics(extracted_json, notification.CourseId)
		topicList, err := aws.GetTextFromS3("topicList/589d18c5-1ae4-4713-9ff2-ce038c11bc85.txt")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		fmt.Print("TOPIC LIST :", topicList)
		pyqContent, err := aws.GetTextFromS3("text/589d18c5-1ae4-4713-9ff2-ce038c11bc85.json")
		var data utils.Data
		if err := json.Unmarshal([]byte(pyqContent), &data); err != nil {
			fmt.Println("Error:", err)
			return
		}
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		// fmt.Print("PYQ CONTENT", data.Pyqs[0].Contents)
		// pyqAnalysis := cohere.PyqsGeneration(data.Pyqs[0].Contents, topicList,channel)
		fmt.Print(pyqContent)

		// c.JSON(http.StatusOK, pyqAnalysis)
	})

	r.GET("/auth/google/url", auth.GetGoogleUrl)
	r.POST("/auth/google/login", auth.LoginWithGoogle)

	r.POST("/login", func(c *gin.Context) {
		var user utils.User
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		dbUser, err := database.GetUserByEmail(user.Email)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid email or password"})
			return
		}
		if err := bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(user.Password)); err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid email or password"})
			return
		}
		tokenString, err := auth.GenerateToken(dbUser.Id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
			return
		}

		c.SetCookie("token", tokenString, 3600, "/", "", false, true)
		c.JSON(http.StatusOK, gin.H{"token": tokenString})
	})

	r.POST("/signup", func(c *gin.Context) {
		var user utils.User
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		user.Password, err = auth.HashPassword(user.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to hash password"})
			return
		}
		user.Id, err = database.AddUser(user)
		fmt.Print(err)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create user"})
			return
		}
		tokenString, err := auth.GenerateToken(user.Id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
			return
		}
		c.SetCookie("token", tokenString, 3600, "/", "", false, true)
		c.SetCookie("userId", strconv.Itoa(user.Id), 3600, "/", "", false, true)
		c.JSON(http.StatusOK, gin.H{"token": tokenString})
	})

	r.POST("/upload", auth.AuthMiddleware(), func(c *gin.Context) {
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
		userID, _ := c.Get("userId")
		userId, _ := userID.(int)
		fmt.Println(userId, "userId")

		modeInt, err := strconv.Atoi(modeStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid mode"})
			return
		}
		mode := utils.Mode(modeInt)
		fmt.Println(mode, "modeInt")

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
			fileExt := strings.Split(header.Filename, ".")[1]
			newFilename := uuid.New().String() + "." + fileExt
			objectKey := "files/" + newFilename
			err = aws.UploadFileToS3(objectKey, file)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

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
			fileExt := strings.Split(header.Filename, ".")[1]
			newFilename := uuid.New().String() + "." + fileExt
			objectKey := "files/" + newFilename
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
		//initialting course id in upload test
		utils.CourseStreamMutex.Lock()
		channel := make(chan utils.StreamResponse)
		utils.CourseStreamChannels[courseId] = &channel
		utils.CourseStreamMutex.Unlock()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"erroerer": err.Error()})
			return
		}

		fmt.Println("THIS IS COURSE ID", courseId)

		newChannel := make(chan []byte)
		utils.CourseMutex.Lock()
		utils.CourseProcessingChannels[courseId] = newChannel
		utils.CourseMutex.Unlock()

		var response struct {
			CourseId string     `json:"courseId"`
			Docs     []string   `json:"docs"`
			Pyqs     []string   `json:"pyqs"`
			Mode     utils.Mode `json:"mode"`
		}

		response.CourseId = courseId
		response.Docs = docsArr
		response.Pyqs = pyqsArr
		response.Mode = mode

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

	r.GET("/courses", auth.AuthMiddleware(), func(c *gin.Context) {
		userID, _ := c.Get("userId")

		fmt.Println("This is the userID", userID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "userId is required"})
			return
		}
		userId, _ := userID.(int)
		// userIdnum, _ := strconv.Atoi(userId)
		fmt.Print("THIS IS USER ID being sent", userId)
		courses, err := database.GetCourses(userId)
		if err != nil {
			fmt.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		fmt.Println(courses, "coursesseses")
		c.JSON(http.StatusOK, courses)
	})

	r.GET("/courses/:courseId/status", auth.AuthMiddleware(), func(c *gin.Context) {
		fmt.Println("WE ARE HERE IN STATUS")
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
		// allDone := true
		// for _, data := range course.ProcessingData {
		// 	if !data.Status {
		// 		allDone = false
		// 		break
		// 	}
		// }

		// if allDone {
		// 	var doneResponse ProcessingES
		// 	doneResponse.Done = true
		// 	doneResponseString, err := json.Marshal(doneResponse)
		// 	if err != nil {
		// 		fmt.Println("error while converting done res to json", err)
		// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		// 		c.Writer.Header().Set("Connection", "close")

		// 		return
		// 	}
		// 	client.Write([]byte("data: " + string(doneResponseString) + "\n\n"))
		// 	client.Flush()
		// 	c.Writer.Header().Set("Connection", "close")

		// 	return
		// }

		channel := utils.CourseProcessingChannels[courseId]

		for message := range channel {
			// fmt.Println("messageeeee", string(message))
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

	// r.GET("/coursecontent/:courseId", func(c *gin.Context) {
	// 	courseId := c.Param("courseId")
	// 	client := c.Writer
	// 	client.Header().Set("Content-Type", "text/event-stream")
	// 	client.Header().Set("Cache-Control", "no-cache")
	// 	client.Header().Set("Connection", "keep-alive")
	// 	fmt.Printf("started streaming for course %s\n", courseId)

	// 	//get alrready generated content
	// 	utils.CourseContentMutex.Lock()
	// 	courseContent := utils.CourseContentMap[courseId]
	// 	utils.CourseContentMutex.Unlock()

	// 	courseContentMutex := courseContent.ContentMutext
	// 	courseContentMutex.Lock()
	// 	client.Write([]byte("data: " + courseContent.Content + "\n\n"))
	// 	client.Flush()
	// 	courseContentMutex.Unlock()

	// 	//now get relatime content

	// 	channel := utils.CourseStreamChannels[courseId]

	// 	for message := range channel {
	// 		//send to user
	// 	}

	// // })

	r.GET("/cohere", auth.AuthMiddleware(), func(c *gin.Context) {
		extracted_json, err := aws.GetTextFromS3("text/c715e1cf-6c59-4130-820f-d42cb154bd79.json")
		if err != nil {
			fmt.Println("Failed to get text from S3 dcsdfwef:", err)
		}
		// fmt.Print(extracted_json)

		topicList := cohere.StartGenerationTopics(extracted_json, "c715e1cf-6c59-4130-820f-d42cb154bd79")
		c.JSON(http.StatusOK, gin.H{
			"code":    http.StatusOK,
			"message": string(topicList)})
	})

	r.GET("/coursecontent/:courseId", func(c *gin.Context) {
		courseId := c.Param("courseId")

		numGoroutines := runtime.NumGoroutine()
		fmt.Println("numGoroutines", numGoroutines)
		ctx, cancel := context.WithCancel(c.Request.Context())
		defer cancel() // Cancel the context when the handler function returns
		handleStreamingRequest(ctx, c, courseId)
	})
	r.POST("/deleteCourse", auth.AuthMiddleware(), func(c *gin.Context) {
		var res struct {
			CourseId string `json:"courseId"`
		}
		requestBody, err := io.ReadAll(c.Request.Body)
		if err != nil {
			fmt.Println("error while reading request body", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		fmt.Println(string(requestBody))
		defer c.Request.Body.Close()
		err = json.Unmarshal(requestBody, &res)
		if err != nil {
			fmt.Println("error while decoding request body", err)
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		courseId := res.CourseId
		fmt.Println("courseId", courseId)

		err = database.DeleteCourse(courseId)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Course deleted successfully"})
	})

	r.GET("/isLoggedIn", func(c *gin.Context) {
		token, err := c.Cookie("token")
		if err != nil {
			fmt.Println("")
			c.JSON(http.StatusOK, gin.H{"auth": false})
			return
		}

		userId, err := auth.VerifyToken(token)
		fmt.Print(err)

		if err != nil {
			c.JSON(http.StatusOK, gin.H{"auth": false})

			return
		}

		fmt.Println("USER ID IN MIDDLEWARE", userId)
		c.JSON(http.StatusOK, gin.H{"auth": true})

	})

	r.Run("localhost:8080")
}
