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

func AddUser(user utils.User) (int, error) {
	var id int

	err := pool.QueryRow(context.Background(), `INSERT INTO users ( name, email, password) VALUES ($1, $2, $3) RETURNING id`, user.Name, user.Email, user.Password).Scan(&id)
	return id, err
}
func GetUserByEmail(email string) (utils.User, error) {
	var user utils.User
	row := pool.QueryRow(context.Background(), "SELECT id, name, email, password FROM users WHERE email = $1", email)
	err := row.Scan(&user.Id, &user.Name, &user.Email, &user.Password)
	return user, err
}
func AddCourse(course utils.Course) (string, error) {
	var id string
	fmt.Println(course.Docs, "docs", course.Pyqs, "pyqs")
	err := pool.QueryRow(context.Background(), `INSERT INTO course (title, mode, docs,pyqs,userId,"processingData") VALUES ($1, $2, $3, $4, $5,$6) RETURNING id`,
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
func GetCourses(userId int) ([]utils.Course, error) {

	var courses []utils.Course
	fmt.Println("THIS IS USER ID in courses", userId)
	rows, err := pool.Query(context.Background(), `SELECT id, title, mode, docs, pyqs FROM course WHERE userId = $1`, userId)
	print("THIS IS ROWS", rows)
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
	fmt.Print(courses)

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return courses, nil
}

func UpdateProcessingStatus(courseId string, filename string, status bool) error {

	srin := fmt.Sprintf(`UPDATE course SET "processingData" = jsonb_set("processingData", '{%s,status}', to_jsonb(true),false) WHERE id = $1`, filename)
	_, err := pool.Exec(context.Background(), srin, courseId)
	if err != nil {
		return err
	}

	return nil

}