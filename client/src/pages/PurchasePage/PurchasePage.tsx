import { useEffect, useState } from 'react'

import server from '../../utils/server'
import styles from '../Pages.module.css'

const PurchasePage = () => {
    const [loading, setLoading] = useState(true)
    const [buckets, setBuckets] = useState([])
    const [current, setCurrent] = useState('0')
    const [date, setDate] = useState('0000-00-00')

    useEffect(() => {
        const fetchBuckets = async () => {
            try {
                const res = await server.get('buckets')
                const data = res.data.data
                setBuckets(data)
                setLoading(false)
            } catch (err : any) {
                alert(err.response.data.msg)
            }
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

        await server.post('/purchases/new', {
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