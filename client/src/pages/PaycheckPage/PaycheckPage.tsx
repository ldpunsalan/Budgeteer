import { useEffect, useState, useContext } from 'react'
import { set, ref, get, remove} from "firebase/database"

import { db } from '../../utils/firebase'
import { SessionContext } from '../../contexts/SessionContext'

import styles from '../Pages.module.css'

/**
 * A component for rendering the paycheck page.
 * @function PaycheckPage
*/
const PaycheckPage = () => {
    const [loadingState, setLoadingState] = useState({
        buckets: true,
        paychecks: true
    })
    const [current, setCurrent] = useState<any>(0)
    const [paychecks, setPaychecks] = useState<any>([])
    const [buckets, setBuckets] = useState<any>([])
    const sessionInfo = useContext(SessionContext)
    const userID = sessionInfo.user as any

    // obtain the user buckets
    useEffect(() => {
        const fetchBaskets = async () => {
            const snapshot = await get(ref(db))
            const data = snapshot.val()

            if (!data[userID].Buckets) {
                setBuckets([])
            } else {
                const userBuckets = Object.entries(data[userID].Buckets)
                const bucketList = userBuckets.map((cur) => cur[1])
                setBuckets(bucketList)
            }
            setLoadingState(prev => ({
                ...prev,
                buckets: false
            }))
        }

        fetchBaskets()
    }, [])

    // compute the current paycheck using the bucket info
    useEffect(() => {
        const totalMoney = buckets.reduce((total: any, bucket: any) => total + parseInt(bucket.value), 0)
        setCurrent(totalMoney)
    }, [buckets])

    // get the paychecks from the database, to be used for undo
    useEffect(() => {
        const fetchPaychecks = async () => {
            const snapshot = await get(ref(db))
            const data = snapshot.val()
            
            if (data[userID].Paychecks) {
                const arr = Object.entries(data[userID].Paychecks)
                let paycheckList : any[] = [] 
                paycheckList = arr.map((cur) => cur[1])
                setPaychecks(paycheckList)
            }
            setLoadingState(prev => ({
                ...prev,
                paychecks: false
            }))
        }

        fetchPaychecks()
    }, [])

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        // get the latest paycheck id
        const snapshot = await get(ref(db))
        const data = snapshot.val()
        let id = 0

        if (data[userID].PaycheckSeq) {
            id = parseInt(data[userID].PaycheckSeq) + 1
        }

        // update the database
        set(ref(db, `/${userID}/PaycheckSeq`), id.toString())

        const curPaycheck: any = {
            id: id,
            changes: []
        }

        // check the changes in each bucket
        const amt = parseInt(e.target.paycheckAmount.value)
        let currentNew = amt
        const totalWeight = buckets.reduce((total: any, bucket: any) => total + parseInt(bucket.weight), 0)
        const newBuckets: any[] = []
        buckets.forEach((bucket: any, index: any) => {
            // let the last bucket get the remaining
            let delta = 0;
            if (index === buckets.length - 1) {
                delta = currentNew
            } else {
                const partialValue = amt * parseInt(bucket.weight) / totalWeight
                delta = partialValue
                currentNew -= partialValue
            }

            curPaycheck.changes.push({
                id: bucket.id,
                delta
            })

            // update the bucket
            const newBucket = {
                ...bucket,
                value: parseInt(bucket.value) + delta
            }
            console.log(newBucket)
            set(ref(db, `/${userID}/Buckets/${bucket.id}`), newBucket)
            newBuckets.push(newBucket)
        })
        setBuckets(newBuckets)

        // update the database
        // do not update the paycheck in the database anymore
        // since it is implied from the buckets. But, the
        // paychecks should be saved to enable undo
        set(ref(db, `/${userID}/Paychecks/${id}`), curPaycheck)
        setPaychecks((prev: any) => [...prev, curPaycheck])

        // update the shown paycheck amount
        setCurrent((prev: any) => prev + amt)

        e.target.reset()
    }

    const handleUndo = () => {
        if (paychecks.length > 0) {
            const lastPaycheck = paychecks.pop()

            // update the database
            remove(ref(db, `/${userID}/Paychecks/${lastPaycheck.id}`))
            setPaychecks([...paychecks])

            // update the buckets
            const newBuckets: any[] = []
            lastPaycheck.changes.forEach((paycheck: any) => {
                const delta = parseInt(paycheck.delta)
                const bucket = buckets.filter((b: any) => b.id == paycheck.id)[0]

                const newBucket = {
                    ...bucket,
                    value: parseInt(bucket.value) - delta
                }
                set(ref(db, `/${userID}/Buckets/${bucket.id}`), newBucket)
                newBuckets.push(newBucket)
            })

            setBuckets(newBuckets)
        }
    }

    if (loadingState.buckets || loadingState.paychecks) {
        return <div>Loading...</div>
    } else {
        return (
            <div className={styles['container']}>
                <div className={styles['content']}>
                    <h2>PAYCHECK</h2>
                    <form name='paycheckForm' onSubmit={handleSubmit}>
                        <label>
                        <h3>Total Amount</h3>
                        <h1>&#8369;{current}</h1>
                        <input 
                            name="paycheckAmount"
                            className="paycheckPageInputs"
                            type="number"
                            min="1"
                            placeholder='How much did you earn budget?'
                            required/>
                        </label>
                        <input 
                            name='updateButton' 
                            type='submit' 
                            value='Insert Paycheck' 
                            className={styles['button']}></input>
                    </form>
                    <button 
                        onClick={() => handleUndo()}
                        formNoValidate 
                        className={styles['button']}>Undo</button>
                </div>
            </div>
        )
    }
}
//
export default PaycheckPage