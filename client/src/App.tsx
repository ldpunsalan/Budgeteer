import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import { SessionType, SessionContext, SessionVerbType, SessionVerbs } from './contexts/SessionContext';

import styles from "./App.module.css";

import "./fonts/CreatoDisplay-Black.otf";
import "./fonts/CreatoDisplay-BlackItalic.otf";
import "./fonts/CreatoDisplay-Bold.otf";
import "./fonts/CreatoDisplay-BoldItalic.otf";
import "./fonts/CreatoDisplay-ExtraBold.otf";
import "./fonts/CreatoDisplay-ExtraBoldItalic.otf";
import "./fonts/CreatoDisplay-Light.otf";
import "./fonts/CreatoDisplay-LightItalic.otf";
import "./fonts/CreatoDisplay-Medium.otf";
import "./fonts/CreatoDisplay-MediumItalic.otf";
import "./fonts/CreatoDisplay-Regular.otf";
import "./fonts/CreatoDisplay-RegularItalic.otf";
import "./fonts/CreatoDisplay-Thin.otf";
import "./fonts/CreatoDisplay-ThinItalic.otf";

export const defaultSessionInfo : SessionType = {
  loading: true,
  loggedIn: false,
  user: "",
} 

export const defaultSessionVerb : SessionVerbType = {
  login: (e) => {},
  logout: () => {},
}

function App() {
  const [sessionInfo, setSessionInfo] = useState<SessionType>(defaultSessionInfo)
  const [sessionVerb, setSessionVerb] = useState<SessionVerbType>({
    login: (e) => {
      // save on localStorage
      localStorage.setItem('user', e.toString())
      setSessionInfo(prev => {
        return {
          ...prev,
          loggedIn: true,
          user: e,
      }})
      console.log("logged in", e)
    },
    logout: () => {
      // remove from localStorage
      localStorage.removeItem('user')
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
    const getUserFirebase = () => {
      const user = localStorage.getItem('user')
      if (user) {
        sessionVerb.login(user)
      }
      setSessionInfo(prev => ({
        ...prev,
        loading: false
      }))
    }
    getUserFirebase();
  }, [])

  return (
    <SessionVerbs.Provider value={sessionVerb}>
      <SessionContext.Provider value={sessionInfo}>
        <div className={styles['app-container']}>
          <Outlet />
        </div>
      </SessionContext.Provider>
    </SessionVerbs.Provider>
  );
}

export default App;
