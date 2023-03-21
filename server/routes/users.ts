import express, { Router, Request, Response, NextFunction } from 'express';

import db from '../utils/db/offline';

const router: Router = express.Router();

router.post('/new', async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { email, password } = req.body;
        let database: any[] | undefined = await db.get('users');

        if (database === undefined) {
            return res.status(500).json({ msg: "Server error: database missing" });
        }

        if (database.filter((user: any) => user.email === email).length > 0) {
            return res.status(400).json({ msg: "Email already exists" })
        }

        database.push({ email: email, password: password });

        await db.set('users', database);

        return res.json({
            msg: "Successfully created new account"
        });

    } catch (err) {
        next(err);
    }
})

export default router;