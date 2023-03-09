import { Outlet, Link } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <nav>
        Budgeteer!
        <Link to="/signup">Sign-Up</Link>
        <Link to="/login">Log-In</Link>
      </nav>
      <Outlet />
    </div>
  );
}

export default App;
