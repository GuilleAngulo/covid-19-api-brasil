#  Brasil COVID-19 Cases API (Under Construction 🚧)

## Get State

Finds state by UF code

```http
GET /state/:code
```

| Parameter | In | Type | Description |
| :--- | :--- | :--- | :--- |
| `code` | `path` | `string` | **Required**. UF code of Brazil |

Responses

```javascript
{
  "_id": string,
  "name": string,
  "code": string,
  "population": number,
  "region": string,
  "createdAt": date,
  "updatedAt": date,
  "__v": number,
  "confirmed": number,
  "deaths": number,
  "officialUpdated": date
}
```

| Status Code | Description |
| :--- | :--- |
| 200 | `OK` | 
| 201 | `CREATED` |
| 400 | `BAD REQUEST` |
| 404 | `NOT FOUND` |
| 500 | `INTERNAL SERVER ERROR` |
