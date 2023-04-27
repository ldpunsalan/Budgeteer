import express, { Router, Request, Response, NextFunction } from 'express';

import db from '../utils/db/offline';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const database: any[] | undefined = await db.get('buckets');
        const user = req.session.user;

        if (!user) {
            return res.status(401).json({ msg: "Client error: Please login" }); 
        }

        if (database === undefined) {
            return res.status(500).json({ msg: "Server error: database connection error" });
        }
        
        const userDatabase = database.filter((bucket: any) => bucket.user === user);

        return res.json({
            data: userDatabase
        })

    } catch (err) {
        next(err)
    }
})

router.get('/all', async (req: Request, res: Response, next: NextFunction) => {
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

router.post('/new', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const database: any[] | undefined = await db.get('buckets');
        const user = req.session.user

        if (!user) {
            return res.status(401).json({ msg: "Client error: Please login" });
        }

        if (database === undefined) {
            return res.status(500).json({ msg: "Server error: database connection error" });
        }

        const body = req.body;
        
        const newBucket = {
            ...body,
            user
        }

        database.push(newBucket);

        await db.set('buckets', database)

        res.json({
            msg: "Successfully added database"
        });

    } catch (err) {
        next(err)
    }
})

// router.post('/edit', async (req: Request, res: Response))

export default router;