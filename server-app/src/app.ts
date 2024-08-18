import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import urlRoutes from './routes/url.Routes';
import { connectDb } from './config/db';


const app = express();

// database connection
connectDb();

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// static files
app.use(express.static('public'));


// API routes
app.use('/api', urlRoutes);

  
  
  //  middleware to handle error
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  
  export default app;