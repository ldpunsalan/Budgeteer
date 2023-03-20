import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import { SessionContext } from '../../contexts/SessionContext'

const BucketsPage = () => {
    const sessionInfo = useContext(SessionContext)
    const navigate = useNavigate()

    if (sessionInfo.loggedIn) {
        return (
            <div>
                <h2>BUCKETS</h2>
                <h1>&#8369;3125.00</h1>
                <h3>Bucket Name</h3>
                <select name="bucketName" className="bucketPageInputs">
                    <option value="Savings">Savings</option>
                    <option value="Splurge">Splurge</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Art">Art</option>
                    <option value="Work">Work</option>
                    <option value="Education">Education</option>
                </select>
                <h3>Weight</h3>
                <input 
                    name="bucketWeight"
                    className="bucketPageInputs"
                    type="number"
                    min="1"
                    required/>
                <button>Edit Bucket</button>
                <button>Delete Bucket</button>
            </div>
        )
    } else {
        navigate("/")
        return (
            <div>Welcome to Budgeteer! Login now!</div>
        )
    }
}

export default BucketsPage