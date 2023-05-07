import express, { Router, Request, Response, NextFunction } from 'express';

import db from '../utils/db/offline';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const database: any[] | undefined = await db.get('purchases');
        const user = req.session.user;

        if (!user) {
            return res.status(401).json({ msg: "Client error: Please login" }); 
        }

        if (database === undefined) {
            return res.status(500).json({ msg: "Server error: database connection error" });
        }

        const purchaseDatabase = database.filter((purchase: any) => purchase.user === user);

        return res.json({
            data: purchaseDatabase
        });

    } catch (err) {
        next(err);
    }
});

router.post('/new', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pdatabase: any[] | undefined = await db.get('purchases');
        const bdatabase: any[] | undefined = await db.get('buckets');
        const user = req.session.user

        if (!user) {
            return res.status(401).json({ msg: "Client error: Please login" });
        }

        if (pdatabase === undefined || bdatabase === undefined) {
            return res.status(500).json({ msg: "Server error: database connection error" });
        }

        const body = req.body;
        
        const newPurchase = {
            ...body,
            value: parseInt(body.value),
            user
        }

        pdatabase.push(newPurchase)
        await db.set('purchases', pdatabase)

        const newBDatabase = bdatabase.map((bucket: any) => {
            if (bucket.id == body.bucketid) {
                return {
                    ...bucket,
                    value: parseInt(bucket.value) - parseInt(body.value)
                }
            } else {
                return bucket
            }
        })

        await db.set('buckets', newBDatabase)

        console.log(newBDatabase, pdatabase)

        res.json({
            msg: "Successfully added database"
        });
    } catch (err) {
        next(err);
    }
});

router.post('/edit', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const database: any[] | undefined = await db.get('purchases');
        const user = req.session.user

        if (!user) {
            return res.status(401).json({ msg: "Client error: Please login" });
        }

        if (database === undefined) {
            return res.status(500).json({ msg: "Server error: database connection error" });
        }

        const body = req.body;

        const newDatabase = database.map((purchase: any) => {
            if (purchase.id === body.id) {
                return {
                    ...purchase,
                    ...body
                }
            } else {
                return purchase
            }
        })

        await db.set('purchases', newDatabase)

        return res.json({
            msg: "Successfully updated bucket"
        })
    } catch (err) {
        next(err)
    }
})

export default router;
