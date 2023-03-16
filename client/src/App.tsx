import { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'

import { SessionType, SessionContext } from './contexts/SessionContext';

import styles from "./App.module.css"

export const defaultSessionInfo : SessionType = {
  loggedIn: false,
  user: "",
  login: (e) => {},
  logout: () => {},
} 

function App() {
  const [sessionInfo, setSessionInfo] = useState<SessionType>({
    ...defaultSessionInfo,
    login: (e) => {
      setSessionInfo(prev => {
        return {
          ...prev,
          loggedIn: true,
          user: e,
      }})
    },
    logout: () => {
      setSessionInfo(prev => {
        return {
          ...prev,
          loggedIn: false,
          user: ""
        }
      })
    }
  })

  return (
    <SessionContext.Provider value={sessionInfo}>
      <div className={styles['app-container']}>
        <nav className={styles['nav']}>
          <Link to="/">
            <h1>Budgeteer</h1>
          </Link>
          {
            !sessionInfo.loggedIn ? 
            <>
              <Link to="/signup">Sign-Up</Link>
              <Link to="/login">Log-In</Link>
            </> :
            <>
              <button onClick={() => sessionInfo.logout()}>Logout</button>
            </>
          }
        </nav>
        <Outlet />
      </div>
    </SessionContext.Provider>
  );
}

export default App;
