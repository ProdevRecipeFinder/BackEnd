## How to start Back-End for development:

### Requirements:

- WSL2 running a debian based Linux OS (preferably Ubuntu)
- PostgreSQL server
- Redis-Server
- Node v14

### Start back-end: 

- [ ] on cold-boot of WSL, start postgres service: `sudo service postgresql start`
 > Make sure postgres database is set up `name: recipes_db` username and password: `postgres`

- [ ] start redis-server with command `redis-server` and keep this terminal session alive

- [ ] in a separate terminal instance, start tsc compiler with `yarn watch`

- [ ] in a separate terminal, start the server with `yarn dev`

- connection errors will be thrown in the dev terminal, errors like `TCP/IP` are redis errors, and `db` are postgres errors