import { Outlet, Link } from 'react-router-dom'

import styles from "./App.module.css"

function App() {
  return (
    <div className={styles['app-container']}>
      <nav className={styles['nav']}>
        <Link to="/">
          <h1>Budgeteer</h1>
        </Link>
        <Link to="/signup">Sign-Up</Link>
        <Link to="/login">Log-In</Link>
      </nav>
      <Outlet />
    </div>
  );
}

export default App;
