import { useEffect, useState, useContext } from 'react'
import { set, ref, get, remove} from "firebase/database"

import { db } from '../../utils/firebase'
import { SessionContext } from '../../contexts/SessionContext'

import styles from '../Pages.module.css'
import useBuckets from '../../hooks/useBuckets'
import { Bucket, Paycheck, Snapshot } from '../../types'

/**
 * A component for rendering the paycheck page.
 * @function PaycheckPage
*/
const PaycheckPage = () => {
    const sessionInfo = useContext(SessionContext)
    const userID = sessionInfo.user

    const [loadingPaychecks, setLoadingP] = useState<Boolean>(true)
    const [paychecks, setPaychecks] = useState<Paycheck[]>([])
    const [current, setCurrent] = useState<number>(0)

    const bucketsData = useBuckets(sessionInfo.user)
    const { loading: loadingBuckets } = bucketsData.loading
    const { buckets, setBuckets } = bucketsData.buckets

    // compute the current paycheck using the bucket info
    useEffect(() => {
        const totalMoney = buckets.reduce((total: number, bucket) => total + bucket.value, 0)
        setCurrent(totalMoney)
    }, [buckets])

    // get the paychecks from the database, to be used for undo
    useEffect(() => {
        const fetchPaychecks = async () => {
            const snapshot = await get(ref(db))
            const data: Snapshot = snapshot.val()
            
            if (data[userID].Paychecks) {
                const arr = Object.entries(data[userID].Paychecks)
                let paycheckList : Paycheck[] = [] 
                paycheckList = arr.map((cur) => cur[1])
                setPaychecks(paycheckList)
            }
            setLoadingP(false)
        }

        fetchPaychecks()
    }, [])

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        // get the latest paycheck id
        const snapshot = await get(ref(db))
        const data: Snapshot = snapshot.val()
        let id = 0

        if (data[userID].PaycheckSeq) {
            id = data[userID].PaycheckSeq + 1
        }

        // update the database
        set(ref(db, `/${userID}/PaycheckSeq`), id)

        const curPaycheck: any = {
            id: id,
            changes: []
        }

        // check the changes in each bucket
        const amt = parseInt(e.target.paycheckAmount.value)
        let currentNew = amt
        const totalWeight = buckets.reduce((total: number, bucket) => total + bucket.weight, 0)
        const newBuckets: Bucket[] = []
        buckets.forEach((bucket, index) => {
            // let the last bucket get the remaining
            let delta = 0;

            if (index === buckets.length - 1) {
                delta = currentNew
            } else {
                const partialValue = amt * bucket.weight / totalWeight
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
                value: bucket.value + delta
            }

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
        const lastPaycheck = paychecks.pop()
        if (lastPaycheck) {

            // update the database
            remove(ref(db, `/${userID}/Paychecks/${lastPaycheck.id}`))
            setPaychecks([...paychecks])

            // update the buckets
            const newBuckets: Bucket[] = []
            lastPaycheck.changes.forEach((paycheck) => {
                const delta = paycheck.delta
                const bucket = buckets.filter((b: any) => b.id == paycheck.id)[0]

                const newBucket = {
                    ...bucket,
                    value: bucket.value - delta
                }
                set(ref(db, `/${userID}/Buckets/${bucket.id}`), newBucket)
                newBuckets.push(newBucket)
            })

            setBuckets(newBuckets)
        }
    }

    if (loadingBuckets || loadingPaychecks) {
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