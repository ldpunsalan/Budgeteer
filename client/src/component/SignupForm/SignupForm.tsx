import { useContext, useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import validator from 'validator';
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { set, ref} from "firebase/database"

import { auth } from '../../utils/firebase'
import styles from './SignupForm.module.css'
import { SessionContext } from '../../contexts/SessionContext';
import { db } from "../../utils/firebase"


/**
 * A function defining the required password characters.
 * @function passOpt
*/
const passOpt = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
}

/**
 * A component for rendering the sign-up page.
 * @function SignupForm
*/
const SignupForm = () => {
    const sessionInfo = useContext(SessionContext)
    const navigate = useNavigate()
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessage2, setErrorMessage2] = useState('');

    /* Use alerts or not/ can switch to custom error message on handleSubmit (button press)1 */
    
    /**
     * Handles form submission for user registration
     * @param {Object} e - Event object for form submission
    */
    const handleSubmit = async (e: any) => {
        e.preventDefault()

        if (email === undefined || email === '' || password === undefined || password === '' || confirmpassword === undefined || confirmpassword ==='') {
            setErrorMessage2('Fill Up all the Fields')
        } else if (!validator.isStrongPassword(password, passOpt)) {
            setErrorMessage2('Weak Password')
        } else if (password !== confirmpassword) {
            setErrorMessage2('Passwords inputted are not the same')
        } else {
            createUserWithEmailAndPassword(auth,email,password)
            .then(u => {
                const uid = u.user.uid
                const email = u.user.email
                set(ref(db,`/${u.user.uid}`), {
                    uid,
                    email,
                })

                navigate("/login")
            })
            .catch(error => {
                switch (error.code) {
                    case 'auth/email-already-in-use':
                    alert(`Email address already in use.`);
                    break;
                    case 'auth/invalid-email':
                    alert(`Email address is invalid.`);
                    break;
                    case 'auth/weak-password':
                    alert('Password is not strong enough. Add additional characters including special characters and numbers.');
                    break;
                    default:
                    alert(error.message);
                    break;
                }
            });
        } 
    }

    /**
     * Update input state based on event target value
     * @param {Object} e - The target value
    */
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
            <form onSubmit={handleSubmit} className="registerpage">
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
                {
                    errorMessage2 === '' 
                    ? null 
                    : <span className={styles['error']}> {errorMessage2}</span>
                }
                <br />
                <input type="submit" value="Register" className={styles['button']} />
                <p className={styles['text']}>Already have an account? <Link to="/login" className={styles['link']}>Log-In</Link></p>
            </form>
        </div>
    )
}

export default SignupForm