# Node - Koa - Typescript Blog

[![NPM version](https://img.shields.io/npm/v/node-typescript-koa-rest.svg)](https://www.npmjs.com/package/node-typescript-koa-rest)
[![Dependency Status](https://david-dm.org/javieraviles/node-typescript-koa-rest.svg)](https://david-dm.org/javieraviles/node-typescript-koa-rest)

When running the project locally with `npm run dev`, being `.env` file config the very same as `.example.env` file, the swagger docs will be deployed at: `http:localhost:3000/swagger-html`, and the bearer token for authorization should be as follows:

| method   | resource     | description                                                                                    |
| :------- | :----------- | :--------------------------------------------------------------------------------------------- |
| `GET`    | `/`          | Simple hello world response                                                                    |
| `GET`    | `/users`     | returns the collection of users present in the DB                                              |
| `GET`    | `/users/:id` | returns the specified id user                                                                  |
| `POST`   | `/users`     | creates a user in the DB (object user to be includued in request's body)                       |
| `PUT`    | `/users/:id` | updates an already created user in the DB (object user to be includued in request's body)      |
| `DELETE` | `/users/:id` | deletes a user from the DB (JWT token user ID must be the same as the user you want to delete) |
