#  Brasil COVID-19 Cases API (Under Construction 🚧)

## Get State
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
