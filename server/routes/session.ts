import express, { Request, Response, NextFunction, Router } from 'express';

import '../types/session';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
    if (req.session.user) {
        res.json({
            user: req.session.user
        });
    } else {
        res.end()
    }
})

export default router;