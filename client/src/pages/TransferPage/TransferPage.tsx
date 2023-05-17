import { useState, useContext } from 'react'
import { ref, update } from "firebase/database"

import styles from '../Pages.module.css'

import { db } from '../../utils/firebase'
import { SessionContext } from '../../contexts/SessionContext'
import useBuckets from '../../hooks/useBuckets'
import { Bucket } from '../../types'

/**
 * A component for rendering the fund transfer page.
 * @function TransferPage
*/
const TransferPage = () => {
    const sessionInfo = useContext(SessionContext)
    const userID = sessionInfo.user

    const [source, setSource] = useState<string>()
    const [recipient, setRecipient] = useState<string>()
    const [amount, setAmount] = useState<number|null>()

    const bucketsData = useBuckets(userID)
    const { loading } = bucketsData.loading
    const { buckets, setBuckets } = bucketsData.buckets

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

    const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const amount = parseInt(e.target.value)
        setAmount(amount)
    }

    const handleTransferFunds = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()

        if (source === undefined) {
            return alert('Please choose a source bucket')
        } else if (recipient === undefined) {
            return alert('Please choose a recipient bucket')
        }

        const srcBucket = buckets.filter((bucket) => bucket.id == source)[0]
        const recBucket = buckets.filter((bucket) => bucket.id == recipient)[0]
        const srcValue = srcBucket.value
        const recValue = recBucket.value

        // Handle errors
        if (srcBucket.id === recBucket.id) {
            return alert('ERROR: Source and recipient buckets cannot be the same.')
        } else if (amount != 0 && !amount) {
            return alert("ERROR: Please enter a valid amount.")
        } else if (srcValue < amount) {
            return alert("ERROR: Amount cannot be greater than source bucket's value.")
        }

        if (confirm('Do you want to proceed?')) {

            const newSrc: Bucket = {
                ...srcBucket,
                value: srcValue - amount
            }

            const newRec: Bucket = {
                ...recBucket, 
                value: recValue + amount
            }
            
            // update the database
            update(ref(db,`/${sessionInfo.user}/Buckets/${source}`), newSrc)
            update(ref(db,`/${sessionInfo.user}/Buckets/${recipient}`), newRec)

            // update the ram
            setBuckets((prev) => prev.map((bucket) => {
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
                        buckets.map((bucket) => {
                            return <option value={bucket.id} id={bucket.id}>{bucket.name}</option>
                        })
                    }     
                    </select>
                    <h3>Recipient Bucket</h3>
                    <select name="recipientBucketName" className="transferPageInputs" required onChange={handleChangeRecipient}>
                    <option value="" disabled selected>Select a recipient bucket</option>
                    {
                        buckets.map((bucket) => {
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