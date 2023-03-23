import { useContext } from 'react';
import { Link } from 'react-router-dom'

import { SessionContext } from '../../contexts/SessionContext';
import server from '../../utils/server';
import styles from './NavBar.module.css';

const NavBar = () => {
    const sessionInfo = useContext(SessionContext)

    const logoutSession = async () => {
        await server.get('logout');
        sessionInfo.logout()
    }

    return <div className={styles['navbar']}><nav>
        <Link to="/">Budgeteer</Link>
        <Link to="/buckets">Buckets</Link>
        <Link to="/purchase">Purchase</Link>
        <Link to="/paycheck">Paycheck</Link>
        <Link to="/transfer">Transfer</Link>
        <button onClick={() => logoutSession()}>Logout</button>
    </nav></div>
}

export default NavBar