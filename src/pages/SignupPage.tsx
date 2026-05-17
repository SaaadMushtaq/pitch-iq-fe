import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../utils/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center bg-surface border border-brand/40 rounded-2xl p-10 max-w-sm w-full"
        >
          <span className="text-5xl">📧</span>
          <h2 className="text-2xl font-black text-white mt-4">
            Check your inbox
          </h2>
          <p className="text-gray-400 mt-2 text-sm">
            Confirm your email to join the pitch.
          </p>
        </motion.div>
      </div>
    );
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
          <span className="text-5xl">🏙️</span>
          <h1 className="text-3xl font-black text-white mt-3">Join PitchIQ</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Create your account and enter the arena
          </p>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1.5">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              placeholder="your_tag"
              className="w-full bg-pitch border border-brand/50 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold transition-colors placeholder-gray-600"
            />
          </div>
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
              autoComplete="new-password"
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
            {loading ? "Signing up…" : "Sign Up"}
          </motion.button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-gold hover:underline font-semibold">
            Log in
          </a>
        </p>
      </motion.div>
    </div>
  );
}
