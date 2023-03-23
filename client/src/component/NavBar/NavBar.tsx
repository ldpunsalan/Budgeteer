import { useContext } from 'react';
import { Link } from 'react-router-dom'

import { SessionContext } from '../../contexts/SessionContext';
import server from '../../utils/server';

const NavBar = () => {
    const sessionInfo = useContext(SessionContext)

    const logoutSession = async () => {
        await server.get('logout');
        sessionInfo.logout()
    }

    return <nav>
        <Link to="/buckets">Buckets</Link>
        <Link to="/purchase">Purchase</Link>
        <Link to="/paycheck">Paycheck</Link>
        <Link to="/transfer">Transfer</Link>
        <button onClick={() => logoutSession()}>Logout</button>
    </nav>
}

export default NavBar