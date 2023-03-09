import React, {useState} from 'react';

const LoginForm = () => {

    const [errorMessage, setErrorMessage] = useState("")

    // Mock Data (?)
    const database = [
        {
        email: "admin@budgeteer.com",
        password: "admin"
        },
        {
        email: "email@website.com",
        password: "password"
        }
    ]

    const errorMessageTexts = {
        email: "Invalid Email",
        password: "Invalid Password"
    }

    const handleSubmit = (event: any) => {
        event.preventDefault()

        // in React, never try to access the document directly
        // var { email, password } = document.getElementsByName("loginForm")[0] as HTMLFormElement

        // the form elements can be accessed from the event parameter
        // it is of the form event.target.[name of the input field]
        let email = event.target.email as HTMLFormElement
        let password = event.target.password as HTMLFormElement

        const userCredentials = database.find((user) => user.email === email.value)

        if (userCredentials) {
            if (userCredentials.password !== password.value) {
                setErrorMessage(errorMessageTexts.password)
            }
            else {
                setErrorMessage("Success")
            }
        }
        else {
            setErrorMessage(errorMessageTexts.email)
        }
    }

    return (
        <form name={"loginForm"} onSubmit={handleSubmit}>
            <fieldset>
                <legend>Login</legend>
                <input name={"email"} className={"loginFormInputFields"} type={"email"} placeholder={"Email"} pattern={"[A-Za-z0-9]+@[A-Za-z0-9]+.[A-Za-z]+"} required></input>
                <input name={"password"} className={"loginFormInputFields"} type={"password"} placeholder={"Password"} required></input>
                <input className={"loginFormSubmitButton"} name={'login'} type={"submit"} value={"Login"}></input>
                {errorMessage ? <div>{errorMessage}</div> : ''}
            </fieldset>
        </form>
    )	
}    
export default LoginForm