import express, { Router, Request, Response, NextFunction } from 'express';

import db from '../utils/db/offline';
import '../types/session'

const router: Router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { email, password } = req.body;
        let database = await db.get('users');

        if (database === undefined) {
            database = [];
        }

        const accounts = database.filter((user: any) => user.email === email);

        if (accounts.length === 0) {
            return res.status(400).json({ msg: "Invalid email" });
        } 

        const account = accounts[0];
        if (account.password !== password) {
            return res.status(400).json({ msg: "Invalid password" });
        }

        // create session
        req.session.user = email;
        req.session.save();

        console.log(`Logged in as ${email}`);

        return res.json({
            msg: `Successfully logged in`,
            user: email
        });

    } catch (err) {
        return next(err);
    }
})

export default router;