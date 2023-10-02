# USER API

## Get Refresh Token

Endpoint : GET /v1/token/refresh

Response Body Success :

```json
{
  "code": 201,
  "status": "created",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZUlkIjoyLCJpYXQiOjE2OTYyMTIwMjEsImV4cCI6MTY5NjI5ODQyMX0.BB4WStzAWs-APVfILGp1iMwsl2q64zfhZJKHdBcsoAc"
  }
}
```

Response Body Error :

```json
{
  "code": 401,
  "status": "unauthorized",
  "errors": "you are not authorized to access this resource"
}
```
