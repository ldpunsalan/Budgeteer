import { useEffect, useState, useContext } from 'react'
import { set, ref, get } from "firebase/database"

import { db } from '../../utils/firebase'
import { SessionContext } from '../../contexts/SessionContext'

import styles from '../Pages.module.css'
import useBuckets from '../../hooks/useBuckets'
import { Bucket, Purchase, Snapshot } from '../../types'

const MODAL_STATUS = {
    none: 'none',
    edit: 'edit'
}

/**
 * A component for rendering the paycheck page.
 * @function PurchasePage
*/
const PurchasePage = () => {
    const [modal, setModal] = useState({ status: MODAL_STATUS.none })
    const sessionInfo = useContext(SessionContext)
    const userID = sessionInfo.user

    const [purchases, setPurchases] = useState<Purchase[]>([])
    const [current, setCurrent] = useState<Purchase>({
        id: 0,
        bucketid: '',
        name: '',
        value: 0,
        date: '2020-01-01'
    })
    const [loadingPurchases, setLoadingP] = useState<Boolean>(false)
    
    const bucketsData = useBuckets(userID)
    const { loading: loadingBuckets } = bucketsData.loading
    const { buckets, setBuckets } = bucketsData.buckets

    // Fetch the purchases initially
    useEffect(() => {
        const fetchPurchases = async () => {
            const snapshot = await get(ref(db))
            const data: Snapshot = snapshot.val()
            
            try {
                if (data[userID].Buckets) {
                    const purchasesDB: Purchase[] = [];
                    Object.keys(data[userID].Buckets).forEach((bucketID) => {
                        const bucket = data[userID].Buckets[bucketID]
                        if (bucket.Purchases) {
                            Object.keys(bucket.Purchases).forEach((purchaseID) => {
                                const purchase = bucket.Purchases[parseInt(purchaseID)]
                                purchasesDB.push(purchase)
                            })
                        }
                    })
                    setPurchases(purchasesDB)
                }
            } catch (err) {
                alert('An error occurred!')
                console.error(err)
            }
            
            setLoadingP(false)
        }

        fetchPurchases()
    }, [])

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const name = e.target.name.value as string
        const value = parseInt(e.target.value.value as string)
        const bucketid = e.target.bucketid.value as string
        const ddate = e.target.date.value as string

        const relevantBucket = buckets.filter((bucket) => bucket.id == bucketid)[0]
        if (value > relevantBucket.value) {
            return alert('Value cannot exceed the current bucket amount')
        }

        const newPurchase: Purchase = {
            id: Math.floor(Math.random() * 1000),
            name,
            value,
            bucketid,
            date: ddate
        }

        // modify the database
        const snapshot = await get(ref(db))
        const data: Snapshot = snapshot.val()
        
        try {
            // assume that the bucket exists
            const bucket = data[userID].Buckets[bucketid]
            const purchases = data[userID].Buckets[bucketid].Purchases || {}
            const newPurchases: { [id: string]: Purchase } = {
                ...purchases,
                [newPurchase.id]: newPurchase
            }
            const newBucket: Bucket = {
                ...bucket,
                value: bucket.value - value,
                Purchases: newPurchases
            }
            set(ref(db, `/${userID}/Buckets/${bucketid}`), newBucket)
            setPurchases((prev) => [...prev, newPurchase])
            setBuckets(prev => prev.map(bucket => {
                if (bucket.id == bucketid) {
                    return newBucket
                } else {
                    return bucket
                }
            }))
        } catch (err) {
            alert('Something went wrong!')
            console.error(err)
        }
        
        e.target.reset()
    }

    const handleEditSubmit = async (e: any) => {
        e.preventDefault()

        if (!current) {
            return alert('Something went wrong')
        }

        const name = e.target.name.value as string
        const value = parseInt(e.target.value.value as string)
        const bucketid = current.bucketid
        const ddate = e.target.date.value as string

        const relevantBucket = buckets.filter((bucket) => bucket.id == bucketid)[0]
        const _oldValue = relevantBucket.value + current.value
        const _newValue = _oldValue - value

        // check if updating the price makes the bucket value go negative
        if (_newValue < 0) {
            return alert('Bucket value cannot go negative')
        }

        const newPurchase: Purchase = {
            id: current.id,
            name,
            value,
            bucketid: current.bucketid,
            date: ddate
        }

        // modify the database
        const snapshot = await get(ref(db))
        const data: Snapshot = snapshot.val()
        
        try {
            // assume that the bucket exists
            const bucket = data[userID].Buckets[bucketid]
            const oldValue = bucket.value + current.value
            const newValue = oldValue - value
            const newBucket = {
                ...bucket,
                value: newValue,
                Purchases: {
                    ...bucket.Purchases,
                    [current.id]: newPurchase
                }
            }
            set(ref(db, `/${userID}/Buckets/${bucketid}`), newBucket)
            setBuckets(prev => prev.map(bucket => {
                if (bucket.id == bucketid) {
                    return newBucket
                } else {
                    return bucket
                }
            }))
            const newPurchases = purchases.map((purchase) => {
                if (purchase.id === current.id) {
                    return newPurchase
                } else {
                    return purchase
                }
            })
            setPurchases(newPurchases)
        } catch (err) {
            alert('Something went wrong!')
            console.error(err)
        }

        setModal({ status: MODAL_STATUS.none })
    }

     const handleSetEdit = (purchase: Purchase) => {
        setCurrent(purchase)
        setModal({ status: MODAL_STATUS.edit })
     }

     const handleDelete = async (purchase: Purchase) => {
        const bucketid = purchase.bucketid
        // remove from database
        const snapshot = await get(ref(db))
        const data: Snapshot = snapshot.val()
        
        try {
            const bucket = data[userID].Buckets[bucketid]
            const newPurchases = { ...bucket.Purchases }
            delete newPurchases[purchase.id]
            const newBucket: Bucket = {
                ...bucket,
                value: bucket.value + purchase.value,
                Purchases: newPurchases
            }
            set(ref(db, `/${userID}/Buckets/${bucketid}`), newBucket)
            setPurchases((prev) => prev.filter((p) => purchase.id != p.id))
            setBuckets(prev => prev.filter(bucket => {
                if (bucket.id == bucketid) {
                    return newBucket
                } else {
                    return bucket
                }
            }))
        } catch (err) {
            alert('Something went wrong!')
            console.error(err)
        }
     }

    if (loadingBuckets) {
        return <div>Loading...</div>
    } else if (loadingPurchases) {
        return <div>Loading purchases...</div>
    } else if (modal.status === MODAL_STATUS.edit) {
        return (
            <div className={styles['content']}>
            <h2>EDIT PURCHASE</h2>
            <form onSubmit={handleEditSubmit}>
                <label>
                    <h3>Purchase Name</h3>
                    <input 
                        name="name"
                        className="PurchasePageInputs"
                        type="text"
                        placeholder='Where did you spend your money?'
                        defaultValue={current.name}
                        required/>
                </label>
                <label>
                    <h3>Amount</h3>
                    <input 
                        name="value"
                        className="PurchasePageInputs"
                        type="number"
                        min="0"
                        placeholder='How much did you spend?'
                        defaultValue={current.value}
                        required/>

                </label>
                <label>
                    <h3>Date</h3>
                    <input
                        name="date"
                        className='purchasePageInputs'
                        type="date"
                        defaultValue={current.date}
                        required/>
                </label>
                <input type='submit' value='Edit Purchase' />
            </form>
            </div>
        )
    } 

    return (
        <div className={styles['container']}>
            <div className={styles['content']}>
                <h2>PURCHASE</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        <h3>Purchase Name</h3>
                        <input 
                            name="name"
                            className="PurchasePageInputs"
                            type="text"
                            placeholder='Where did you spend your money?'
                            required/>
                    </label>
                    <label>
                        <h3>Amount</h3>
                        <input 
                            name="value"
                            className="PurchasePageInputs"
                            type="number"
                            min="0"
                            placeholder='How much did you spend?'
                            required/>

                    </label>
                    <label>
                        <h3>Bucket</h3>
                        <select name="bucketid" className="purchasePageInputs" required defaultValue="">
                            <option value="" disabled>Choose the relevant bucket</option>
                            {
                                buckets.map((bucket) => {
                                    return <option key={bucket.id} value={bucket.id} id={bucket.id}>{bucket.name}</option>
                                })
                            }
                        </select>
                    </label>
                    <label>
                        <h3>Date</h3>
                        <input
                            name="date"
                            className='purchasePageInputs'
                            type="date"
                            required/>
                    </label>
                    <input type='submit' value='Create Purchase' className={styles['button']}/>
                </form>
                <div>
                    <h3>Purchases</h3>
                {
                    purchases.map((purchase) => (
                        <li key={purchase.id}>
                            {purchase.name}: {purchase.value}
                            <button onClick={() => handleSetEdit(purchase)}>EDIT</button>
                            <button onClick={() => handleDelete(purchase)}>DELETE</button>
                        </li>
                    ))
                }
                </div>
            </div>
        </div>
    )
}
//
export default PurchasePage