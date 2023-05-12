import { useEffect, useState, useContext } from 'react'
import { set, ref, get, remove} from "firebase/database"

import { db } from '../../utils/firebase'
import { SessionContext } from '../../contexts/SessionContext'

import styles from '../Pages.module.css'

/**
 * A component for rendering the paycheck page.
 * @function PaycheckPage
*/
const PaycheckPage = () => {
    const [loading, setLoading] = useState(true)
    const [isUpdate, setUpdate] = useState<any>([])
    const [current, setCurrent] = useState<any>({})
    const [paychecks, setPaychecks] = useState<any>([])
    const sessionInfo = useContext(SessionContext)

    useEffect(() => {
        const userID = sessionInfo.user as any

        const fetchPaychecks = async () => {
            const snapshot = await get(ref(db))
            const data = snapshot.val()
            
            if (!data[userID].Paychecks) {
                const emptyPaycheck = {
                    id: 0,
                    value: 0
                }
                setCurrent({ ...emptyPaycheck })
                setPaychecks([{ ...emptyPaycheck }])
                set(ref(db,`/${sessionInfo.user}/Paychecks/${0}`), emptyPaycheck)
            } else {
                setCurrent(data[userID].Paychecks)
                const arr = Object.entries(data[userID].Paychecks)
                setCurrent(arr[arr.length-1][1])
                let paycheckList : any[] = [] 
                paycheckList = arr.map((cur) => cur[1])
                setPaychecks(paycheckList)
            }
            setLoading(false)
        }

        fetchPaychecks()
    }, [])

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        if (isUpdate) {
            const newValue = e.target.paycheckAmount.value
            if (current.value == newValue) {
                alert("No paycheck changes were made (Same Values)")
            } else {
                const newPaycheck = {
                    id: current.id + 1,
                    value: newValue
                }

                set(ref(db, `/${sessionInfo.user}/Paychecks/${newPaycheck.id}`), newPaycheck)
                setPaychecks((prev: any) => [...prev, newPaycheck])
                setCurrent(newPaycheck)
            }
        } else {
            if (paychecks.length > 1) {
                const newPaychecks = paychecks.filter((paycheck : any) => paycheck.id !== current.id)
                remove(ref(db, `/${sessionInfo.user}/Paychecks/${current.id}`))
                setPaychecks(newPaychecks)
                setCurrent(newPaychecks[newPaychecks.length-1])
            }
        }
        e.target.reset()
    }

    if (loading) {
        return <div>Loading...</div>
    } else {
        return (
            <div className={styles['container']}>
                <div className={styles['content']}>
                    <h2>PAYCHECK</h2>
                    <form name='paycheckForm' onSubmit={handleSubmit}>
                        <label>
                        <h3>Paycheck Amount</h3>
                        <h1>&#8369;{current.value}</h1>
                        <input 
                            name="paycheckAmount"
                            className="paycheckPageInputs"
                            type="number"
                            min="1"
                            placeholder='How much is your overall budget?'
                            required/>
                        </label>
                        <input 
                            onClick={() => setUpdate(true)} 
                            name='updateButton' 
                            type='submit' 
                            value='Update Paycheck' 
                            className={styles['button']}></input>
                        <button 
                            onClick={() => setUpdate(false)}
                            formNoValidate 
                            className={styles['button']}>Undo</button>
                    </form>
                </div>
            </div>
        )
    }
}
//
export default PaycheckPage