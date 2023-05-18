import { useState, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';

import { SessionContext, SessionVerbs } from '../../contexts/SessionContext';

import styles from './LoginForm.module.css';

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const LoginForm = () => {
    const sessionInfo = useContext(SessionContext)
    const sessionVerb = useContext(SessionVerbs)

    const [errorMessage, setErrorMessage] = useState("")

    const handleSubmit = async (event: any) => {
        event.preventDefault()

        const email = event.target.email
        const password = event.target.password 
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email.value, password.value)
            .then((userCredential) => {
                const user = userCredential.user;
                // console.log(user)
                sessionVerb.login(user.uid, user.email || "")
            }).catch(err => {
                setErrorMessage('Invalid username/password')
                console.error(err)
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