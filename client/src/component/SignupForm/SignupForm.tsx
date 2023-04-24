import React, { useContext, useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import validator from 'validator';
import { createUserWithEmailAndPassword } from 'firebase/auth'

import { auth } from '../../utils/firebase'
import server from '../../utils/server';
import styles from './SignupForm.module.css'
import { SessionContext } from '../../contexts/SessionContext';

const passOpt = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
}

const SignupForm = () => {
    const sessionInfo = useContext(SessionContext)
    const navigate = useNavigate()
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessage2, setErrorMessage2] = useState('');

    /* Use alerts or not/ can switch to custom error message on handleSubmit (button press)1 */

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        if (email === undefined || email === '' || password === undefined || password === '' || confirmpassword === undefined || confirmpassword ==='') {
            setErrorMessage2('Fill Up all the Fields')
        } else if (!validator.isStrongPassword(password, passOpt)) {
            setErrorMessage2('Weak Password')
        } else if (password !== confirmpassword) {
            setErrorMessage2('Passwords inputted are not the same')
        } else {
            try {
                await server.post('users/new', {
                    email: email,
                    password: password
                })
                setErrorMessage2('Success')
                alert('Successfully created new account! Please login.')
                navigate('/login')
            } catch (err) {
                console.error(err);
                const errMsg = (err as any).response.data.msg;
                setErrorMessage(errMsg)
            }

            // for now, lets use a database that will still work even
            // if there's no internet
            // createUserWithEmailAndPassword(auth,email,password)
            //     .then(u => {
            //         console.log(u)
            //         navigate("/login")
            //     })
            //     .catch(error => {
            //         switch (error.code) {
            //             case 'auth/email-already-in-use':
            //             console.log(`Email address already in use.`);
            //             break;
            //             case 'auth/invalid-email':
            //             console.log(`Email address is invalid.`);
            //             break;
            //             case 'auth/weak-password':
            //             console.log('Password is not strong enough. Add additional characters including special characters and numbers.');
            //             break;
            //             default:
            //             console.log(error.message);
            //             break;
            //         }
            //     });
        } 
    }


    const handleInputChange = (e: any) => {
        const value = e.target.value
        const name = e.target.name

        if (name === "email") {
            setEmail(value)
        }

        if (name === "password") {
            setPassword(value)
        }

        if (name === "password") {
            if (validator.isStrongPassword(value, passOpt)) {
                setErrorMessage('Strong')
            } else {
                setErrorMessage("Weak")
            }
        }

        if (name === "confirmpassword") {
            setConfirmPassword(value)
        }
        
    }

    if (sessionInfo.loggedIn) {
        return <Navigate to="/" replace={true} />
    }

    return (
        <div className={styles['app-container']}>
        <Link to="/" className={styles['header']}>
            <h1>Budgeteer</h1>
        </Link>
        <div className="registerpage">
            <div className="email">
                <input 
                    className="register_input" 
                    type="email" 
                    name="email" 
                    placeholder="Email"
                    value={email} 
                    onChange = {(e) => handleInputChange(e)} />
            </div>

            <div className="password">
                <input 
                    className="register_input" 
                    type="password" 
                    name="password"
                    placeholder="Password" 
                    value={password} 
                    onChange = {(e) => handleInputChange(e)} /> 
                {errorMessage === '' ? null :
                <span style={{fontWeight: 'bold', color: '#2684FC'}}> {errorMessage}</span>}
            </div>

            <div className="confirm-password">
                <input 
                    className="register_input" 
                    type="password" 
                    name="confirmpassword" 
                    placeholder="Confirm Password"
                    value={confirmpassword} 
                    onChange = {(e) => handleInputChange(e)} />
            </div>
            {errorMessage2 === '' ? null :
            <span className={styles['error']}> {errorMessage2}</span>}
            <br />
            <button onClick={handleSubmit} className={styles['button']}> Register </button>
            <p className={styles['text']}>Already have an account? <Link to="/login" className={styles['link']}>Log-In</Link></p>

            </div>
        </div>
    )
}

export default SignupForm