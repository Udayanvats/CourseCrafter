package utils

import (
	"fmt"
	"sync"
)

var (
	CourseChannels = make(map[string]chan []byte)

	CourseMutex sync.Mutex
)

type CourseContent struct {
	Content       string `json:"content"`
	ContentMutex sync.Mutex
}

var (
	CourseContentMap   = make(map[string]*CourseContent)
	CourseContentMutex sync.Mutex
)

var (
	CourseStreamChannels = make(map[string]chan StreamResponse)
	CourseStreamMutex    sync.Mutex
)

type Course struct {
	Title          string                    `json:"title"`
	Mode           int                       `json:"mode"`
	Docs           []string                  `json:"docs"`
	Pyqs           []string                  `json:"pyqs"`
	UserId         string                    `json:"userId"`
	ProcessingData map[string]ProcessingData `json:"processingData"`
}

type ProcessingData struct {
	Status bool   `json:"status"`
	Type   string `json:"type"`
}
type StreamResponse struct {
	Message string  `json:"status"`
	Error   *string `json:"error"`
	Done    bool    `json:"done"`
	// TopicList []string `json:"topicList"`
}

func ListTopicsPrompt(courseJson string) string {
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
	["Topic 1", "Topic 2", "Topic 3", ...]

	Only provide the array , nothing else.
	`, courseJson)
}
func InputPrompt(courseJson string,topicList string) string {
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
	  These are the list of topics extracted from the content:
	%s
	
	Instructions for Note Generation:
	
	Detail-Oriented Notes: Break down the extracted text into detailed study notes. Include explanations, examples, and definitions to ensure comprehensive coverage of the topic. Provide real-world examples to illustrate key concepts and enhance understanding.
	
	Clarity and Simplicity: Ensure that the generated notes are clear and easy to understand. Use concise language and keep the explanations straightforward to facilitate quick comprehension.
	
	Scoring Optimization: Aim to produce study materials that can help students score well in exams. Prioritize accuracy, relevance, and completeness in the generated notes.
	
	Minimum 5 Key Points: Each set of notes should contain a minimum of 5 key points that are essential for understanding the topic thoroughly and scoring well in exams.
	
	JSON Format: Provide the notes in the following JSON format:
	[
	  {
		"topicName": "Topic Name",
		"content": "Detailed notes on the topic.",
		"fileAndPage": [
		  {
			"filename": "Name of the file",
			"pagenumber": Page number,
			"pyqs": ["Possible exam questions related to the topic."]
		  }
		]
	  }
	]
	
	Overall, the generated notes should be detailed, informative, and engaging enough for a student that studies from these notes shouldn't have to search for the same topic ever again.
	
	Additional Context:
	The extracted text contains key concepts, definitions, and explanations presented in a lecture. The goal is to create detailed study notes that include examples and explanations in simple language to assist students in understanding the material thoroughly and quickly, thereby improving their academic performance.
	`, courseJson,topicList)
}
