# USER API

## Get Current User API

Endpoint : GET /v1/users/current

Headers :

- Authorization : token

Response Body Success :

```json
{
  "code": 200,
  "status": "OK",
  "data": {
    "username": "johndoe",
    "email": "johndoe@email.com"
  }
}
```

Response Body Error :

```json
{
  "code": 404,
  "status": "Not Found",
  "errors": "user is not founds"
}
```

```json
{
  "code": 403,
  "status": "forbidden",
  "errors": "you are not allowed to access this resource"
}
```

## Update Current User API

Endpoint : PATCH /v1/users/current

Headers :

- Authorization : token

Request Body:

```json
{
  "username": "johndoenew",
  "fullName": "John new",
  "lastName": "Doe New",
  "password": "123456",
  "avatar": "https://www.google.com"
}
```

Response Body Success :

```json
{
  "code": 200,
  "status": "OK",
  "data": {
    "username": "johndoenew",
    "fullName": "john doe new new",
    "avatar": "public/images/avatar/1696205310695-selfie.jpg"
  }
}
```

Response Body Error :

```json
{
  "code": 400,
  "status": "bad request",
  "errors": "full name is required"
}
```

```json
{
  "code": 400,
  "status": "bad request",
  "errors": "file format must be PNG, JPG, or JPEG"
}
```

```json
{
  "code": 400,
  "status": "bad request",
  "errors": "avatar must be less than 2MB"
}
```
