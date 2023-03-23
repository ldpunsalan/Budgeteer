import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { SessionContext } from '../../contexts/SessionContext';
import server from '../../utils/server';
import styles from './LoginForm.module.css'

const LoginForm = () => {
    const sessionInfo = useContext(SessionContext)
    const navigate = useNavigate()

    const [errorMessage, setErrorMessage] = useState("")

    const handleSubmit = async (event: any) => {
        event.preventDefault()

        // in React, never try to access the document directly
        // var { email, password } = document.getElementsByName("loginForm")[0] as HTMLFormElement

        // the form elements can be accessed from the event parameter
        // it is of the form event.target.[name of the input field]
        const email = event.target.email as HTMLFormElement
        const password = event.target.password as HTMLFormElement

        try {
            const res = await server.post('login', {
                email: email.value,
                password: password.value
            })

            setErrorMessage("Success")
            sessionInfo.login(res.data.user)
            navigate("/")
            
        } catch (err: any) {
            setErrorMessage(err.response.data.msg)
            console.log(err)
        }

    }

    return (
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
        </form>
    )	
}    
export default LoginForm