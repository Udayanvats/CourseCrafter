package database

import (
	"context"

	"fmt"

	// "github.com/jackc/pgx/v4"
	"CourseCrafter/utils"

	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/lib/pq"
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
	err := pool.QueryRow(context.Background(), `INSERT INTO course (title, mode, docs,pyqs,userId) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
		course.Title, course.Mode, course.Docs, course.Pyqs, course.UserId).Scan(&id)

	if err != nil {
		return "", err
	}
	return id, nil
}

func GetCourses(userId string) ([]utils.Course, error) {
	fmt.Print("DATABSE MEH", userId)
	var courses []utils.Course

	rows, err := pool.Query(context.Background(), `SELECT id, title, mode, docs, pyqs FROM course WHERE userId = $1`, userId)
	// fmt.Print(rows)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var course utils.Course
		var id string
		err := rows.Scan(&id, &course.Title, &course.Mode, pq.Array(&course.Docs), pq.Array(&course.Pyqs))
		if err != nil {
			return nil, err
		}
		course.UserId = userId
		courses = append(courses, course)
	}
	// fmt.Print(courses)

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return courses, nil
}
