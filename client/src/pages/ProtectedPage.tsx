import React, { useContext } from 'react'
import { Navigate, } from 'react-router-dom'

import { SessionContext } from '../contexts/SessionContext'

type Props = {
    children: React.ReactNode;
}

const ProtectedPage = ({ children }: Props) => {
    const sessionInfo = useContext(SessionContext)

    if (sessionInfo.loggedIn) {
        return <>{children}</>
    } else {
        return <Navigate to="/login" replace={true} />
    }
}

export default ProtectedPage;