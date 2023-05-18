import { createContext } from 'react'

export interface SessionType {
    loading: Boolean,
    loggedIn: Boolean,
    user: string
}

export interface SessionVerbType {
    login: (e: string) => void,
    logout: () => void
}

export const SessionContext = createContext<SessionType>({
    loading: true,
    loggedIn: false,
    user: ""
})

export const SessionVerbs = createContext<SessionVerbType>({
    login: (e) => {},
    logout: () => {}
})