import { createContext } from 'react'

export interface SessionType {
    loggedIn: Boolean,
    user: String,
    login: (e: String) => void,
    logout: () => void
}

export const SessionContext = createContext<SessionType>({
    loggedIn: false,
    user: "",
    login: (e) => {},
    logout: () => {}
})