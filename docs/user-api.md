# USER API

## Register API

Endpoint : POST /api/v1/users

Request Body :

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "email": "johndoe@email.com",
  "password": "123456",
  "role": 1
}
```

Response Body Success :

```json
{
  "code": 201,
  "status": "CREATED",
  "data": {
    "username": "johndoe",
    "email": "johndoe@email.com"
  }
}
```

Response Body Error :

```json
{
  "code": 400,
  "status": "Bad Request",
  "errors": "first name cannot be empty"
}
```

## Get Current User API

Endpoint : GET /api/v1/users/current

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

Endpoint : PATCH /api/v1/users/current

Headers :

- Authorization : token

Request Body:

```json
{
  "newUsername": "johndoenew",
  "firstName": "John new",
  "lastName": "Doe New",
  "password": "123456"
}
```

Response Body Success :

```json
{
  "code": 200,
  "status": "OK",
  "data": {
    "username": "test"
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

