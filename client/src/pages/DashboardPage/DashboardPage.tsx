import { useContext } from 'react'

import { SessionContext } from '../../contexts/SessionContext'

const DashboardPage = () => {
    const sessionInfo = useContext(SessionContext)

    if (sessionInfo.loggedIn) {
        return (
            <div>Welcome {sessionInfo.user}!</div>
        )
    } else {
        return (
            <div>Welcome to Budgeteer! Login now!</div>
        )
    }
}

export default DashboardPage