package database

import (
	"context"

	"fmt"

	// "github.com/jackc/pgx/v4"
	"CourseCrafter/utils"

	"github.com/gofor-little/env"
	"github.com/jackc/pgx/v4"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

var pool *pgxpool.Pool

func Connect() error {
	var err error
	pool, err = pgxpool.Connect(context.Background(), fmt.Sprintf("host=%s user=%s password=%s dbname=coursecrafter",env.Get("DATABASE_HOST",""),env.Get("DATABASE_USER",""),env.Get("DATABASE_PASS","")))
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
func UserExists(userId int) (bool, utils.User) {
	var user utils.User
	row := pool.QueryRow(context.Background(), `SELECT id, name, email, password,"profileImage" FROM users WHERE id = $1`, userId)
	err := row.Scan(&user.Id, &user.Name, &user.Email, &user.Password, &user.ProfileImage)
	if err == pgx.ErrNoRows {
		return false, user
	} else if err != nil {
		return false, user
	}
	return true, user
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

func CreateUser(user utils.User) (string, error) {

	var existingEmail string
	err := pool.QueryRow(context.Background(), "SELECT email FROM users WHERE email = $1", user.Email).Scan(&existingEmail)
	if err == nil {
		return "", fmt.Errorf("email already exists")
	} else if err != pgx.ErrNoRows {
		return "", err
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}

	var id string
	err = pool.QueryRow(context.Background(), "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id", user.Name, user.Email, string(hashedPassword)).Scan(&id)
	if err != nil {
		return "", err
	}

	return id, nil
}

func Login(user utils.User) (int, error) {
	var dbPassword string
	var userID int
	row := pool.QueryRow(context.Background(), "SELECT id, password FROM users WHERE email = $1", user.Email)
	err := row.Scan(&userID, &dbPassword)
	if err != nil {
		return 0, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(dbPassword), []byte(user.Password)); err != nil {
		return 0, err
	}

	return userID, nil
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
	err := pool.QueryRow(context.Background(), `SELECT title, mode, docs, pyqs, "userId","processingData","progressData" FROM course WHERE id = $1`, id).Scan(&course.Title, &course.Mode, &course.Docs, &course.Pyqs, &course.UserId, &course.ProcessingData, &course.ProgressData)
	if err != nil {
		return course, err
	}
	return course, nil
}
func GetCourses(userId int, bookmark *bool) ([]utils.Course, error) {

	var courses []utils.Course
	fmt.Println("THIS IS USER ID in courses", userId)
	var query string
	var args []interface{}

	if bookmark == nil {
		query = `SELECT id, title, mode, docs, pyqs, "isBookmark", progress, "createdAt","totalChapters","progressData" FROM course WHERE "userId" = $1`
		args = append(args, userId)
	} else {
		query = `SELECT id, title, mode, docs, pyqs, "isBookmark", progress, "createdAt","totalChapters","progressData" FROM course WHERE "userId" = $1 AND "isBookmark" = $2`
		args = append(args, userId, *bookmark)
	}
	rows, err := pool.Query(context.Background(), query, args...)

	print("THIS IS ROWS", rows)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var course utils.Course
		err := rows.Scan(&course.Id, &course.Title, &course.Mode, pq.Array(&course.Docs), pq.Array(&course.Pyqs), &course.IsBookmark, &course.Progress, &course.CreatedAt, &course.TotalChapters, &course.ProgressData)
		if err == pgx.ErrNoRows {
			continue
		}
		if err != nil {
			return nil, err
		}
		course.UserId = userId
		courses = append(courses, course)
	}
	fmt.Println(courses)

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

func DeleteCourse(id string) error {
	_, err := pool.Exec(context.Background(), `DELETE FROM course WHERE id = $1`, id)
	if err != nil {
		return err
	}
	return nil
}

func UpdateBookmarkStatus(courseId string, bookmark bool) error {
	_, err := pool.Exec(context.Background(), `UPDATE course SET "isBookmark" = $1 WHERE id = $2`, bookmark, courseId)
	if err != nil {
		return err
	}
	return nil
}

func UpdateProgress(courseId string, topicIndex string) error {
	//get previous progress DATA of a topic
	fmt.Println(topicIndex, "topicIndex")
	var prevProgress bool = false
	existsQuery := `
    SELECT ("progressData" ? $2) 
    FROM course
    WHERE id = $1
`
	err := pool.QueryRow(context.Background(), existsQuery, courseId, topicIndex).Scan(&prevProgress)

	if err != nil {
		if err == pgx.ErrNoRows {
			fmt.Println("no progress data found for topicIndex", topicIndex)
			prevProgress = false
		} else {
			fmt.Printf("error in getting progress data for topicIndex %d: %v\n", topicIndex, err)
			return err
		}
	}

	if !prevProgress {
		srin := fmt.Sprintf(`UPDATE course SET "progressData" = ("progressData" || '{"%s":true}' ) WHERE id = $1`, topicIndex)
		_, err = pool.Exec(context.Background(), srin, courseId)
		if err != nil {
			fmt.Println("error in sfsdfsf progress data for topicIndex", topicIndex)
			return err
		}

		// increment progress by 1

		_, err = pool.Exec(context.Background(), `UPDATE course SET progress = progress + 1 WHERE id = $1`, courseId)
		if err != nil {
			return err
		}
	}
	return nil
}

func UpdateTotalChapters(courseId string, totalChapters int) error {
	_, err := pool.Exec(context.Background(), `UPDATE course SET "totalChapters" = $2 WHERE id = $1`, courseId, totalChapters)
	if err != nil {
		return err
	}
	return nil
}
