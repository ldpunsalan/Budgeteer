import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import { SessionContext } from '../../contexts/SessionContext'

const PaycheckPage = () => {
    const sessionInfo = useContext(SessionContext)
    const navigate = useNavigate()

    if (sessionInfo.loggedIn) {
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
    } else {
        navigate("/")
        return (
            <div>Welcome to Budgeteer! Login now!</div>
        )
    }
}
//
export default PaycheckPage