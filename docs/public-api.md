# USER API

## Login API

**Endpoint :** POST /api/v1/users/login

Request Body :

```json
{
  "email": "johndoe@email.com",
  "password": "123456"
}
```

Response Body Success :

```json
{
  "code": 200,
  "status": "OK",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZUlkIjoyLCJpYXQiOjE2OTYxNjE4OTksImV4cCI6MTY5NjI0ODI5OX0.DgrbbRHaauKW7MQ5NtfcuXDqGQjGEVwohok-I7-5QrQ"
  }
}
```

Response Body Error :

```json
{
  "code": 400,
  "status": "bad request",
  "errors": "password is required"
}
```

```json
{
  "code": 400,
  "status": "bad request",
  "errors": "email is required"
}
```

```json
{
  "code": 404,
  "status": "not found",
  "errors": "username or password is wrong"
}
```