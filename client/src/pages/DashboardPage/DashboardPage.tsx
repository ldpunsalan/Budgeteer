import { useContext } from 'react'
import { Navigate, Outlet, Link } from 'react-router-dom'
import { SessionContext } from '../../contexts/SessionContext'
import NavBar from '../../component/NavBar/NavBar'
import styles from '../Pages.module.css'

const DashboardPage = () => {
    const sessionInfo = useContext(SessionContext)

    if (sessionInfo.loggedIn) {
        return (
            <div className={styles['app-container']}>
                <NavBar></NavBar>
                <div className={styles['content']}>
                    <h2>DASHBOARD</h2>
                    Welcome {sessionInfo.user}!
                </div>
            </div>
        )
    } else {
        return <Navigate to="/login" replace={true} />
    }
}
//
export default DashboardPage