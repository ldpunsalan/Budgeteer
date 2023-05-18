import { createContext } from 'react'

export interface SessionType {
    loading: Boolean,
    loggedIn: Boolean,
    user: string,
    email: string
}

export interface SessionVerbType {
    login: (id: string, email: string) => void,
    logout: () => void
}

export const SessionContext = createContext<SessionType>({
    loading: true,
    loggedIn: false,
    user: "",
    email: ""
})

export const SessionVerbs = createContext<SessionVerbType>({
    login: (id, email) => {},
    logout: () => {}
})