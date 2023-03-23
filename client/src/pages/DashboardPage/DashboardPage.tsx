import { useContext } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { SessionContext } from '../../contexts/SessionContext'
import NavBar from '../../component/NavBar/NavBar'

const DashboardPage = () => {
    const sessionInfo = useContext(SessionContext)

    if (sessionInfo.loggedIn) {
        return (
            <div>
                <NavBar></NavBar>
                <h2>DASHBOARD</h2>
                Welcome {sessionInfo.user}!
            </div>
        )
    } else {
        return (
            <div>
                <nav>
                <Link to="/">
                    <h1>Budgeteer</h1>
                </Link>
                    <Link to="/signup">Sign-Up</Link>
                    <Link to="/login">Log-In</Link>
                </nav>
            <div>Welcome to Budgeteer! Login now!</div>
            </div>
        )
    }
}
//
export default DashboardPage