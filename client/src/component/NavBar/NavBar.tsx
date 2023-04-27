import { useContext } from 'react';
import { NavLink } from 'react-router-dom'

import { SessionContext, SessionVerbs } from '../../contexts/SessionContext';
import server from '../../utils/server';
import styles from './NavBar.module.css';

const NavBar = () => {
    const sessionInfo = useContext(SessionContext)
    const sessionVerb = useContext(SessionVerbs)

    const logoutSession = async () => {
        await server.get('logout');
        sessionVerb.logout()
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