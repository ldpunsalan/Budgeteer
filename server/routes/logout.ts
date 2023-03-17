import express, { Router, Request, Response, NextFunction } from 'express';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
    req.session.destroy(() => {
        console.log('Logged out')
    });
    res.end();
})

export default router;