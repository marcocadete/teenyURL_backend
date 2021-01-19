# TeenyURL Backend

A URL shortening API, which provides short aliases for redirection of long URLs.

> **Note:** This is just a fun project I wanted to build. It's not meant to be more than that.

**It's purpose:**

* Create short URLs from long ones.
* URLs with expiry dates (Future addon)
* Statistics e.g hits on URL and location (Future addon)  

## Web Development Stack
These are the tools I used to build this application:

* ![](readme_images/nodejs.png) NodeJS
* ![](readme_images/express.png) Express
* ![](readme_images/mysql.png) MySQL  

## Additional NPM packages
Additional packages used to build this project:

* [dotenv](https://www.npmjs.com/package/dotenv)
* [express-validator](https://www.npmjs.com/package/express-validator)
* [mysql2](https://www.npmjs.com/package/mysql2)
* [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)

## Development NPM packages
These are packages i used for development and testing:

* [eslint](https://www.npmjs.com/package/eslint)
* [faker](https://www.npmjs.com/package/faker)
* [jest](https://www.npmjs.com/package/jest)
* [nodemon](https://www.npmjs.com/package/nodemon)
* [prettier](https://www.npmjs.com/package/prettier)
* [supertest](https://www.npmjs.com/package/supertest)  

## API
### Fetching all teenyURLs:

**GET** /api/v1/teenyurls

Response: **200 SUCCESS** [JSON]

```json
{
    "teenyURLs": [
        {
            "long_URL": "https://distrowatch.com",
            "alias": "dw",
            "created_at": "2021-01-19T02:21:55.000Z"
        },
        {
            "long_URL": "https://facebook.com",
            "alias": "fb",
            "created_at": "2021-01-19T02:10:40.000Z"
        },
        {
            "long_URL": "https://google.com",
            "alias": "go",
            "created_at": "2021-01-19T02:27:48.000Z"
        },
        {
            "long_URL": "https://youtube.com",
            "alias": "yt",
            "created_at": "2021-01-19T02:20:16.000Z"
        }
    ]
}
```

### Fetching a teenyURL by Alias:

Path Parameters:  **alias** *string* [Required, maxLength=20]  

**GET** /api/v1/teenyurls/{alias}

Response: **200 SUCCESS** [JSON]

```json

{
    "long_URL": "https://distrowatch.com",
    "alias": "dw",
    "created_at": "2021-01-19T02:21:55.000Z"
}
```

