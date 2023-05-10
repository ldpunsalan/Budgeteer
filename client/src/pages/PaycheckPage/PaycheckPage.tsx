import { useEffect, useState } from 'react'

import server from '../../utils/server'
import styles from '../Pages.module.css'


import { db } from '../../utils/firebase'
import { set, ref, update, onValue, get, remove} from "firebase/database"
import { SessionContext } from '../../contexts/SessionContext'
import { useContext } from 'react'

const PaycheckPage = () => {
    const [loading, setLoading] = useState(true)
    const [isUpdate, setUpdate] = useState<any>([])
    const [current, setCurrent] = useState<any>({})
    const [paychecks, setPaychecks] = useState<any>([])
    const sessionInfo = useContext(SessionContext)

    useEffect(() => {
        const userID = sessionInfo.user as any
        const fetchPaychecks = async () => {
            get(ref(db)).then((snapshot)=>{
                const data = snapshot.val()
                if (!data[userID].Paychecks)
                {   
                    setCurrent({"id": 0, "value": 0})
                    setPaychecks([{"id": 0, "value": 0}])
                    set(ref(db,`/${sessionInfo.user}/Paychecks/${0}`), {
                        id: 0,
                        value: 0,
                    })
                    setLoading(false)
                }
                else{
                    setCurrent(data[userID].Paychecks)
                    let arr = Object.entries(data[userID].Paychecks)
                    // console.log("arr : ", arr)
                    setCurrent(arr[arr.length-1][1])
                    let paycheckList : any[] = [] // populate this
                    paycheckList = arr.map((cur) => cur[1])
                
                    setPaychecks(paycheckList)
                    setLoading(false)
                }
            })
        }
        fetchPaychecks()
    }, [])

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        if (isUpdate) {
            const newValue = e.target.paycheckAmount.value
            if (current.value == newValue) {
                alert("No paycheck changes were made (Same Values)")
            }
            else {
                // console.log("UPDATE VALUE TO : " + newValue)
                const newPaycheck = {
                    id: current.id + 1,
                    value: newValue
                }
                const A = newPaycheck.id
                const B = newPaycheck.value

                set(ref(db,`/${sessionInfo.user}/Paychecks/${A}`), {
                    id: A,
                    value: B,
                })
                setPaychecks((prev: any) => [...prev, newPaycheck])
                setCurrent(newPaycheck)
                // e.target.reset()
            }
        }
        else {
            // console.log("UNDO")
            // console.log("Current : ", current)
            // console.log("Current : ", paychecks)
            // console.log("paychecks before: ", paychecks)
            if (paychecks.length > 1) {
                const newPaychecks = paychecks.filter((paycheck : any) => paycheck.id !== current.id)
                remove(ref(db,`/${sessionInfo.user}/Paychecks/${current.id}`))
                setPaychecks(newPaychecks)
                // console.log(newPaychecks)
                setCurrent(newPaychecks[newPaychecks.length-1])
                // console.log("paychecks after: ", paychecks)
            }

            // alert(current.value)
            // try {
            //     server.post('/paycheck/undo', {})
            // } catch (err) {
            //     console.log(err)
            // }
            // console.log(paycheck)
            // paycheck.pop()
            // setCurrent(paycheck[paycheck.length-1])
            // console.log(paycheck)
        }
        // console.log("Data : ", paycheck, "\nLength : ", paycheck.length)
    }

    if (loading) {
        return <div>Loading...</div>
    }
    else {
        return (
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
                    <input onClick={() => setUpdate(true)} name='updateButton' type='submit' value='Update Paycheck'></input>
                    <input onClick={() => setUpdate(false)}name='undoButton' type='submit' value='Undo' formNoValidate></input>
                </form>
            </div>
        )
    }
}
//
export default PaycheckPage