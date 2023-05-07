import { useEffect, useState } from 'react'

import server from '../../utils/server'

import styles from '../Pages.module.css'

import { db } from '../../utils/firebase'
import { set, ref, update, onValue, get, remove} from "firebase/database"
import { SessionContext } from '../../contexts/SessionContext'
import { useContext } from 'react'

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

        console.log("src:", source)
        console.log("rec", recipient)

        if (source === undefined) {
            return alert('Please choose a source bucket')
        } else if (recipient === undefined) {
            return alert('Please choose a recipient bucket')
        }

        const srcBucket = buckets.filter((bucket : any) => bucket.id == source)[0]
        const recBucket = buckets.filter((bucket : any) => bucket.id == recipient)[0]
        const srcValue = srcBucket.value
        const recValue = recBucket.value
        // Spot errors
        if (srcBucket.id === recBucket.id) {
            alert('ERROR: Source and recipient buckets cannot be the same.')
            return
        }
        else if (parseInt(srcValue) < parseInt(amount)) {
            alert("ERROR: Amount cannot be greater than source bucket's value.")
            return
        }
        else if (isNaN(amount)) {
            alert("ERROR: Please enter a valid amount.")
            return
        }

        if (confirm('Do you want to proceed?')) {
            const newSrc = {
                ...srcBucket,
                value: parseInt(srcValue) - parseInt(amount)
                
            }

            // FIREBASE //
            update(ref(db,`/${sessionInfo.user}/Buckets/${source}`),{
                value:  parseInt(srcValue) - parseInt(amount)
            })
             // FIREBASE //

             
            const newRec = {
                ...recBucket, 
                value: parseInt(recValue) + parseInt(amount)
            }

             // FIREBASE //
            update(ref(db,`/${sessionInfo.user}/Buckets/${recipient}`),{
                value: parseInt(recValue) + parseInt(amount)
            })
             // FIREBASE //

            setBuckets((prev:any) => prev.map((bucket : any) => {
                if (bucket.id == srcBucket.id) {
                    return newSrc
                } else if (bucket.id == recBucket.id) {
                    return newRec
                } else {
                    return bucket
                }
            }))
            server.post('/buckets/transfer', {
                src: newSrc,
                rec: newRec
            })
          } else {
            return
          }
    }

    useEffect(() => {
        console.log(buckets)
    }, [buckets])
    if (loading) {
        return <p>loading...</p>
    }
    else {
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