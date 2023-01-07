<h1 align="center" style="border-bottom: none">
    <div>
        <a href="https://taskpaw.com">
            <img src="/components/Header/logo.png" width="200" />
            <br>
            TaskPaw
        </a>
    </div>
    The Open Source productivity booster app <br>
</h1>

<p align="center">
Implements cutting-edge research in psychology that are proven to be helpful in boosting productivity.
</p>

# Trying out
## Compatible node versions
Tested in node v14 and v16
## Steps to run the app
Clone the repo

Run `npm install`

Run `npm run dev`

With this you should be able to see the visitor version of the app
## additonal step to run the logged-in area of the app
Create an .env file and pouplate it with the following environment varibles
```
DATABASE_URL="postgres database connection URL"
GOOGLE_CLIENT_ID="create a client id from here https://console.cloud.google.com/"
GOOGLE_CLIENT_SECRET=""create a client secret from here https://console.cloud.google.com/"
GOOGLE_LOGIN_REDIRECT="http://localhost:3000/login"
JWT_SECRET="your secret jwt string"
```
