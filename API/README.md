---

## API Documentation

### POST /api/User/login

- **Description:** Logs in a user.
- **Request Body:**

    | Parameter | Type   | Description       |
    | --------- | ------ | ----------------- |
    | email     | string | (optional) Email  |
    | password  | string | (optional) Password |

- **Response:**

    - Status Code: 200
    - Description: Success

### POST /api/User

- **Description:** Registers a new user.
- **Request Body:**

    | Parameter | Type   | Description       |
    | --------- | ------ | ----------------- |
    | email     | string | (optional) Email  |
    | password  | string | (optional) Password |

- **Response:**

    - Status Code: 200
    - Description: Success

### PUT /api/User

- **Description:** Updates a user.
- **Response:**

    - Status Code: 200
    - Description: Success

### GET /api/Recording

- **Description:** Retrieves recordings.
- **Response:**

    - Status Code: 200
    - Description: Success

### POST /api/Recording

- **Description:** Uploads a recording.
- **Request Body:**

    | Parameter           | Type   | Description                          |
    | ------------------- | ------ | ------------------------------------ |
    | ContentType         | string | Content type of the recording        |
    | ContentDisposition  | string | Content disposition of the recording |
    | Headers             | object | Additional headers of the recording  |
    | Length              | number | Length of the recording              |
    | Name                | string | Name of the recording                |
    | FileName            | string | File name of the recording           |

- **Response:**

    - Status Code: 200
    - Description: Success

### DELETE /api/Recording/{id}

- **Description:** Deletes a recording.
- **Path Parameters:**

    | Parameter | Type   | Description                  |
    | --------- | ------ | ---------------------------- |
    | id        | string | (required) ID of the recording |

- **Response:**

    - Status Code: 200
    - Description: Success

---
