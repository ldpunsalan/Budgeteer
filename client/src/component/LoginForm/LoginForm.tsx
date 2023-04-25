import React, { useState, useContext } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';

import { SessionContext, SessionVerbs } from '../../contexts/SessionContext';
import server from '../../utils/server';

import styles from './LoginForm.module.css';

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../utils/firebase'

const LoginForm = () => {
    const sessionInfo = useContext(SessionContext)
    const sessionVerb = useContext(SessionVerbs)
    const navigate = useNavigate()

    const [errorMessage, setErrorMessage] = useState("")

    const handleSubmit = async (event: any) => {
        event.preventDefault()

        // in React, never try to access the document directly
        // var { email, password } = document.getElementsByName("loginForm")[0] as HTMLFormElement

        // the form elements can be accessed from the event parameter
        // it is of the form event.target.[name of the input field]
        const email = event.target.email
        const password = event.target.password 
        console.log(email.value)
        console.log(password.value)
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email.value, password.value)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user)
                sessionVerb.login(user.uid)
                navigate("/")
            })

    }

    if (sessionInfo.loggedIn) {
        return <Navigate to="/" replace={true} />
    }

    return (
        <div className={styles['app-container']}>
        <Link to="/" className={styles['header']}>
            <h1>Budgeteer</h1>
        </Link>
        <form name={"loginForm"} onSubmit={handleSubmit}>
            <input 
                name="email" 
                className={styles['text-box']}
                type="email" 
                placeholder="Email" 
                pattern="[A-Za-z0-9]+@[A-Za-z0-9]+.[A-Za-z]+" 
                required />
            <br/>
            <input 
                name="password" 
                className="loginFormInputFields" 
                type="password" 
                placeholder="Password" 
                required />
            <br/>
            <input 
                className={styles['button']}
                name="login" 
                type="submit" 
                value="Login" />
            {errorMessage ? <div>{errorMessage}</div> : ''}
            <p className={styles['text']}>Don't have an account yet? <Link to="/signup" className={styles['link']}>Sign-Up</Link></p>
        </form>
        </div>
    )	
}    
export default LoginForm