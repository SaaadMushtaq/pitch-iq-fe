import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";

export default function ProtectedRoute({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 animate-pulse text-sm tracking-widest uppercase">
          Loading...
        </p>
      </div>
    );

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>{children ?? <Outlet />}</main>
    </div>
  );
}
