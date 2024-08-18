First create a basic node js express server and run it to make sure it is starting. something like this 
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running successfully on port ${PORT}`);
});

when you are sure its running. Then its time to install typescript
npm i typescript -D

then for typescript configuration
npx tsc --init

Install the types for it
npm i @types/express @types/cors @types/mongoose @types/node -D

build in package.json should be = npx tsc

npm run build after , creates the dist folder.

then change the start line in the package.json file to "node ./dist/server.js" from "node server.js

then run npm start.

npm run dev to run the file in nodemon.json

Cors is for frontend. My frontend will run on localhost:3000