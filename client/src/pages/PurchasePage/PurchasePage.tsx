import { useEffect, useState } from 'react'

import server from '../../utils/server'
import styles from '../Pages.module.css'

import { db } from '../../utils/firebase'
import { set, ref, update, onValue, get, remove} from "firebase/database"
import { SessionContext } from '../../contexts/SessionContext'
import { useContext } from 'react'


const PurchasePage = () => {
    const [loadingState, setLoadingState] = useState({
        buckets: true,
        purchases: true
    })
    const [modal, setModal] = useState({ status: 'none' })
    const [buckets, setBuckets] = useState<any>([])
    const [purchases, setPurchases] = useState([])
    const [current, setCurrent] = useState<any>({})
    const sessionInfo = useContext(SessionContext)

    // Fetch the buckets initially
    useEffect(() => {
        const userID = sessionInfo.user as any
        const fetchBuckets = async () => {
            get(ref(db)).then((snapshot)=>{
                const data = snapshot.val()
                if (!data[userID].Buckets)
                {   
                    setCurrent(null)
                    setBuckets([])
                    setLoadingState(prev => ({
                        ...prev,
                        buckets: false
                    }))
                }
                else{
                    let arr = Object.entries(data[userID].Buckets)
                    let bucketList : any[] = [] // populate this
                    bucketList = arr.map((cur) => cur[1])
                
                    setBuckets(bucketList)
                    setLoadingState(prev => ({
                        ...prev,
                        buckets: false
                    }))
                }
                
            })

            
        }
        fetchBuckets()
    }, [])

    // Fetch the purchases initially
    useEffect(() => {
        const userID = sessionInfo.user as any
        const fetchPurchases = async () => {
            get(ref(db)).then((snapshot) => {
                const data = snapshot.val()
                try {
                    // assume that user/buckets exists
                    const purchasesDB: any = [];
                    console.log(data[userID].Buckets)
                    Object.keys(data[userID].Buckets).forEach((bucketID: any) => {
                        const bucket = data[userID].Buckets[bucketID]
                        console.log(bucket)
                        if (bucket.Purchases) {
                            console.log(Object.keys(bucket.Purchases))
                            Object.keys(bucket.Purchases).forEach((purchaseID: any) => {
                                const purchase = bucket.Purchases[purchaseID]
                                purchasesDB.push(purchase)
                            })
                        }
                    })
                    setPurchases(purchasesDB)
                    console.log(purchasesDB)
                } catch (err) {
                    alert('An error occurred!')
                    console.log(err)
                }
            })
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

        const newPurchase = {
            id: Math.floor(Math.random() * 1000),
            name,
            value,
            bucketid,
            date: ddate
        }

        const A = newPurchase.id
        const B = newPurchase.name
        const C = newPurchase.value
        const D = newPurchase.bucketid
        const E = newPurchase.date

        // modify the database
        get(ref(db)).then((snapshot) => {
            const userID = sessionInfo.user as any
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
            } catch (err) {
                alert('Something went wrong!')
                console.log(err)
            }
        })
        
        // server.post('/purchases/new', {
        //     ...newPurchase
        // })

        alert('Success!')
        e.target.reset()
    }

    const handleEditSubmit = (e: any) => {
        e.preventDefault()
        const name = e.target.name.value
        const value = e.target.value.value
        const ddate = e.target.date.value

        const newPurchase = {
            id: current.id,
            name,
            value,
            bucketid: current.bucketid,
            date: ddate
        }

        const A = newPurchase.id
        const B = newPurchase.name
        const C = newPurchase.value
        const D = newPurchase.bucketid
        const E = newPurchase.date

        set(ref(db,`/${sessionInfo.user}/Buckets/${D}/Purchases/${A}`), {
            id: A,
            name: B,
            value: C,
            bucketid: D,
            date: E,
        })
        
        // server.post('/purchases/new', {
        //     ...newPurchase
        // })

        alert('Success!')
        setModal({ status: 'none' })
    }

     const handleSetEdit = (purchase: any) => {
        setCurrent(purchase)
     }

     const handleDelete = (purchase: any) => {
        alert('clicked!')
     }

    if (loadingState.buckets) {
        return <div>Loading...</div>
    } else if (loadingState.purchases) {
        return <div>Loading purchases...</div>
    } else if (modal.status === 'edit') {
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
                    <select name="bucketid" className="purchasePageInputs" >
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
                <input type='submit' value='Create Purchase' />
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
    )
}
//
export default PurchasePage