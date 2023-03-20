import { useEffect, useState } from 'react'
import { Outlet, Link } from 'react-router-dom'

import { SessionType, SessionContext } from './contexts/SessionContext';
import server from './utils/server';

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

  // Try to retrieve the user session from the server
  // when the client refreshes
  useEffect(() => {
    const getUser = async () => {
      const res = await server.get('session');
      if (res.data.user) {
        sessionInfo.login(res.data.user)
      }
    }
    getUser();
  }, [sessionInfo])

  const logoutSession = async () => {
    await server.get('logout');
    sessionInfo.logout()
  }

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
              <Link to="/buckets">Buckets</Link>
              <Link to="/purchase">Purchase</Link>
              <Link to="/paycheck">Paycheck</Link>
              <Link to="/transfer">Transfer</Link>
              <button onClick={() => logoutSession()}>Logout</button>
            </>
          }
        </nav>
        <Outlet />
      </div>
    </SessionContext.Provider>
  );
}

export default App;
