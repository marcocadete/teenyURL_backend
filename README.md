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
* [sinon](https://www.npmjs.com/package/sinon)
* [nodemon](https://www.npmjs.com/package/nodemon)
* [prettier](https://www.npmjs.com/package/prettier)
* [supertest](https://www.npmjs.com/package/supertest)  

## API
### Fetching all teenyURLs:

**GET** /api/v1/teenyurls

Response: **200 SUCCESS** [JSON]  

* When there are one or more teenyURLs  

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
* When there are no teenyURLs  

```json
{
    "teenyURLs": []
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

Response: **404 NOT FOUND** [JSON]

```json

{
    "message": "Not Found",
    "status": 404,
    "errors": []
}
```

Response: **400 BAD REQUEST** [JSON]

* Occurs if the alias parameter exceeds a character length limit of 20.

```json

{
    "message": "Bad Request",
    "status": 400,
    "errors": [
        {
            "value": "a_really_long_alias_that_exceeds_20_characters",
            "msg": "Alias exceeds 20 character limit.",
            "param": "alias",
            "location": "params"
        }
    ]
}
```
### Creating a teenyURL:  

**POST**/api/v1/shorten

Request Body Schema [JSON]

* **long_url** *string* [Required]
* **alias** *string* [Required]

```json
{
    "long_URL": "https://distrowatch.com",
    "alias": "dw"
}
```

Response: **200 SUCCESS** [JSON]

```json
{
    "long_URL": "https://distrowatch.com",
    "alias": "dw",
    "created_at": "2021-01-07T14:21:55.000Z"
}                            
``` 


Response: **429 TOO MANY REQUESTS** [JSON]  

* Rate limiter set to 10 requests

```json
{
    "message": "Too many requests",
    "status": 429,
    "errors": [
        {
            "msg": "Too many requests, Please try again later."
        }
    ]
}
``` 

Response: **400 BAD REQUEST** [JSON]

* Occurs if the alias already exists in the database

```json

{
    "message": "Bad Request",
    "status": 400,
    "errors": [
        {
            "value": "some_alias",
            "msg": "Alias already in use",
            "param": "alias",
            "location": "body"
        }
    ]
}
```
