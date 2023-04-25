import { useEffect, useState } from 'react'

import server from '../../utils/server'
import styles from '../Pages.module.css'

const BucketsPage = () => {
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState({ status: 'none' })
    const [current, setCurrent] = useState<any>({})
    const [buckets, setBuckets] = useState<any>([])

    useEffect(() => {
        const fetchBuckets = async () => {
            const res = await server.get('buckets')
            const data = res.data.data
            console.log(data)
            if (data.length > 0) {
                setCurrent(data[0])
            }
            console.log(data)
            setBuckets(data)
            setLoading(false)
        }
        fetchBuckets()
    }, [])

    const addBucket = () => {
        setModal({
            status: 'add'
        })
    }

    const handleNewBucket = (e: any) => {
        e.preventDefault()
        const name = e.target.name.value
        const weight = e.target.weight.value
        const value = e.target.value.value

        const exist = buckets.filter((bucket: any) => bucket.name === name)
        
        if (exist.length > 0) {
            alert('Bucket already exists')
        } else {
            const newBucket = {
                id: buckets.length + 1,
                name,
                weight,
                value
            }
    
            setBuckets((prev: any) => [...prev, newBucket])
        }

        setModal({ status: 'none' })
    }

    if (loading) {
        return <p>loading...</p>
    } else if (modal.status === 'add') {
        return (
            <div className={styles['content']}>
                <h2>Add Bucket</h2>
                <form onSubmit={handleNewBucket}>
                    <label>
                        Name:
                        <input type="text" name="name" required />
                    </label>
                    <label>
                        Weight:
                        <input type="number" name="weight" required />
                    </label>
                    <label>
                        Value:
                        <input type="number" name="value" required />
                    </label>
                    <input type="submit" value="Add Bucket" />
                </form>
            </div>
        )
    } else if (!current) {
        return (
            <div className={styles['content']}>
                <h2>Buckets</h2>
                <h1>You have no buckets</h1>
                <button onClick={() => addBucket()}>Add Bucket</button>
            </div>
        )
    }

    return (
        <div className={styles['content']}>
            <h2>BUCKETS</h2>
            <h1>&#8369;{current.value}</h1>
            <h3>{current.name}</h3>
            <select name="bucketName" className="bucketPageInputs">
            {
                buckets.map((bucket : any) => {
                    return <option value={bucket.id} id={bucket.id}>{bucket.name}</option>
                })
            }
            </select>
            <h3>Weight</h3>
            <input 
                name="bucketWeight"
                className="bucketPageInputs"
                type="number"
                min="1"
                value={current.weight}
                required/>
            <button onClick={() => addBucket()}>Add Bucket</button>
            <button>Edit Bucket</button>
            <button>Delete Bucket</button>
        </div>
    )
}

export default BucketsPage