import express, { Router, Request, Response, NextFunction } from 'express';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
    // destroy session
    res.end();
})

export default router;