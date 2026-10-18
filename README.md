# eventManager

A simple event management system built with Node.js and PostgreSQL.

## Tools used
1. Bun
2. Express.js
3. PostgreSQL (supabase)
4. Drizzle ORM
5. TS - this piece of shit had me get all the types. @types/findMeAJob
6. JWT

## Honest thingy
I coundnt finish frontend on time. 
here's the backend [REadme.md](https://github.com/sumit-poudel/eventbook/blob/main/backend/README.md)

## Cheap Talk

I like goLang a lot and somewhat hate js in general because of electron. Sooo, this project looks a lot like my snippetbox one. It shares few same idea from the Let's Go book ( definitely not because i havent read other books )

i used JWT for session and injected the isAuth value on the  request itself using middleware. So no more having same auth in every handler yeahhh...
and i use middleware to limit the users from accessing the api altogether rather then having condition on the handler. ( thanks alex for the idea )

js is really bad alone. Ts made it somewhat bareable
TBH i dont do ts that much. i just enjoy writing go and both are somewhat similar in some ways. So i just used ts to get the types and make it somewhat better.

yeah i dont like js. BUT NOT AS MUCH AS PYTHON🐍. fk u python

## Bahana behind not doing frontend

i cant do beautiful frontend so i stopped trying altogether.
Tailwind saved my ass tho.

## Conclusion

really prowd of the project structure.
This was way better then last time i tried express. I do goland now!

i would like to thank my mom for giving birth to me and my dad for giving me the money to buy a laptop. BYE!
Honorable mention *Zunu Didi for gifting me a monitor.

i will explain code tomorrow
1 am in the morning, have to go sleep for khasi tomorrow.

# 3am update (yes im still awake)

backend done. like actually done. 

anyone can see events. logged in ppl can book and cancel. admin can add and edit events. thats it! lol 

same middleware trick as before, handlers dont care about auth, middleware does. alex still the goat for that one.

frontend? tomorrow. tailwind will carry me again.
tests? lol. Let GO Gambling!

its 3 am. im dead. BYE (again)

```
├── backend
│   ├── drizzle
│   │   ├── Randon migration stuff i dont care
│   │   │   ├── migration.sql
│   │   │   └── snapshot.json
│   ├── src
│   │   ├── config
│   │   │   ├── drizzle-setup.ts
│   │   │   ├── env-config.ts
│   │   │   └── env-schema.ts
│   │   ├── db
│   │   │   ├── admin-controller.ts
│   │   │   ├── event-controller.ts
│   │   │   ├── schema.ts
│   │   │   └── user-controller.ts
│   │   ├── handlers
│   │   │   ├── admin.ts
│   │   │   ├── event.ts
│   │   │   ├── globTest.ts <- this was test handler lol. it survived till end
│   │   │   └── user.ts
│   │   ├── middleware
│   │   │   └── authenticate.ts
│   │   ├── schemas
│   │   │   ├── event-schema.ts
│   │   │   └── user-schema.ts
│   │   ├── scripts
│   │   │   └── seed-admin.ts
│   │   ├── types
│   │   │   └── express.d.ts
│   │   ├── utils
│   │   │   ├── cookies.ts
│   │   │   ├── encrypt.ts
│   │   │   ├── errors.ts
│   │   │   ├── jwt.ts
│   │   │   └── logger.ts
│   │   ├── app.ts
│   │   ├── route.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── bun.lock
│   ├── drizzle.config.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend
│   └── .gitfree
├── .gitignore
└── README.md
```
