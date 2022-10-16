# Express-Jwt Authorization
## Rest API using express, redis and JWT to authorize users

#### readme - https://github.com/iamksuresh/express-jwt-authentication#readme

#### screenshots
-   Folder structure - ![folder structure](https://github.com/iamksuresh/express-jwt-authentication/blob/main/screenshots/folder_structure.png)


## Features
- Express based Rest API service written in Typescript
- Redis to store Refresh, access JWT tokens
- 3 layered architecture with clear separation of business and Repository logics
- IOC containers for module injection
- Using simple pre-defined annotations to register controllers

## Good to know - for Assigment purpose only
-   User DB is mocked and only username is validated for assigning new access tokens
-   API - /token/ - on successful token creation, it will return Access token in response.
--  Refresh token is added in response [set-cookie] header
-- Use refresh token from above, for token renewal on expiry
-  Token secrets and expiry are in .env file (pushed for assignment purpose only)

#### Note : Please replace the .env content with values provided in mail

## Technology stack
-   Express js , Typescript, Redis, Jsonwebtokens, Inversify (IOC) , 
-   supertest, redis-mock
-   Reflect-metadata : JS metadata / proxies
-   prettier, Eslint

## Installation
-  Pre-requisite - [Node.js](https://nodejs.org/) latest. 
-  git clone git@github.com:iamksuresh/express-jwt-authentication.git
-  Tested in node 16.15.0 , npm 8.9.0 , 

```sh
cd <root-folder>
npm i
npm start
```
- Server will start at port 3000

## Testing
-   Super test for API integration test
```sh
cd <root-folder>
npm i (if not already done)
npm test
```
![Test coverage](https://github.com/iamksuresh/express-jwt-authentication/blob/main/screenshots/test-coverage.png)

###  JWT Implementation and testing strategy 
- Redis is mocked and separate Express instance is loaded
- All test cases are executed in this instance
- /token
    - mock username,password is passed as params
    - for these params, using keys from .env, jwt Access and Refresh tokens are generated
    - Access token is returned in response
    - Refresh token is returned as httponly cookie
    - Both access token and refresh token are stored in Redis
- /token/renew
    - we need to set refresh token from /token api to Cookie headers
    - For valid refresh headers, new Access token is passed
    - Error scenarios like - invalid token, no cookie are handled
- /about
    - add access token in header.authorization as - 
    ``set('Authorization', 'Bearer ' + accessToken) ``
- Json web tokens
    - It is used as middleware for `/about` path
    - uses `verify()` to check for valid access token
### Improvements

Though token is one of the most preferred way of implementing authorization in http(s), few options can be considered to improve JWT implementation
-  Rotating Refresh token - update refresh token with every access token renewal
-  Passing Refresh token as httponly cookie and restricting it to specific path (/token/renew)
-  Having better CORS policy
-  To have better redis implementation

## Postman collection
- Access Postman collection here -  https://github.com/iamksuresh/express-jwt-authentication/tree/main/postman-collection

### Screenshots

![refresh token](https://github.com/iamksuresh/express-jwt-authentication/blob/main/screenshots/httponly-refresh-token-cookie.png)
![/token](https://github.com/iamksuresh/express-jwt-authentication/blob/main/screenshots/token-api.png)



## Challenge 2

### Implementing Pagination in API for high volume DB 
```
A good API design improves the overall Developer Experience and can improve performance and long term maintainability.

There are few strategies, which we should consider while developing Api's
- Filtering
- Pagination
- Sorting

Strategic combination of above 3 highly improves the API performance and maintainability
```

### Filtering
    
    Retriving data based on filtering. Below are few filtering strategies
    
-  #### Basic Filtering 
    
    - passing url params  
    - example - `/items?state=active&seller_id=1234`
    -  ##### Benefits
        - Easy to implement. query where `state=active`
    - ##### Downsides
        - cannot use filter operators like - `eq, lte, gte`
- #### LHS Brackets
    - Adding square brackets `[]`, example - `GET /items?price[gte]=10&price[lte]=100`
    -  ##### Benefits
        - Ease of use for clients
        - Simple to parse on server side
        - No need to escape special characters in the filter value when operator is taken as a literal filter term
    - ##### Downsides
        - We may have to write a custom URL parameter binder or parser to split the query string key into -` field name and the operator`.
        - Use of library like `qs` for parsing
- #### RHS colon
    - Here API to take the operator on the RHS instead of LHS., example - `GET /items?price=gte:10&price=lte:100`
    - ##### Benefits
        - Easiest to parse on server side
        - No custom binders are needed
    -  ##### Downsides
        - Literal values need special handling
        - Example - if we want to find items where the user_id is `lte:100`
-  #### Search Query Params
    - We can add support for filters and ranges directly with the search parameter
    - It can support Lucene syntax or ElasticSearch Simple Query Strings directly
    - Example - `GET /items?q=title:red chair AND price:[10 TO 100]`
    - ##### Benefits
        - flexible queries for API users
    -  #####  Downsides
        - Some learning curve to start working with the API
        - Requires URL percent encoding which makes using cURL or Postman more complicated

### Pagination
```
Pagination helps retrive limited data from DB. Without Pagination, a simple search could return millions or even billions of hits causing extraneous network traffic.

There are few Strategies of implementing Pagination like -
- OffSet / StartIndex Pagination
- KeySet Pagination
- Seek Pagination
```

- #### OffSet Pagination
    
    - Easiest way of implementing Pagination.
    - Values - `limit , offset/startIndex` are passed in query params
    - Example - `GET /items?limit=20&offset=100`
     -  #### Benefits
        - Easiest to implement
        - passing parameters directly to SQL query
        - stateless and Works regardless of custom sort_by parameters
    - #### Downsides
        - `Not performant for large offset values`.
        -  `Example` - To perform a query with a large offset value of 10000. The database needs to scan and count rows starting with 0, and will skip (i.e. throw away data) for the first 10000 rows
        - Not consistent when new items are inserted to the table (i.e. Page drift) and especially when ordering items by newest first
- ##### conclusion 
    - `Offset Pagination can be an ideal candidate where the data set has a small upper bounds`


-   #### KeySet Pagination
    - Keyset pagination uses the filter values of the last page to fetch the next set of items. Those columns would be indexed.
    - Assume query ordered by created date descending  - `strategy is to find minimum created date from previous call, to use as filer param in following call`
    - Example - (Assume the query is ordered by created date descending)
        ```
        Client makes request for most recent items: 
            GET /items?limit=20
        From the response we find the minimum created date as 2021-01-20T00:00:00.
        Now date query for next API call will be -
            GET /items?limit=20&created:lte:2021-01-20T00:00:00
        ```
    
    -  #### Benefits
        - Works with existing filters without additional backend logic
        - Consistent ordering even when newer items are inserted into the table
        - Consistent performance even with large offsets / hign volume of DB
    - #### Downsides
        - Tight coupling of paging mechanism to filters and sorting
        - Does not work for low cardinality fields such as enum strings
        - Complicated for API users when using custom sort_by fields as the client needs to adjust the filter based on the field used for sorting.
- ###### Conclusion :  
    - `KeySet Pagination is ideal for data with a single natural high cardinality key such as time series or log data which can use a timestamp`.

- Seek Pagination
    - An extension of Keyset strategy, by adding an `after_id` or `start_id` URL parameter, we can remove the tight coupling of paging to filters and sorting
    - `Example` - (Assume the query is ordered by created date ascending)
    ```
    Client makes request for most recent items: 
        GET /items?limit=20
    client finds the last id of ‘20’ from previously returned results and then makes second query using it as the starting id
        GET /items?limit=20&after_id=20
    client finds the last id of ‘40’ from previously returned results and then makes third query using it as the starting id
        GET /items?limit=20&after_id=40
    ```
    - Seek pagination can be distilled into a `where` clause
        ```
        SELECT
         *
        FROM
            Items
        WHERE
            Id > 20
        ```
    - The above works fine, but it can be `critical for lower cardinality fields`.
        -   consider example - `GET /items?limit=20&after_id=20&sort_by=email`
            ```
            Backend may need 2 possible queries
            1.  The first query could be O(1) lookup with hash tables though to get the email pivot value
            2. This is the fed into the second query to only retrieve items whose email is after our after_email.
            ```
     -  #### Benefits
        - No coupling of pagination logic to filter logic.
        - Consistent ordering even when newer items are inserted into the table.
        - Consistent performance even with large offsets.
    - #### Downsides
        - Implementation is complex relative to offset based or keyset based pagination
        - If items are deleted from the database, the start_id may not be a valid id.

- ##### Conclusion -
    -  ` Seek paging can be a good overall paging strategy for large volume DB but with some complexity in Backend logic `
    - `ensures there isn’t additional complexity added to clients/users of the API while staying performant even with larger seeks.`

### Sorting
```
sorting is also an important feature for any API endpoint.
To enable sorting, we can add a `sort` or `sort_by` URL parameter that can take a field name as the value.
```
- Few sorting formats to consider
    - `GET /users?sort_by=asc(email)`
    - `GET /users?sort_by=-last_modified,+email`
-   Paring sortField and sortOrder is advisable else it’s ambiguous what ordering should be paired with what field name

### Challenge 2 conclusion
- I have tried to describe different strategies for Pagination.
- for high volume DB, right mix of `filtering, paging and sorting` strategy is required for a robust and performant API.
- I believe, each strategy has its own pros and cons and are well suited for some scenario over other
- An ideal `API` implementation would look like -
    - filtering : RHS colon / search query param
    - Paging : Seek Pagination strategy
    - sorting : sortField and sortOrder pared . 
    - ##### `GET /items?price=gte:10&limit=20&after_id=20&sort_by=-created_date,+quantity`
- Libraries like `qs` can be used for query parsing 