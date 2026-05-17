import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../utils/supabase";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    navigate("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md bg-surface border border-brand/40 rounded-2xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <span className="text-5xl">⚽</span>
          <h1 className="text-3xl font-black text-white mt-3">Welcome Back</h1>
          <p className="text-gray-400 mt-1 text-sm">Step back onto the pitch</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full bg-pitch border border-brand/50 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold transition-colors placeholder-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full bg-pitch border border-brand/50 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold transition-colors placeholder-gray-600"
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-lg px-4 py-2"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="bg-gold text-black font-bold py-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-1 cursor-pointer"
          >
            {loading ? "Logging in…" : "Log In"}
          </motion.button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Don't have an account?{" "}
          <a href="/signup" className="text-gold hover:underline font-semibold">
            Sign up
          </a>
        </p>
      </motion.div>
    </div>
  );
}
