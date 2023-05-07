import { useEffect, useState } from 'react'

import server from '../../utils/server'
import styles from '../Pages.module.css'


import { db } from '../../utils/firebase'
import { set, ref, update, onValue, get, remove} from "firebase/database"
import { SessionContext } from '../../contexts/SessionContext'
import { useContext } from 'react'


const BucketsPage = () => {
    /**
     * Loading State
     *  Type: Boolean
     * This is true while the client side is obtaining the bucket list
     */
    const [loading, setLoading] = useState(true)
    /**
     * Modal State
     *  Possible Values: 'none' | 'add' | 'edit'
     * States which interface to show. None refers to the general uneditable view
     */
    const [modal, setModal] = useState({ status: 'none' })
    /**
     * Current Bucket
     *  Type: Bucket
     * Contains a COPY of the currently viewed bucket. Serves as a reference for 
     * the details shown.
     */
    const [current, setCurrent] = useState<any>({})
    /**
     * Bucket List
     *  Type: List<Bucket>
     * Contains an UPDATED copy of the user's buckets
     */
    const [buckets, setBuckets] = useState<any>([])
    const sessionInfo = useContext(SessionContext)

    /**
     * Initially, the state is set to the list of buckets for
     * the user
     */
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

    const resetAll = () => {
        // sets the bucket's value to 0
        const resetBucket = async (id : string) => {
            // for now, i'm just setting the local values to 0
            setBuckets((prev : any) => prev.map((bucket : any) => {
                if (bucket.id == id) {
                    return {
                        ...bucket,
                        value: 0
                    }
                } else {
                    return bucket
                }
            }))
        }

        buckets.forEach((bucket : any) => {
            update(ref(db,`/${sessionInfo.user}/Buckets/${bucket.id}`),{
                value: 0
            })
            resetBucket(bucket.id)
        });

        


        console.log('running')
        server.post('/buckets/reset', {})

        setCurrent((prev : any) => ({ ...prev, value: 0 }))
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
                id: Math.floor(Math.random() * 1000),
                name,
                weight,
                value
            }   
            
            const A = newBucket.id
            const B = newBucket.name
            const C = newBucket.weight
            const D = newBucket.value

            set(ref(db,`/${sessionInfo.user}/Buckets/${A}`), {
                id: A,
                name: B,
                weight: C,
                value: D
            })
            setBuckets((prev: any) => [...prev, newBucket])
            setCurrent(newBucket)
            server.post('/buckets/new', {
                ...newBucket
            })
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
            update(ref(db,`/${sessionInfo.user}/Buckets/${current.id}`),{
                id: A,
                name: B,
                weight: C,
                value: D
            })

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
            try {
                server.post('/buckets/edit', {
                    ...newBucket
                })
            } catch (err) {
                console.log(err)
            }
        }

        setModal({ status: 'none' })
    }

    const handleDeleteBucket = () => {
        const newBuckets = buckets.filter((bucket : any) => bucket.id !== current.id)
        remove(ref(db,`/${sessionInfo.user}/Buckets/${current.id}`))
        setBuckets(newBuckets)

        if (newBuckets.length === 0) {
            setCurrent(null)
        } else {
            setCurrent(newBuckets[0])
        }
    }

    const handleChangeBucket = (e : React.ChangeEvent<HTMLSelectElement>) => {
        const bucketID = e.target.value;
        const newCurrent = buckets.filter((bucket: any) => bucket.id == bucketID)
        setCurrent(newCurrent[0])
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
        <div   className={styles['container']}>
            <div className ={styles['content']}>
                <h2>BUCKETS</h2>
                <h1>&#8369;{current.value}</h1>
                <h3>Name= {current.name}<br />Weight= {current.weight}</h3>
                <select name="bucketName" className="bucketPageInputs" onChange={handleChangeBucket} value={current.id}>
                {
                    buckets.map((bucket : any) => {
                        return <option value={bucket.id} id={bucket.id}>{bucket.name}</option>
                    })
                }
                </select>
            </div>
            <div className={styles['buttons']}>
                <button onClick={() => addBucket()}>Add Bucket</button>
                <button onClick={() => editBucket()}>Edit Bucket</button>
                <button onClick={handleDeleteBucket}>Delete Bucket</button>
                <button onClick={() => resetAll()}>Reset All</button>
            </div>
        </div>
    )
}

export default BucketsPage