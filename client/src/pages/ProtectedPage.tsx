import React, { useContext } from 'react'
import { Navigate,Link} from 'react-router-dom'

import { SessionContext } from '../contexts/SessionContext'
import NavBar from '../component/NavBar/NavBar'

type Props = {
    children: React.ReactNode;
}

/**
 * A component for rendering the page functionalities if there's a database connection.
 * @function ProtectedPage
*/
const ProtectedPage = ({ children }: Props) => {
    const sessionInfo = useContext(SessionContext)

    if (sessionInfo.loading) {
        console.log("loading")
        return <div>loading...</div>
    } else if (sessionInfo.loggedIn) {
        return <div>
            <NavBar></NavBar>
            <div>{children}</div>
        </div>
    } else {
        console.log("cant", sessionInfo)
        return <Navigate to="/login" replace={true} />
    }
}

export default ProtectedPage;