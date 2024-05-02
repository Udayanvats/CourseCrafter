package utils

type Course struct {
	Title string `json:"title"`
	Mode int `json:"mode"`
	Docs []string `json:"docs"`
	Pyqs []string `json:"pyqs"`
	UserId string `json:"userId"`

}


