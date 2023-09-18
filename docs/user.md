# TEST API

## Test API

Endpoint : POST /api/v1/test

Request Body :
```json
{
  "name": "string",
  "email": "string",
  "phone": "string"
}
```

Response Body Success :
```json
{
  "code": "200",
  "status": "OK",
  "data": {
    "name": "string",
    "email": "string",
    "phone": "string"
  },
  
  // Atau bisa juga seperti ini kalau data lebih dari 1
  
  "data": [
    {
      "name": "string",
      "email": "string",
      "phone": "string"
    }
  ],

  // Atau bisa juga seperti ini kalau ada pagination

  "page": {
    "size": 10, // perpage berapa
    "total": 100, // total data di db
    "totalPage": 10, // 100/10 = 10
    "current": 1, // lagi buka page berapa
  }
}
```

Response Body Error :
```json
{
  "code": "404",
  "status": "NOT FOUND",
  "errors": "string",
  
  // Atau bisa juga seperti ini kalau error lebih dari 1

  "errors": {
    "id": [
      "must be number"
    ],
    "name": [
      "must not be empty",
      "must be string"
    ],
    
    // handle nested object
    
    "address.city": [
      "must not be empty",
      "must be string"
    ]
  }
}
```