package database

import (
	"context"

	"fmt"

	// "github.com/jackc/pgx/v4"
	"CourseCrafter/utils"

	"github.com/jackc/pgx/v4/pgxpool"
	// "github.com/lib/pq"
)

var pool *pgxpool.Pool

func Connect() error {
	var err error
	pool, err = pgxpool.Connect(context.Background(), "host=localhost user=postgres password=postgres dbname=coursecrafter sslmode=disable")
	if err != nil {
		fmt.Printf("Unable to connect to database: %v\n", err)
		return err
	}
	return nil
}

func Disconnect() {
	pool.Close()
}

func AddCourse(course utils.Course) (string, error) {
	var id string
	fmt.Println(course.Docs, "docs", course.Pyqs, "pyqs")
	err := pool.QueryRow(context.Background(), `INSERT INTO course (title, mode, docs,pyqs,"userId","processingData") VALUES ($1, $2, $3, $4, $5,$6) RETURNING id`,
		course.Title, course.Mode, course.Docs, course.Pyqs, course.UserId, course.ProcessingData).Scan(&id)

	if err != nil {
		return "", err
	}
	return id, nil
}
func UpdateCourse(course utils.Course) error {
	_, err := pool.Exec(context.Background(), `UPDATE course SET title = $1, mode = $2, docs = $3, pyqs = $4, "userId" = $5, "processingData" = $6 WHERE id = $7`,
		course.Title, course.Mode, course.Docs, course.Pyqs, course.UserId, course.ProcessingData, course.UserId)
	if err != nil {
		return err
	}
	return nil
}

func GetCourse(id string) (utils.Course, error) {
	var course utils.Course
	err := pool.QueryRow(context.Background(), `SELECT title, mode, docs, pyqs, "userId","processingData" FROM course WHERE id = $1`, id).Scan(&course.Title, &course.Mode, &course.Docs, &course.Pyqs, &course.UserId, &course.ProcessingData)
	if err != nil {
		return course, err
	}
	return course, nil
}

func UpdateProcessingStatus(courseId string, filename string, status bool) error {


	srin := fmt.Sprintf(`UPDATE course SET "processingData" = jsonb_set("processingData", '{%s,status}', to_jsonb(true),false) WHERE id = $1`, filename)
	_, err := pool.Exec(context.Background(), srin, courseId)
	if err != nil {
		return err
	}

	return nil

}
