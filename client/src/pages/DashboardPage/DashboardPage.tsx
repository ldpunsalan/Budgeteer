import { useContext } from 'react'
import { Navigate, Outlet, Link } from 'react-router-dom'
import { SessionContext } from '../../contexts/SessionContext'
import NavBar from '../../component/NavBar/NavBar'
import styles from '../Pages.module.css'

/**
 * A component for rendering the dashboard when the user makes a successful log-in.
 * @function DashboardPage
*/
const DashboardPage = () => {
    const sessionInfo = useContext(SessionContext)

    if (sessionInfo.loading) {
        return <div>Loading...</div>
    } else if (sessionInfo.loggedIn) {
        return (
            <div className={styles['app-container']}>
                <NavBar></NavBar>
                <div className={styles['container']}>
                    <div className={styles['content']}>
                        <h2>DASHBOARD</h2>
                        Welcome, user {sessionInfo.user}!
                    </div>
                </div>
            </div>
        )
    } else {
        console.warn('Please login')
        return <Navigate to="/login" replace={true} />  // if removed, fixes the double login when logout button is pressed.
                                                        // why tho? maybe it redirects too fast?
    }
}
//
export default DashboardPage