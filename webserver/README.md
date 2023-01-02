### Getting started

0. Create a [firebase](https://firebase.google.com/) project

1. Set the environment variables listed below

### Environment variables 

The following variables are required to be set for the web server 
 `FIREBASE_API_KEY`
 `PROJECT_ID`
 `JWT_SECRET`
 
 The first two variables are required for making [firebase](https://firebase.google.com/) API calls. 
 
 ### Testing
 
 0. Start firebase emulator by `firebase emulators:start` command.
 1. Run `mocha test` from the root folder.
