package utils

import "sync"


var (
	CourseChannels     = make(map[string]chan []byte)
	CourseMutex       sync.Mutex
)

type Course struct {
	Title string `json:"title"`
	Mode int `json:"mode"`
	Docs []string `json:"docs"`
	Pyqs []string `json:"pyqs"`
	UserId string `json:"userId"`

}


