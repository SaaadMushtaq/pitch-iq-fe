import { createBrowserRouter } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    Component: ProtectedRoute,
    children: [{ path: "/", Component: DashboardPage }],
  },
  { path: "/login", Component: LoginPage },
  { path: "/signup", Component: SignupPage },
]);
