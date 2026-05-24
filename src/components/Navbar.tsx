import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../utils/supabase";

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <nav className="bg-black/60 backdrop-blur-sm border-b border-brand/40 sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="text-gold font-black text-xl tracking-wide select-none"
        >
          ⚽ PitchIQ
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm hidden sm:block truncate max-w-50">
            {user?.email}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="text-sm border border-gold/60 text-gold px-4 py-1.5 rounded-full hover:bg-gold hover:text-black font-semibold transition-colors cursor-pointer"
          >
            Log Out
          </motion.button>
        </div>
      </div>
    </nav>
  );
}
