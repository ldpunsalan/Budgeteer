import React from 'react';
import ReactDOM from 'react-dom/client';
import { 
  createBrowserRouter,
  RouterProvider 
} from 'react-router-dom';

import './index.css';
import reportWebVitals from './reportWebVitals';

import App from './App';
import SignupForm from './component/SignupForm/SignupForm';
import LoginForm from './component/LoginForm/LoginForm';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import BucketsPage from './pages/DashboardPage/BucketsPage';
import PurchasePage from './pages/DashboardPage/PurchasePage';
import PaycheckPage from './pages/DashboardPage/PaycheckPage';
import TransferPage from './pages/DashboardPage/TransferPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <DashboardPage />
      },
      {
        path: "/signup",
        element: <SignupForm />
      },
      {
        path: "/login",
        element: <LoginForm />
      },
      {
        path: "/buckets",
        element: <BucketsPage />
      },
      {
        path: "/purchase",
        element: <PurchasePage />
      },
      {
        path: "/paycheck",
        element: <PaycheckPage />
      },
      {
        path: "/transfer",
        element: <TransferPage />
      },
    ]
  }
])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
