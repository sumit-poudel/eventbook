# Backend

## how does it works
1. I tried making the backend scalable and easy to understand using the Go Project structure which i norally use.
    Alex the goat for this.
2. It has its own:
    1.setup/config, 
    2. routes, 
    3. handler,
    4.server,
    5.app,
    6.utils,
    7.types,
    8.scripts,
    9.schema,
    10. db controllers, and lastly 
    11. middlewares
    
    to give it that scalable and maintainable code.
3. middleware does the main role based guarding for the handlers. So any request without permission shouldnt reach the handlers under nomal conditions.
4. I used jwt for session. i used to use scs for session Management in go [scs](https://github.com/alexedwards/scs.git) but session managers in JS are too magical for me. 
5. I run TypeScript directly with tsx on Node — no tsc build step or nodemon needed.
6. I tried making every thing type Strict. Made different schemas and Also expanded the Request type of express to include my Custom request context for the middleware. 
7. And i used to use [errors.Is](https://pkg.go.dev/errors) in go tocompare errors that are burried with other error contexts. Much easier for error handeling as its Standard library. Got same functionality of error checking for js from stackoverflow so used it. 
8. Ahh seed, Yes. you have to run it from the scripts of package.json to create a user 
9. I uses bcrypt library to hash the password and store it. Everything is under utils/
10. That covers pretty much everything of the backend

### Important Note for the hiring person
If you are gonna use express with ts. why not use Go
1. faster
2. supports multi threading with go routines
3. has strict types like TS. I think ts uses Go under the hood to make it faster as of recent.
4. has standard http librarires with libraries for logger, error, routes handler, db controllers.
    bare dependencies of other libraries
5. favoured by cloud. Go powers the cloud.
6. I love Golang lol.

[GoLang](https://go.dev/)
[Goose](https://github.com/pressly/goose)
[sqlc](https://docs.sqlc.dev/en/latest/)
[pgx](https://github.com/jackc/pgx)
[scs](https://github.com/alexedwards/scs.git)
Pretty much thats it for Go backend for dependency for a basic webServer
and these libraries arent that much big.
