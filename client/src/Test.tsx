import { addListener } from 'process';
import React, {useState} from 'react';
import validator from 'validator';

const Test = () => {


const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirmpassword, setConfirmPassword] = useState('');

const [errorMessage, setErrorMessage] = useState('');
const [errorMessage2, setErrorMessage2] = useState('');



/* Use alerts or not/ can switch to custom error message on handleSubmit (button press) */

const handleSubmit = (e: any) => {
    e.preventDefault();
    if (email === undefined || email === '' || password === undefined || password === '' || confirmpassword === undefined || confirmpassword ==='') {
        setErrorMessage2('Fill Up all the Fields')
    }
    else if (!validator.isStrongPassword(password,{minLength: 8, minLowercase:1, minUppercase:1, minNumbers:1, minSymbols:1}))
        setErrorMessage2('Weak Password')

    else if (password !== confirmpassword)
        setErrorMessage2('Passwords inputted are not the same')

    else 
        setErrorMessage2('Success')
    console.log(email,password,confirmpassword)
}


const handleInputChange = (e: any) => {
    const value = e.target.value
    const id = e.target.id

    if(id === "email")
        setEmail(value)

    if(id === "password")
        setPassword(value)

    if (id === "password")
        if (validator.isStrongPassword(value,{ minLength: 8, minLowercase:1, minUppercase:1, minNumbers:1, minSymbols:1})) 
            setErrorMessage('Strong')
        else
            setErrorMessage("Weak")

    if(id === "confirmpassword")
        setConfirmPassword(value);
    
}


return (
    <div className="registerpage">
        
        {errorMessage2 === '' ? null :
           <span style={{fontWeight: 'bold',}}> {errorMessage2}</span>}
        <br />

       <div className="email">
           <label className="register_label">Email</label>
           <input className="register_input" type="email" id="email" value={email} onChange = {(e) => handleInputChange(e)}></input>
       </div>

       <div className="password">
           <label className="register_label">Password</label>
           <input className="register_input" type="password" id="password" value={password} onChange = {(e) => handleInputChange(e)}></input> 
           {errorMessage === '' ? null :
           <span style={{fontWeight: 'bold', color: 'blue'}}> {errorMessage}</span>}
       </div>

       <div className="confirm-password">
           <label className="register_label">Confirm Password</label>
           <input className="register_input" type="password" id="confirmpassword" value={confirmpassword} onChange = {(e) => handleInputChange(e)}></input>
       </div>

       <button onClick={handleSubmit}> Register </button>

    </div>
)
}

export default Test