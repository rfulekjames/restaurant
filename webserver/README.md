### Getting started

0. Create a [firebase](https://firebase.google.com/) project.

1. Set the *environment variables* listed below.

2. Install [Node.js](https://nodejs.org/).

3. Run `npm install` from the root folder.

### Environment variables 

The following variables are required to be set for the web server 
 `FIREBASE_API_KEY`
 `PROJECT_ID`
 `JWT_PUBLIC_KEY`
 `JWT_PRIVATE_KEY`
 
 The first two variables  `FIREBASE_API_KEY` and `PROJECT_ID` are required for making [firebase](https://firebase.google.com/) API calls, and the third and fourth one is required for verifying and signing, respectively, JWT token. see 
 
 ### Testing
 
 0. Install and configure [firebase emulators](https://firebase.google.com/docs/emulator-suite/install_and_configure). Only, *firestore* and *auth* emulators are needed.

 1. Start [firebase emulators](https://firebase.google.com/docs/emulator-suite) by `firebase emulators:start` command from the root folder.
 
 1. Run `mocha test --exit` from the root folder.

Edit [`firebase.json`](https://github.com/rfulekjames/restaurant/blob/main/webserver/firebase.json) to change the emulators settings.
