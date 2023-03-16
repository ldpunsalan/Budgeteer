import express, { Router, Request, Response, NextFunction } from 'express';

const router: Router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { email, password } = req.body;

        // fixed users first
        const SAMPLE_DATABASE = [
            {
                email: "admin@budgeteer.com",
                password: "admin"
            },
            {
                email: "email@website.com",
                password: "sample"
            }
        ]

        const accounts = SAMPLE_DATABASE.filter(user => user.email === email);

        if (accounts.length === 0) {
            return res.status(400).json({ msg: "Invalid email" });
        } 

        const account = accounts[0];
        if (account.password !== password) {
            return res.status(400).json({ msg: "Invalid password" });
        }

        // create session

        return res.json({
            msg: `Successfully logged in`,
            user: email
        })

    } catch (err) {
        return next(err);
    }
})

export default router;