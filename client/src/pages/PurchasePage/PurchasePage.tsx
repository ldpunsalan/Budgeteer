
const PurchasePage = () => {
    return (
        <div>
            <h2>PURCHASE</h2>
            <h3>Purchase Name</h3>
            <input 
                name="purchaseName"
                className="PurchasePageInputs"
                type="text"
                placeholder='Where did you spend your money?'
                required/>
            <h3>Amount</h3>
            <input 
                name="purchaseAmount"
                className="PurchasePageInputs"
                type="number"
                min="0"
                placeholder='How much did you spend?'
                required/>
            <h3>Bucket</h3>
            <select name="bucketName" className="purchasePageInputs">
                <option value="" disabled selected>Choose the relevant bucket</option>
                <option value="Savings">Savings</option>
                <option value="Splurge">Splurge</option>
                <option value="Medicine">Medicine</option>
                <option value="Art">Art</option>
                <option value="Work">Work</option>
                <option value="Education">Education</option>
            </select>
            <h3>Date</h3>
            <input
                name="purchaseDate"
                className='purchasePageInputs'
                type="date"
                required/>
            <button>Create Purchase</button>
        </div>
    )
}
//
export default PurchasePage