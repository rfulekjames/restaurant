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
 
 The first two variables  `FIREBASE_API_KEY` and `PROJECT_ID` are required for making [firebase](https://firebase.google.com/) API calls, and the third and fourth one is required for verifying and signing, respectively, JWT token and can be generated, e.g., as described in [key-gen-commands.txt](https://github.com/rfulekjames/restaurant/blob/main/webserver/key-gen-commands.txt)
 
 ### Testing
 
 0. Install and configure [firebase emulators](https://firebase.google.com/docs/emulator-suite/install_and_configure). Only, *firestore* and *auth* emulators are needed, e.g., run `npm install -g firebase-tools`

 1. Start [firebase emulators](https://firebase.google.com/docs/emulator-suite) by `firebase emulators:start --project test` command from the root folder.

 2. Install mocha `npm install -g mocha`
 
 3. Run `mocha ./test/* --exit` from the root folder.
 
The command `firebase emulators:exec --project test "mocha ./test/* --exit"` will run the tests and takes care of starting and stopping emulators.


Edit [`firebase.json`](https://github.com/rfulekjames/restaurant/blob/main/webserver/firebase.json) to change the emulators settings.
