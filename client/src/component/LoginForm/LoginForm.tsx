const LoginForm = () => {
    return (
        <form>
            <fieldset>
                <legend>Login</legend>
                <input className={"loginFormInputFields"} type={"email"} placeholder={"Email"} pattern={"[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z]+"} required></input>
                <input name={"password"} className={"loginFormInputFields"} type={"password"} placeholder={"Password"} required></input>
                <input className={"loginFormSubmitButton"} type={"submit"} value={"Login"}></input>
            </fieldset>
        </form>
    )	
}    
export default LoginForm