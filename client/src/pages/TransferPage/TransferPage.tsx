import { useEffect, useState, useContext } from 'react'
import { ref, update, get } from "firebase/database"

import styles from '../Pages.module.css'

import { db } from '../../utils/firebase'
import { SessionContext } from '../../contexts/SessionContext'

/**
 * A component for rendering the fund transfer page.
 * @function TransferPage
*/
const TransferPage = () => {
    const [loading, setLoading] = useState(true)
    const [source, setSource] = useState<any>()
    const [recipient, setRecipient] = useState<any>()
    const [buckets, setBuckets] = useState<any>([])
    const [amount, setAmount] = useState<any>()
    const sessionInfo = useContext(SessionContext)

    useEffect(() => {
        const userID = sessionInfo.user as any

        const fetchBuckets = async () => {
            const snapshot = await get(ref(db))
            const data = snapshot.val()

            if (!data[userID].Buckets) {   
                setBuckets([])
                setLoading(false)
            } else {
                const arr = Object.entries(data[userID].Buckets)
                let bucketList : any[] = [] 
                bucketList = arr.map((cur) => cur[1])
                setBuckets(bucketList)
                setLoading(false)
            }
            
        }

        fetchBuckets()
    }, [])

    const handleChangeSource = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault()
        const source = e.target.value
        setSource(source)
    }

    const handleChangeRecipient = (e: React.ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault()
        const recipient = e.target.value
        setRecipient(recipient)
    }

    const handleChangeAmount = (e:any) => {
        e.preventDefault()
        const amount = e.target.value
        setAmount(amount)
    }

    const handleTransferFunds = (e: any) => {
        e.preventDefault()

        if (source === undefined) {
            return alert('Please choose a source bucket')
        } else if (recipient === undefined) {
            return alert('Please choose a recipient bucket')
        }

        const srcBucket = buckets.filter((bucket : any) => bucket.id == source)[0]
        const recBucket = buckets.filter((bucket : any) => bucket.id == recipient)[0]
        const srcValue = srcBucket.value
        const recValue = recBucket.value

        // Handle errors
        if (srcBucket.id === recBucket.id) {
            return alert('ERROR: Source and recipient buckets cannot be the same.')
        }
        else if (parseInt(srcValue) < parseInt(amount)) {
            return alert("ERROR: Amount cannot be greater than source bucket's value.")
        }
        else if (isNaN(amount)) {
            return alert("ERROR: Please enter a valid amount.")
        }

        if (confirm('Do you want to proceed?')) {
            const newSrc = {
                ...srcBucket,
                value: parseInt(srcValue) - parseInt(amount)
            }

            const newRec = {
                ...recBucket, 
                value: parseInt(recValue) + parseInt(amount)
            }
            
            // update the database
            update(ref(db,`/${sessionInfo.user}/Buckets/${source}`), newSrc)
            update(ref(db,`/${sessionInfo.user}/Buckets/${recipient}`), newRec)

            // update the ram
            setBuckets((prev:any) => prev.map((bucket : any) => {
                if (bucket.id == srcBucket.id) {
                    return newSrc
                } else if (bucket.id == recBucket.id) {
                    return newRec
                } else {
                    return bucket
                }
            }))
          }
    }

    if (loading) {
        return <p>loading...</p>
    } else {
        return (
            <div className={styles['container']}>
                <div className={styles['content']}>
                    <h2>TRANSFER FUNDS</h2>
                    <h3>Source Bucket</h3> 
                    <select name="sourceBucketName" className="transferPageInputs" required onChange={handleChangeSource}>
                        <option value="" disabled selected>Select a source bucket</option>
                    {
                        buckets.map((bucket : any) => {
                            return <option value={bucket.id} id={bucket.id}>{bucket.name}</option>
                        })
                    }     
                    </select>
                    <h3>Recipient Bucket</h3>
                    <select name="recipientBucketName" className="transferPageInputs" required onChange={handleChangeRecipient}>
                    <option value="" disabled selected>Select a recipient bucket</option>
                    {
                        buckets.map((bucket : any) => {
                            return <option value={bucket.id} id={bucket.id}>{bucket.name}</option>
                        })
                    }
                    </select>
                    <h3>Amount</h3>
                    <input 
                        onChange={handleChangeAmount}
                        name="transferAmount"
                        className="transferPageInputs"
                        type="number"
                        min="1"
                        placeholder='How much will you transfer?'
                        required/>
                </div>
                <div className={styles['buttons']}>
                    <button onClick={handleTransferFunds}>Transfer Funds</button>
                    <button>Cancel</button>
                </div>
            </div>
        )
    }
}
//
export default TransferPage