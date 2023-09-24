# USER API

## Login API

**Endpoint :** POST /api/v1/users/login

Request Body (1) :

```json
{
  "email": "johndoe@email.com",
  "password": "123456"
}
```

Request Body (2) :

```json
{
  "username": "johndoe",
  "password": "123456"
}
```

Response Body Success :

```json
{
  "code": 200,
  "status": "OK",
  "data": {
    "accessToken": "3847230c-f881-4a3a-ab72-b969f03cf318",
    "refreshToken": "3847230c-f881-4a3a-ab72-b969f03cf318"
  }
}
```

Response Body Error :

```json
{
  "code": 400,
  "status": "Bad Request",
  "errors": "password cannot be empty"
}
```