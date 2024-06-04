package auth

import (
	"CourseCrafter/database"
	"CourseCrafter/utils"
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gofor-little/env"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/googleapi"
	oauth2pkg "google.golang.org/api/oauth2/v2"
	"google.golang.org/api/option"
)

var jwtSecret = []byte(env.Get("JWT_SECRET", ""))

func GetGoogleUrl(c *gin.Context) {
	GOOGLE_CLIENT_ID := env.Get("GOOGLE_CLIENT_ID", "")
	GOOGLE_CLIENT_SECRET := env.Get("GOOGLE_CLIENT_SECRET", "")
	conf := &oauth2.Config{
		ClientID:     GOOGLE_CLIENT_ID,
		ClientSecret: GOOGLE_CLIENT_SECRET,
		RedirectURL:  fmt.Sprintf("%x,/loggedIn", env.Get("FRONTEND_URL", "https://localhost:3000")),
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		Endpoint: google.Endpoint,
	}
	url := conf.AuthCodeURL("state")
	c.JSON(http.StatusOK, gin.H{"url": url})
}

func LoginWithGoogle(c *gin.Context) {
	GOOGLE_CLIENT_ID := env.Get("GOOGLE_CLIENT_ID", "")
	GOOGLE_CLIENT_SECRET := env.Get("GOOGLE_CLIENT_SECRET", "")
	// Assuming you have a PostgreSQL database connection named "db"

	code := struct {
		Code string `json:"code"`
	}{}
	if err := c.BindJSON(&code); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	conf := &oauth2.Config{
		ClientID:     GOOGLE_CLIENT_ID,
		ClientSecret: GOOGLE_CLIENT_SECRET,
		RedirectURL:  fmt.Sprintf("%x,/loggedIn", env.Get("FRONTEND_URL", "https://localhost:3000")),
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.profile",
			"https://www.googleapis.com/auth/userinfo.email",
		},
		Endpoint: google.Endpoint,
	}

	ctx := context.Background()
	tok, err := conf.Exchange(ctx, code.Code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to exchange token"})
		return
	}

	oauth2Service, err := oauth2pkg.NewService(ctx, option.WithScopes("https://www.googleapis.com/auth/userinfo.profile"), option.WithTokenSource(conf.TokenSource(ctx, tok)))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to create OAuth2 service"})
		return
	}

	userinfoService := oauth2pkg.NewUserinfoService(oauth2Service)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to create Userinfo service"})
		return
	}
	var ID int
	userInfo, err := userinfoService.Get().Do(googleapi.QueryParameter("access_token", tok.AccessToken))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to get user info"})
		return
	}
	fmt.Println(userInfo.Email, "UserInfo.emmail")
	user := utils.User{Name: userInfo.Name, Email: userInfo.Email, Password: userInfo.Email, ProfileImage: &userInfo.Picture}

	// Assuming you have a function AddUser in your database package
	loggedUser, err := database.GetUserByEmail(userInfo.Email)
	if err != nil {

		id, err := database.AddUser(user)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to create user"})
			return
		}
		ID = id
	} else {
		ID = loggedUser.Id
	}

	// Generate JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": userInfo.Name,
		"id":       ID,
	})

	// Generate the token string
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to generate JWT token"})
		return
	}

	// Set JWT token in cookie
	c.SetCookie("token", tokenString, 3600*24, "/", "", false, true)

	c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("User %s created", userInfo.Name)})
}

func GenerateToken(userId int) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":  userId,
		"exp": time.Now().Add(time.Hour * 24).Unix(), // Token expires in 24 hours
	})

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(hashedPassword), err
}
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		token, err := c.Cookie("token")
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing token", "authError": true})
			return
		}

		userId, err := VerifyToken(token)
		fmt.Print(err)

		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token", "authError": true})
			return
		}

		exists, _ := database.UserExists(userId)
		if !exists {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "User not found", "authError": true})
		}

		fmt.Println("USER ID IN MIDDLEWARE", userId)
		c.Set("userId", userId)

		c.Next()
	}
}
func VerifyToken(tokenString string) (int, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Check the signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtSecret, nil
	})
	if err != nil {
		return 0, err
	}

	// Check if the token is valid
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		fmt.Println(claims["id"], "asdfSAD")
		userID := int(claims["id"].(float64))

		return userID, nil
	} else {
		return 0, fmt.Errorf("invalid token")
	}
}
