## How to start Back-End for development:

### Requirements:

- WSL2 running a debian based Linux OS (preferably Ubuntu)
- PostgreSQL server
- Redis-Server
- Node v14

### Start back-end: 

- [1] on cold-boot of WSL, start postgres service: `sudo service postgresql start`
  - Make sure postgres database is set up `name: recipes_db` username and password: `postgres`

- [2] If the database does not exits, run the following command in a new terminal session: `sudo -i -u postgres`
  - Now, as postgres user, run the command `createdb recipes_db`

- [3] start redis-server with command `redis-server` and keep this terminal session alive

- [4] Generate migrations for database table:
    - type `yarn typeorm migration:generate -n Table-Setup`
    - start the server by doing step 6 and 7, wait a little bit then kill the server with ctrl + c in both terminals
    - next, in `src/DatabaseLoader/loadDb.ts`, set the path to the `output.json` file
    - in `src/index.ts`, uncomment the `loadDB();` function,
    - start the server again, wait for the inputs in the terminal to stop, then kill both terminals
    - comment out `loadDB();` function in the `index.ts` file
    - your database will now have 100 recipes for testing

- [5] if search is needed follow these steps:
    - run this command in the back-end dir: `yarn typeorm migration:create -n MaterialView-Setup`
    - open this created file in entities/migrations folder
    - open `materialView.sql` file and copy the query-runners
    - paste these into the migration file in the "up" section and save

- [6] in a separate terminal instance, start tsc compiler with `yarn watch`

- [7] in a separate terminal, start the server with `yarn dev`
  - connection errors will be thrown in the dev terminal, errors like `TCP/IP` are redis errors, and `db` are postgres errors
