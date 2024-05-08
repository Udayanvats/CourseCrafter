package utils

import (
	"encoding/json"
	"fmt"
	"sync"
	"github.com/gofor-little/env"
)

type TopicListObjectType struct {
	Topic     string   `json:"topic"`
	SubTopics []string `json:"subTopics"`
}

var (
	CourseProcessingChannels = make(map[string]chan []byte)

	CourseMutex sync.Mutex
)

type CourseContent struct {
	Content      string `json:"content"`
	ContentMutex sync.Mutex
}

var (
	CourseContentMap   = make(map[string]*CourseContent)
	CourseContentMutex sync.Mutex
)

var (
	CourseStreamChannels = make(map[string]*chan StreamResponse)
	CourseStreamMutex    sync.Mutex
)

type Mode int

const (
	Simple Mode = iota
	Detailed
)


type User struct {
	Id       int    `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}
type Course struct {
	Title          string                    `json:"title"`
	Mode           Mode                      `json:"mode"`
	Docs           []string                  `json:"docs"`
	Pyqs           []string                  `json:"pyqs"`
	UserId         int                       `json:"userId"`
	ProcessingData map[string]ProcessingData `json:"processingData"`
}

type ProcessingData struct {
	Status bool   `json:"status"`
	Type   string `json:"type"`
}
type StreamResponse struct {
	Message   string  `json:"status"`
	Error     *string `json:"error"`
	Done      bool    `json:"done"`
	TopicList *string `json:"topicList"`
}

var jwtSecret = []byte(env.Get("JWT_SECRET", ""))

func ListTopicsPrompt(courseJson string) string {
	fmt.Println(courseJson,"courseJSonnnnn  asds")
	return fmt.Sprintf(`
	"The following is the JSON format in which the input will be provided to you:"

	Input JSON Format:
	[
	  {
		"content": "Content on a page of a PPT/PDF.",
		"pageNumber": Page number
	  },
	  {
		"content": "Next content on another page.",
		"pageNumber": Page number
	  },
	  ...
	]
	%s
	
	Instructions for Extracting Topics:
	
	Extract topics from the provided content on each page and organize them into an array.
	
	Overall, the goal is to identify the main topics covered in the presentation content.
	Output format of the topic should be an array of strings containing the extracted topics.
	Output format:
	[
		{
			topic:string,
			subtopics:[string]
		},
		...
	]

	Only provide the array , nothing else, Do NOT provide additional text or syymbols , start from array end with array.
	`, courseJson)
}
func InputPrompt(courseJson string, topicList string) string {
	return fmt.Sprintf(`
	"The following is the json format in which the input will be provided to you:"
	
	
	Input JSON Format:
	[
	  {
		"content": "Content on a page of a PPT/PDF.",
		
	  },
	  {
		"content": "Next content on another page.",
		
	  },
	  ...
	]
	
	%s
	  These are the list of topics extracted from the content:
	%s
	
	Instructions for Note Generation:
	
	Detail-Oriented Notes: Break down the extracted text into detailed study notes. Include explanations, examples, and definitions to ensure comprehensive coverage of the topic. Provide real-world examples to illustrate key concepts and enhance understanding.
	
	Clarity and Simplicity: Ensure that the generated notes are clear and easy to understand. Use concise language and keep the explanations straightforward to facilitate quick comprehension.
	
	Scoring Optimization: Aim to produce study materials that can help students score well in exams. Prioritize accuracy, relevance, and completeness in the generated notes.
	
	Minimum 5 Key Points: Each set of notes should contain a minimum of 5 key points that are essential for understanding the topic thoroughly and scoring well in exams.
	
	IMPORTANT(MY LIFE IS ON STAKE IF YOU DONT FOLLOW THIS):You have to only return the json , do not return any additional text or symbols or code indicators, do not add anything at start end no code indicators,start from array end with array.


	JSON Format: Provide the notes in the following JSON format:
	[
	  {
		
		Introduction: Introduction to the topic1,
		Content:[
			content of subtopic1,
			content of subtopic2,
			...
		],
		Conculsion: Conclusion of the topic1

		
	  },
	  {

		Introduction: Introduction to the topic2,
		Content:[
			content of subtopic1,
			content of subtopic2,
			...
		],
		Conculsion: Conclusion of the topic2
	  },
	  ...
	]



	Introduction should be detailed and should provide a brief overview of the topic.
	Content should be very descriptive and should contain all the key points and subpoints.You should make it atleast 10 points.
	Conclusion should be a summary of all the important parts of the topic.

	
	Overall, the generated notes should be detailed, informative, and engaging enough for a student that studies from these notes shouldn't have to search for the same topic ever again.
	
	Additional Context:
	The extracted text contains key concepts, definitions, and explanations presented in a lecture. The goal is to create detailed study notes that include examples and explanations in simple language to assist students in understanding the material thoroughly and quickly, thereby improving their academic performance.
	`, courseJson, topicList)
}

func DetailedPrompt(courseJson string, topicList TopicListObjectType) string {
	jsonstring, err := json.Marshal(topicList)
	if err != nil {
		return ""
	}
	fmt.Println(string(jsonstring))
	return fmt.Sprintf(`
	"The following is the json format in which the input will be provided to you:"
	
	
	Input JSON Format:
	[
	  {
		"content": "Content on a page of a PPT/PDF.",
		"pageNumber": Page number
	  },
	  {
		"content": "Next content on another page.",
		"pageNumber": Page number
	  },
	  ...
	]
	
	%s

	  This is the Topic and subtopics extracted from the content:

	%s
	
	Instructions for Note Generation:
	
	Detail-Oriented Notes: Break down the extracted text into detailed study notes. Include explanations, examples, and definitions to ensure comprehensive coverage of the topic. Provide real-world examples to illustrate key concepts and enhance understanding.
	
	Clarity and Simplicity: Ensure that the generated notes are clear and easy to understand. Use concise language and keep the explanations straightforward to facilitate quick comprehension.
	
	Scoring Optimization: Aim to produce study materials that can help students score well in exams. Prioritize accuracy, relevance, and completeness in the generated notes.
	
	Minimum 5 Key Points: Each set of notes should contain a minimum of 5 key points that are essential for understanding the topic thoroughly and scoring well in exams.
	
	JSON Format: Provide the notes in the following JSON format, Provide the JSON Object:
	
	
	{	
		"Introduction": string,
		"Content":[
			string,
			string,
			...
		],
		"Conclusion": string,
	}
	

	More Intructions:
	Introduction -> Detailed description of the topic.
	Content ->  Should be array , each element should content detailed description of the subtopic, it should be atleast 10 points,around  200 words.
	Conclusion -> Summary of all the important parts of the topic.

	You have to only return the json Object , and not an Array , do not return any additional text or symbols or code indicators.
	
	Overall, the generated notes should be detailed, informative, and engaging enough for a student that studies from these notes shouldn't have to search for the same topic ever again.
	
	Additional Context:
	The extracted text contains key concepts, definitions, and explanations presented in a lecture. The goal is to create detailed study notes that include examples and explanations in simple language to assist students in understanding the material thoroughly and quickly, thereby improving their academic performance.
	`, courseJson, string(jsonstring))
}

// func ValidateToken(tokenString string) (int, error) {
// 	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
// 		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
// 			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
// 		}
// 		return jwtSecret, nil
// 	})
// 	if err != nil {
// 		return 0, err
// 	}
// 	fmt.Print("Token", token)
// 	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
// 		userId := int(claims["userId"].(float64))
// 		return userId, nil
// 	} else {
// 		return 0, fmt.Errorf("invalid token")
// 	}
// }
