import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';

import App from './App';
import SignupForm from './component/SignupForm/SignupForm';
import LoginForm from './component/LoginForm/LoginForm';
import ProtectedPage from './pages/ProtectedPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import BucketsPage from './pages/BucketsPage/BucketsPage';
import PurchasePage from './pages/PurchasePage/PurchasePage';
import PaycheckPage from './pages/PaycheckPage/PaycheckPage';
import TransferPage from './pages/TransferPage/TransferPage';

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
        element: <ProtectedPage><BucketsPage /></ProtectedPage>
      },
      {
        path: "/purchase",
        element: <ProtectedPage><PurchasePage /></ProtectedPage>
      },
      {
        path: "/paycheck",
        element: <ProtectedPage><PaycheckPage /></ProtectedPage>
      },
      {
        path: "/transfer",
        element: <ProtectedPage><TransferPage /></ProtectedPage>
      },
    ]
  }
]);

createRoot(document.getElementById('root') as HTMLElement).render(
  // <StrictMode>
    <RouterProvider router={router} />
  // </StrictMode>,
);