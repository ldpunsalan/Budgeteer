import SignupForm from './component/SignupForm/SignupForm';

import './App.css';
import LoginForm from './component/LoginForm/LoginForm';

function App() {
  return (
    <div className="App">
      Budgeteer!
      <SignupForm />
      <LoginForm/>
    </div>
  );
}

export default App;
