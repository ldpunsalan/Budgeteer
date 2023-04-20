import { useContext } from 'react';
import { Link } from 'react-router-dom'

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
        <Link to="/">Budgeteer</Link>
        <Link to="/buckets">Buckets</Link>
        <Link to="/purchase">Purchase</Link>
        <Link to="/paycheck">Paycheck</Link>
        <Link to="/transfer">Transfer</Link>
        <button onClick={() => logoutSession()} className={styles['logout-button']}>Logout</button>
    </nav></div>
}

export default NavBar