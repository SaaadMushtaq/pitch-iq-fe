import { createBrowserRouter } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CreateGamePage from "./pages/CreateGamePage";
import LobbyPage from "./pages/LobbyPage";
import JoinGamePage from "./pages/JoinGamePage";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    Component: ProtectedRoute,
    children: [
      { path: "/", Component: DashboardPage },
      { path: "/game/create", Component: CreateGamePage },
      { path: "/game/lobby/:code", Component: LobbyPage },
      { path: "/game/join/:code", Component: JoinGamePage },
    ],
  },
  { path: "/login", Component: LoginPage },
  { path: "/signup", Component: SignupPage },
]);
