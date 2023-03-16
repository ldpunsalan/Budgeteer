import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import mountRoutes from './routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

// Set-up request parsing
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req: Request, res: Response) => {
    res.send('Backend server!');
});

mountRoutes(app);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});