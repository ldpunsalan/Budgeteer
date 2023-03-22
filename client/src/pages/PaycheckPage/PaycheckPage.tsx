
const PaycheckPage = () => {
    return (
        <div>
            <h2>PAYCHECK</h2>
            <h3>Paycheck Amount</h3>
            <input 
                name="paycheckAmount"
                className="paycheckPageInputs"
                type="number"
                min="1"
                placeholder='How much is your overall budget?'
                required/>
            <button>Update Paycheck</button>
            <button>Undo</button>
        </div>
    )
}
//
export default PaycheckPage