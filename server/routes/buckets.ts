import express, { Router, Request, Response, NextFunction } from 'express';

import db from '../utils/db/offline';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let database: any[] | undefined = await db.get('buckets');

        if (database === undefined) {
            return res.status(500).json({ msg: "Server error: database connection error"});
        }

        return res.json({
            data: database
        })
        
    } catch (err) {
        next(err);
    }
})

export default router;