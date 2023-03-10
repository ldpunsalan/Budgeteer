import React, {useState} from 'react';
import validator from 'validator';
import styles from './SignupForm.module.css';

const SignupForm = () => {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessage2, setErrorMessage2] = useState('');

    /* Use alerts or not/ can switch to custom error message on handleSubmit (button press)1 */

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
        const name = e.target.name

        if (name === "email")
            setEmail(value)

        if (name === "password")
            setPassword(value)

        if (name === "password")
            if (validator.isStrongPassword(value,{ minLength: 8, minLowercase:1, minUppercase:1, minNumbers:1, minSymbols:1})) 
                setErrorMessage('Strong')
            else
                setErrorMessage("Weak")

        if (name === "confirmpassword")
            setConfirmPassword(value);
        
    }


    return (
        <div className="registerpage">
            {errorMessage2 === '' ? null :
            <span style={{fontWeight: 'bold',}}> {errorMessage2}</span>}
            <br />

            <div className={styles['text-box']}>
                <input 
                    className="register_input" 
                    type="email" 
                    name="email" 
                    placeholder="Enter your email address"
                    value={email} 
                    onChange = {(e) => handleInputChange(e)} />
            </div>

            <div className={styles['text-box']}>
                <input 
                    className="register_input" 
                    type="password" 
                    name="password"
                    placeholder="Password" 
                    value={password} 
                    onChange = {(e) => handleInputChange(e)} /> 
                {errorMessage === '' ? null :
                <span style={{fontWeight: 'bold', color: 'blue'}}> {errorMessage}</span>}
            </div>

            <div className={styles['text-box']}>
                <input 
                    className="register_input" 
                    type="password" 
                    name="confirmpassword" 
                    placeholder="Confirm Password"
                    value={confirmpassword} 
                    onChange = {(e) => handleInputChange(e)} />
            </div>

            <button onClick={handleSubmit} className={styles['button']} >Register</button>

        </div>
    )
}

export default SignupForm