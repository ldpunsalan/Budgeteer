import { useEffect, useState } from 'react'

import server from '../../utils/server'
import styles from '../Pages.module.css'


import { db } from '../../utils/firebase'
import { set, ref, update} from "firebase/database"
import { SessionContext } from '../../contexts/SessionContext'
import { useContext } from 'react'


const BucketsPage = () => {
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState({ status: 'none' })
    const [current, setCurrent] = useState<any>({})
    const [buckets, setBuckets] = useState<any>([])
    const sessionInfo = useContext(SessionContext)

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

    const editBucket = () => {
        setModal({
            status: 'edit'
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
            
            const A = newBucket.id
            const B = newBucket.name
            const C = newBucket.weight
            const D = newBucket.value

            set(ref(db,`/${sessionInfo.user}/Buckets/${B}`), {
                id: A,
                name: B,
                weight: C,
                value: D
            })
            setBuckets((prev: any) => [...prev, newBucket])
        }

        setModal({ status: 'none' })
    }

    const handleEditBucket = (e: any) => {
        e.preventDefault()
        const name = e.target.name.value
        const weight = e.target.weight.value
        const value = e.target.value.value

        const exist = buckets.filter((bucket: any) => bucket.name === name && bucket.id !== current.id)
        
        if (exist.length > 0) {
            alert('Bucket already exists')
        } else {
            const newBucket = {
                id: current.id,
                name,
                weight,
                value
            }
            
            const A = newBucket.id
            const B = newBucket.name
            const C = newBucket.weight
            const D = newBucket.value

            const newBuckets = buckets.map((bucket : any) => {
                if (bucket.id !== current.id) {
                    return bucket;
                } else {
                    return newBucket
                }
            })




            console.log(newBuckets)
            setBuckets(newBuckets)
            setCurrent(newBucket)
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
    } else if (modal.status === 'edit') {
        return (
            <div className={styles['content']}>
                <h2>Edit Bucket</h2>
                <form onSubmit={handleEditBucket}>
                    <label>
                        Name:
                        <input type="text" name="name" defaultValue={current.name} required />
                    </label>
                    <label>
                        Weight:
                        <input type="number" name="weight" defaultValue={current.weight} required />
                    </label>
                    <label>
                        Value:
                        <input type="number" name="value" defaultValue={current.value} required />
                    </label>
                    <input type="submit" value="Edit Bucket" />
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
            <button onClick={() => editBucket()}>Edit Bucket</button>
            <button>Delete Bucket</button>
        </div>
    )
}

export default BucketsPage