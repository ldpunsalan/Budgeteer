import { useEffect, useState, useContext } from 'react'
import { set, ref, get } from "firebase/database"

import { db } from '../../utils/firebase'
import { SessionContext } from '../../contexts/SessionContext'

import styles from '../Pages.module.css'

const MODAL_STATUS = {
    none: 'none',
    edit: 'edit'
}

/**
 * A component for rendering the paycheck page.
 * @function PurchasePage
*/
const PurchasePage = () => {
    const [loadingState, setLoadingState] = useState({
        buckets: true,
        purchases: true
    })
    const [modal, setModal] = useState({ status: MODAL_STATUS.none })
    const [buckets, setBuckets] = useState<any>([])
    const [purchases, setPurchases] = useState<any>([])
    const [current, setCurrent] = useState<any>({})
    const sessionInfo = useContext(SessionContext)
    const userID = sessionInfo.user as any

    // Fetch the buckets initially
    useEffect(() => {
        const fetchBuckets = async () => {
            const snapshot = await get(ref(db))
            const data = snapshot.val()

            if (!data[userID].Buckets) {   
                setCurrent(null)
                setBuckets([])
                setLoadingState(prev => ({
                    ...prev,
                    buckets: false
                }))
            } else {
                const arr = Object.entries(data[userID].Buckets)
                let bucketList : any[] = []
                bucketList = arr.map((cur) => cur[1])
                setBuckets(bucketList)
                setLoadingState(prev => ({
                    ...prev,
                    buckets: false
                }))
            }
            
        }
        fetchBuckets()
    }, [])

    // Fetch the purchases initially
    useEffect(() => {
        const fetchPurchases = async () => {
            const snapshot = await get(ref(db))
            const data = snapshot.val()
            
            try {
                // assume that user/buckets exists
                const purchasesDB: any = [];
                Object.keys(data[userID].Buckets).forEach((bucketID: any) => {
                    const bucket = data[userID].Buckets[bucketID]
                    if (bucket.Purchases) {
                        Object.keys(bucket.Purchases).forEach((purchaseID: any) => {
                            const purchase = bucket.Purchases[purchaseID]
                            purchasesDB.push(purchase)
                        })
                    }
                })
                setPurchases(purchasesDB)
            } catch (err) {
                alert('An error occurred!')
                console.error(err)
            }
            
            setLoadingState(prev => ({
                ...prev,
                purchases: false
            }))
        }

        fetchPurchases()
    }, [])

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const name = e.target.name.value
        const value = e.target.value.value
        const bucketid = e.target.bucketid.value
        const ddate = e.target.date.value

        const relevantBucket = buckets.filter((bucket: any) => bucket.id == bucketid)[0]
        if (parseInt(value) > parseInt(relevantBucket.value)) {
            return alert('Value cannot exceed the current bucket amount')
        }

        const newPurchase = {
            id: Math.floor(Math.random() * 1000),
            name,
            value,
            bucketid,
            date: ddate
        }

        // modify the database
        const snapshot = await get(ref(db))
        const data = snapshot.val()
        
        try {
            // assume that the bucket exists
            const bucket = data[userID].Buckets[bucketid]
            const purchases = data[userID].Buckets[bucketid].Purchases || {}
            const newPurchases = {
                ...purchases,
                [newPurchase.id]: newPurchase
            }
            const newBucket = {
                ...bucket,
                value: parseInt(bucket.value) - parseInt(value),
                Purchases: newPurchases
            }
            set(ref(db, `/${userID}/Buckets/${bucketid}`), newBucket)
            setPurchases((prev: any) => [...prev, newPurchase])
        } catch (err) {
            alert('Something went wrong!')
            console.error(err)
        }
        
        e.target.reset()
    }

    const handleEditSubmit = async (e: any) => {
        e.preventDefault()
        const name = e.target.name.value
        const value = e.target.value.value
        const bucketid = current.bucketid
        const ddate = e.target.date.value

        const relevantBucket = buckets.filter((bucket: any) => bucket.id == bucketid)[0]
        const _oldValue = parseInt(relevantBucket.value) + parseInt(current.value)
        const _newValue = _oldValue - parseInt(value)

        // check if updating the price makes the bucket value go negative
        if (_newValue < 0) {
            return alert('Bucket value cannot go negative')
        }

        const newPurchase = {
            id: current.id,
            name,
            value,
            bucketid: current.bucketid,
            date: ddate
        }

        // modify the database
        const snapshot = await get(ref(db))
        const data = snapshot.val()
        
        try {
            // assume that the bucket exists
            const bucket = data[userID].Buckets[bucketid]
            const oldValue = parseInt(bucket.value) + parseInt(current.value)
            const newValue = oldValue - parseInt(value)
            const newBucket = {
                ...bucket,
                value: newValue,
                Purchases: {
                    ...bucket.Purchases,
                    [current.id]: newPurchase
                }
            }
            set(ref(db, `/${userID}/Buckets/${bucketid}`), newBucket)
            const newPurchases = purchases.map((purchase: any) => {
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

     const handleSetEdit = (purchase: any) => {
        setCurrent(purchase)
        setModal({ status: MODAL_STATUS.edit })
     }

     const handleDelete = async (purchase: any) => {
        const bucketid = purchase.bucketid
        // remove from database
        const snapshot = await get(ref(db))
        const data = snapshot.val()
        
        try {
            const bucket = data[userID].Buckets[bucketid]
            const newPurchases = { ...bucket.Purchases }
            delete newPurchases[purchase.id]
            const newBucket = {
                ...bucket,
                value: parseInt(bucket.value) + parseInt(purchase.value),
                Purchases: newPurchases
            }
            set(ref(db, `/${userID}/Buckets/${bucketid}`), newBucket)
            setPurchases((prev: any) => prev.filter((p: any) => purchase.id != p.id))
        } catch (err) {
            alert('Something went wrong!')
            console.error(err)
        }
     }

    if (loadingState.buckets) {
        return <div>Loading...</div>
    } else if (loadingState.purchases) {
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
                        <select name="bucketid" className="purchasePageInputs" required>
                            <option value="" disabled selected>Choose the relevant bucket</option>
                            {
                                buckets.map((bucket : any) => {
                                    return <option value={bucket.id} id={bucket.id}>{bucket.name}</option>
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
                    purchases.map((purchase: any) => (
                        <li>
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