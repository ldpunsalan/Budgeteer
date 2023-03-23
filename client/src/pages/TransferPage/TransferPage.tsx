import styles from '../Pages.module.css'

const TransferPage = () => {
    return (
        <div className={styles['content']}>
            <h2>TRANSFER FUNDS</h2>
            <h3>Source Bucket</h3>
            <select name="sourceBucketName" className="transferPageInputs">
                <option value="" disabled selected>Choose the source bucket</option>
                <option value="Savings">Savings</option>
                <option value="Splurge">Splurge</option>
                <option value="Medicine">Medicine</option>
                <option value="Art">Art</option>
                <option value="Work">Work</option>
                <option value="Education">Education</option>
            </select>
            <h3>Recipient Bucket</h3>
            <select name="recipientBucketName" className="transferPageInputs">
                <option value="" disabled selected>Choose the recipient bucket</option>
                <option value="Savings">Savings</option>
                <option value="Splurge">Splurge</option>
                <option value="Medicine">Medicine</option>
                <option value="Art">Art</option>
                <option value="Work">Work</option>
                <option value="Education">Education</option>
            </select>
            <h3>Amount</h3>
            <input 
                name="transferAmount"
                className="transferPageInputs"
                type="number"
                min="1"
                placeholder='How much will you transfer?'
                required/>
            <button>Transfer Funds</button>
            <button>Cancel</button>
        </div>
    )
}
//
export default TransferPage