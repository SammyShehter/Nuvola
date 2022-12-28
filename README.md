# Nuvola

CRUD. 
#### IMPORTANT : Make sure you've configured `.env` with relevant data. You can look at `.env.example`
<br>

## Getting started 
To initialize you need docker and docker-compose to be intalled:
```shellsession
$ docker-compose build && docker-compose up
```

This command will create 3 containers: 
- Backend
- Feed App
- MongoDB

<br>

## Way to use: 
You can find Postman collection in root folder.

## Backend
When you run the container, first backend checks if there is data in db. If not, it populates automatically.
You can add words to watchList eather in root dir "watchlsit.txt", or using relevant API call, while being an admin

## Feed App
Runs over DB and creates a recommended posts feed for every user.

Uses Cronjob scheduled to run once in an hour.
You can configure how often you want run this process. No need for restart
Just edit `./config.json`:

```json
{"cronTask": "0 * * * *"}
```
