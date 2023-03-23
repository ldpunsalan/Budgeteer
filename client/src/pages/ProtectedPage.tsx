import React, { useContext } from 'react'
import { Navigate,Link} from 'react-router-dom'

import { SessionContext } from '../contexts/SessionContext'
import NavBar from '../component/NavBar/NavBar'

type Props = {
    children: React.ReactNode;
}

const ProtectedPage = ({ children }: Props) => {
    const sessionInfo = useContext(SessionContext)

    if (sessionInfo.loggedIn) {
        return <div>
            <NavBar></NavBar>
            <div>{children}</div>
        </div>
    } else {
        return <Navigate to="/login" replace={true} />
    }
}

export default ProtectedPage;