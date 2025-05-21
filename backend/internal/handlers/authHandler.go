package handlers

import (
	"context"
	"fileTransfer/internal/config"
	"fileTransfer/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var googleOauthConfig *oauth2.Config

func InitGoogleAuth() {
	googleOauthConfig = &oauth2.Config{
		RedirectURL:  config.GoogleConfig.RedirectURL,
		ClientID:     config.GoogleConfig.ClientID,
		ClientSecret: config.GoogleConfig.ClientSecret,
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.profile",
			"https://www.googleapis.com/auth/userinfo.email",
		},
		Endpoint: google.Endpoint,
	}
}

func (h *Handlers) GoogleLogin(c *gin.Context) {
	url := googleOauthConfig.AuthCodeURL("random") // In production, generate a secure state value
	c.Redirect(http.StatusTemporaryRedirect, url)
}

func (h *Handlers) GoogleCallback(c *gin.Context) {
	state := c.Query("state")
	if state != "random" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid state"})
		return
	}

	code := c.Query("code")
	token, err := googleOauthConfig.Exchange(context.Background(), code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Token exchange failed"})
		return
	}

	client := googleOauthConfig.Client(context.Background(), token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user info"})
		return
	}
	defer resp.Body.Close()

	user, err := models.ParseGoogleUser(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse user"})
		return
	}

	dbUser, err := h.UserDbRepo.FindOrCreateUser(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	jwtToken, err := h.JWT.GenerateToken(dbUser.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create token"})
		return
	}

	c.Set("Id", dbUser.ID)
	c.JSON(http.StatusOK, gin.H{
		"token": jwtToken,
		"user": gin.H{
			"name":  dbUser.Name,
			"email": dbUser.Email,
		},
	})
}
