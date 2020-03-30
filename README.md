#  Brasil COVID-19 Cases API (Under Construction 🚧)

## Get State

| PATH | METHOD | SUMMARY | PARAMETERS |
| ------------- | ------------- | ------------- | ------------- |
| /state/:code  | GET  | Finds a state by code | code [route param] [string] [UF code of Brazil] [required: true] |
| Contenido de la celda  | Contenido de la celda  |

- PATH
/state/:code:
- METHOD
GET
      summary: Get a state by code
      parameters:
        - in: path
          name: code
          schema:
            type: string
            enum: [AC, AM, AP, PA, ...]
          required: true
          description: UF code of Brazil
