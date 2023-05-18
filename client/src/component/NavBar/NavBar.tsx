import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'

import { SessionVerbs } from '../../contexts/SessionContext';
import styles from './NavBar.module.css';

/**
 * A component for rendering the navigation bar.
 * @function NavBar
*/
const NavBar = () => {
    const sessionVerb = useContext(SessionVerbs)
    const navigate = useNavigate()

    /**
     * Logs the user out of their session.
     * @function logoutSession
     * @async
    */    
    const logoutSession = async () => {
        sessionVerb.logout()
        navigate('/login')
    }

    return <div className={styles['navbar']}><nav>
        <NavLink to="/" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? styles["active"] : ""}>Budgeteer</NavLink>
        <NavLink to="/buckets" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? styles["active"] : ""}>Buckets</NavLink>
        <NavLink to="/purchase" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? styles["active"] : ""}>Purchase</NavLink>
        <NavLink to="/paycheck" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? styles["active"] : ""}>Paycheck</NavLink>
        <NavLink to="/transfer" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? styles["active"] : ""}>Transfer</NavLink>
        <button onClick={() => logoutSession()} className={styles['logout-button']}>Logout</button>
    </nav></div>
}

export default NavBar