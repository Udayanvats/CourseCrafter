package cohere

import (
	"CourseCrafter/aws"
	"context"
	"fmt"

	cohere "github.com/cohere-ai/cohere-go/v2"
	cohereclient "github.com/cohere-ai/cohere-go/v2/client"
	"github.com/cohere-ai/cohere-go/v2/core"
	"github.com/gofor-little/env"
	// "github.com/sashabaranov/go-openai"
)

func CohereTest() (*core.Stream[cohere.StreamedChatResponse], error) {
	var cohereToken = env.Get("COHERE_API_KEY", "")

	extracted_json, err := aws.GetTextFromS3("text/c715e1cf-6c59-4130-820f-d42cb154bd79.json")

	if err != nil {
		fmt.Println("Failed to get text from S3:", err)
	}
	// fmt.Print(extracted_json)
	prompt := fmt.Sprintf(`
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
The above provided json is which you have to analyze for the below given instructions.
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
`, extracted_json)

	generateContent, err := CallCohere(cohereToken, prompt)
	if err != nil {
		panic("failed to generate content: " + err.Error())
	}
	fmt.Println(generateContent, "Extracted text")
	// fmt.Println(extracted_json, "Extracted text")
	return generateContent, nil

}

// func CallCohere(authToken string, prompt string) (*cohere.NonStreamedChatResponse, error) {
// 	client := cohereclient.NewClient(cohereclient.WithToken(authToken))

// 	response, err := client.Chat(
// 		context.TODO(),
// 		&cohere.ChatRequest{
// 			Message: prompt,
// 		},
// 	)
// 	if err != nil {
// 		return response, err
// 	}

//		return response, nil
//	}
func CallCohere(authToken string, prompt string) (*core.Stream[cohere.StreamedChatResponse], error) {
	client := cohereclient.NewClient(cohereclient.WithToken(authToken))

	// Start a streaming chat session
	stream, err := client.ChatStream(
		context.TODO(),
		&cohere.ChatStreamRequest{
			Message: prompt,
		},
	)
	if err != nil {
		return nil, err
	}

	return stream, nil
}
