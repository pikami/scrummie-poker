package handler

import (
	"encoding/json"
	"os"

	"github.com/appwrite/sdk-for-go/appwrite"
	"github.com/appwrite/sdk-for-go/models"
	"github.com/appwrite/sdk-for-go/query"
	"github.com/open-runtimes/types-for-go/v4/openruntimes"
)

type Response struct {
	Message string `json:"message"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

type EstimationSession struct {
	Id           string   `json:"$id"`
	UserID       string   `json:"userId"`
	Name         string   `json:"name"`
	Tickets      []string `json:"tickets"`
	SessionState string   `json:"sessionState"`
	Players      []string `json:"players"`
	PlayerIDs    []string `json:"playerIds"`
}

type EstimationSessionList struct {
	Total     int                 `json:"total"`
	Documents []EstimationSession `json:"documents"`
}

type Player struct {
	UserID string `json:"userId"`
	Name   string `json:"name"`
}

func Main(Context openruntimes.Context) openruntimes.Response {
	databaseId := os.Getenv("APPWRITE_DATABASE_ID")
	collectionId := os.Getenv("APPWRITE_ESTIMATION_SESSION_COLLECTION_ID")
	if databaseId == "" || collectionId == "" {
		Context.Error("Environment variables not provided")
		return Context.Res.Json(ErrorResponse{
			Error: "Environment variables not provided",
		}, Context.Res.WithStatusCode(500))
	}

	var userData models.User
	Context.Req.BodyJson(&userData)
	if userData.Id == "" {
		Context.Log("Request body did not contain id")
		return Context.Res.Json(ErrorResponse{
			Error: "User id was not provided",
		}, Context.Res.WithStatusCode(400))
	}

	client := appwrite.NewClient(
		appwrite.WithEndpoint(os.Getenv("APPWRITE_FUNCTION_API_ENDPOINT")),
		appwrite.WithProject(os.Getenv("APPWRITE_FUNCTION_PROJECT_ID")),
		appwrite.WithKey(Context.Req.Headers["x-appwrite-key"]),
	)
	databases := appwrite.NewDatabases(client)

	queries := []string{query.Contains("playerIds", userData.Id)}
	userEstimationSessions, err := databases.ListDocuments(databaseId, collectionId, databases.WithListDocumentsQueries(queries))
	if err != nil {
		Context.Error(err.Error())
		return Context.Res.Json(ErrorResponse{
			Error: err.Error(),
		}, Context.Res.WithStatusCode(500))
	}

	var documents EstimationSessionList
	err = userEstimationSessions.Decode(&documents)
	if err != nil {
		Context.Error(err.Error())
		return Context.Res.Json(ErrorResponse{
			Error: err.Error(),
		}, Context.Res.WithStatusCode(500))
	}

	newUsername := userData.Name
	if newUsername == "" {
		newUsername = "Guest - " + userData.Id
	}

	for _, estimationSession := range documents.Documents {
		for i, jsonString := range estimationSession.Players {
			var player Player

			err := json.Unmarshal([]byte(jsonString), &player)
			if err != nil {
				Context.Error(err.Error())
				return Context.Res.Json(ErrorResponse{
					Error: err.Error(),
				}, Context.Res.WithStatusCode(500))
			}

			if player.UserID == userData.Id {
				player.Name = newUsername

				updatedPlayer, err := json.Marshal(player)
				if err != nil {
					Context.Error(err.Error())
					return Context.Res.Json(ErrorResponse{
						Error: err.Error(),
					}, Context.Res.WithStatusCode(500))

				}

				estimationSession.Players[i] = string(updatedPlayer)
				break
			}
		}

		patch := map[string]any{"players": estimationSession.Players}
		_, err := databases.UpdateDocument(databaseId, collectionId, estimationSession.Id, databases.WithUpdateDocumentData(patch))
		if err != nil {
			Context.Error(err.Error())
			return Context.Res.Json(ErrorResponse{
				Error: err.Error(),
			}, Context.Res.WithStatusCode(500))
		}

		Context.Log("Updated estimation: ", estimationSession.Id)
	}

	return Context.Res.Json(Response{
		Message: "Updated player name",
	})
}
