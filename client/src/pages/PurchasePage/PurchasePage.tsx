import { useEffect, useState } from 'react'

import server from '../../utils/server'
import styles from '../Pages.module.css'

import { db } from '../../utils/firebase'
import { set, ref, update, onValue, get, remove} from "firebase/database"
import { SessionContext } from '../../contexts/SessionContext'
import { useContext } from 'react'


const PurchasePage = () => {
    const [loading, setLoading] = useState(true)
    const [buckets, setBuckets] = useState<any>([])
    const [current, setCurrent] = useState('0')
    const [date, setDate] = useState('0000-00-00')
    const sessionInfo = useContext(SessionContext)

    useEffect(() => {
        const userID = sessionInfo.user as any
        const fetchBuckets = async () => {

            get(ref(db)).then((snapshot)=>{
                const data = snapshot.val()
                
                
                let arr = Object.entries(data[userID].Buckets)
                let bucketList : any[] = [] // populate this
                bucketList = arr.map((cur) => cur[1])
                
                setBuckets(bucketList)
                setLoading(false)
            })

            
        }
        fetchBuckets()
    }, [])

    const handleCurrentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault()
        const cur = e.target.value
        setCurrent(cur)
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const d = e.target.value
        setDate(d)
    }

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

        set(ref(db,`/${sessionInfo.user}/Buckets/${D}/Purchases/${A}`), {
            id: A,
            name: B,
            value: C,
            bucketid: D,
            date: E,
        })
        
        server.post('/purchases/new', {
            ...newPurchase
        })

        alert('Success!')
        e.target.reset()
    }

    if (loading) {
        return <div>Loading...</div>
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
                    <select name="bucketid" className="purchasePageInputs" onChange={handleCurrentChange}>
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
                        onChange={handleDateChange}
                        required/>
                </label>
                <input type='submit' value='Create Purchase' />
            </form>
        </div>
    )
}
//
export default PurchasePage