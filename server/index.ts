import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import sessions from 'express-session'
import dotenv from 'dotenv';

import mountRoutes from './routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;
const clientPath = process.env.client || 'http://localhost:3000'

// Set-up request parsing
app.use(cors({
    origin: clientPath,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set-up Cross-Origin access
// This is to ensure that cookies containing the session
// can be transferred between the client and the server
app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', clientPath),
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
})

// Set-up persisent sessions
// TO-DO: use a persistent store, currently the session is only
// stored in memory. In resets whenever the server is refreshed
const COOKIE_AGE = 1000 * 60 * 60 * 24; // cookie lasts for 24 hours
app.use(sessions({
    secret: process.env.sessionSecret || 'Miss na miss ko na siya tbh :"((',
    saveUninitialized: true,
    cookie: {
        maxAge: COOKIE_AGE,
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'strict'
    },
    resave: false
}));

app.get('/', (req: Request, res: Response) => {
    res.send('Backend server!');
});

mountRoutes(app);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});