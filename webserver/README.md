### Getting started

0. Create a [firebase](https://firebase.google.com/) project

1. Set the environment variables listed below

### Environment variables 

The following variables are required to be set for the web server 
 `FIREBASE_API_KEY`
 `PROJECT_ID`
 `JWT_SECRET`
 
 The first two variables connect the [firebase](https://firebase.google.com/) with the webserver. 
 
 ### Testing
 
 0. Start firebase emulator by running `firebase emulators:start` command.
 1. Run `mocha test` from the root folder.
