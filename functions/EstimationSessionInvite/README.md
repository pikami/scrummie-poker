# Estimation Session Invite Function

This function allows other users to join an existing estimation session by providing it's Id.

## Usage

### GET /?action=get-info&estimationId=[session-id]

- Gets session's information by id

**Response**

Sample `200` Response:

```json
{
  "id": "session-id",
  "name": "session name"
}
```

### GET /?action=join&estimationId=[session-id]

- Joins session by id

**Response**

Sample `200` Response:

```json
{
  "message": "Estimation session joined"
}
```

## Environment Variables

- APPWRITE_DATABASE_ID - Database Id
- APPWRITE_ESTIMATION_SESSION_COLLECTION_ID - Sessions collection Id
