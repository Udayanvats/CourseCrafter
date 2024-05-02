package cohere

import (
	"context"

	cohere "github.com/cohere-ai/cohere-go/v2"
	cohereclient "github.com/cohere-ai/cohere-go/v2/client"
	// "github.com/sashabaranov/go-openai"
)

func CallCohere(authToken string, prompt string) (*cohere.NonStreamedChatResponse, error) {
	client := cohereclient.NewClient(cohereclient.WithToken(authToken))

	response, err := client.Chat(
		context.TODO(),
		&cohere.ChatRequest{
			Message: prompt,
		},
	)
	if err != nil {
		return response, err
	}

	return response, nil
}
