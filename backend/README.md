# mykfz-backend application

## Prerequisites

Both for the back end and front end application check

-   nodejs [official website](https://nodejs.org/en/) - nodejs includes
    [npm](https://www.npmjs.com/) (node package manager) 
    (use at least node 14.17.1)

Just for the backend application:

-   mongodb
    [official installation guide](https://docs.mongodb.org/manual/administration/install-community/)

## Setup (before first run)

Go to your project root folder via command line

```
cd path/to/workspace/prototype/backend
```

**Install node dependencies**

```
npm install
```

**Set up your database**

-   Create a new directory where your database will be stored (it's a good idea
    to separate data and business logic - the data directory should be on a
    different place than your app)
-   Start the database server

```
mongod --dbpath relative/path/to/database
```

**Set the environment variables**

This variables are based in your local configuration

```bash
export PORT=3000
export MONGODB_URI="mongodb://localhost:27017/mykfzdb"
export JWT_SECRET="very secret secret"
```

**Add districts to your mongo db**

```bash
mongoimport --db mykfzdb --collection districts --drop --type json --jsonArray --file ~/path/to/project/backend/resources/district.json
mongoimport --db mykfzdb --collection users --type json --jsonArray --file ~/path/to/prototype/backend/resources/districtUsersHashed.json
```

## Start mongo

```bash
mongod --dbpath ~/mongodb_data
```

**Development environment**

```bash
npm run devstart
```

**Production environment**

```bash
npm start
```
