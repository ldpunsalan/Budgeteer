import { useEffect, useState } from 'react'

import server from '../../utils/server'

import styles from '../Pages.module.css'

const TransferPage = () => {
    const [loading, setLoading] = useState(true)
    const [source, setSource] = useState<any>()
    const [recipient, setRecipient] = useState<any>()
    const [buckets, setBuckets] = useState<any>([])
    const [amount, setAmount] = useState<any>()

    useEffect(() => {
        const fetchBuckets = async () => {
            const res = await server.get('buckets')
            const data = res.data.data
            setBuckets(data)
            setLoading(false)
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

        // No errors detected; Set value of Source Bucket to Recipient Bucket Value
        setBuckets((prev:any) => prev.map((b:any) => {
            if (b.id == srcBucket.id) {
                return {
                    ...srcBucket,
                    value: parseInt(srcValue) - parseInt(amount)
                }
            } else if (b.id == recBucket.id) {
                return {
                    ...recBucket, 
                    value: parseInt(recValue) + parseInt(amount)
                }
            } else {
                return b
            }
        }))
        alert("Transfer successful.")
        
    }
    if (loading) {
        return <p>loading...</p>
    }
    else {
        return (
            <div className={styles['content']}>
                <h2>TRANSFER FUNDS</h2>
                <h3>Source Bucket</h3> 
                <p>{source} | {recipient}</p>
                <select name="sourceBucketName" className="transferPageInputs" onChange={handleChangeSource}>
                <option value="" disabled selected>Select a source bucket</option>
                {
                    buckets.map((bucket : any) => {
                        return <option value={bucket.id} id={bucket.id}>{bucket.name}</option>
                    })
                }     
                </select>
                <h3>Recipient Bucket</h3>
                <select name="recipientBucketName" className="transferPageInputs" onChange={handleChangeRecipient}>
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
                <button onClick={handleTransferFunds}>Transfer Funds</button>
                <button>Cancel</button>
            </div>
        )
    }
}
//
export default TransferPage