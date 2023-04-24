import { useEffect, useState } from 'react'
import { Outlet, Link } from 'react-router-dom'

import { SessionType, SessionContext, SessionVerbType, SessionVerbs } from './contexts/SessionContext';
import server from './utils/server';

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
      setSessionInfo(prev => {
        return {
          ...prev,
          loggedIn: true,
          user: e,
      }})
      console.log("logged in", e)
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
        sessionVerb.login(res.data.user)
      }
      setSessionInfo(prev => ({
        ...prev,
        loading: false
      }))
    }
    getUser();
  }, [])

  const logoutSession = async () => {
    await server.get('logout');
    sessionVerb.logout()
  }

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
