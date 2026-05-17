import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const container = {
  animate: { transition: { staggerChildren: 0.12 } },
};

const card = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gameCode, setGameCode] = useState("");

  const username = user?.user_metadata?.username ?? user?.email;

  function handleJoinGame(e: React.FormEvent) {
    e.preventDefault();
    const code = gameCode.trim();
    if (code) navigate(`/game/join/${code}`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto px-4 py-12"
    >
      {/* Welcome banner */}
      <div className="mb-10">
        <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-1">
          Your Dashboard
        </p>
        <h1 className="text-4xl font-black text-white">
          Welcome, <span className="text-gold">{username}</span>!
        </h1>
        <p className="text-gray-400 mt-2 text-sm">Ready to hit the pitch?</p>
      </div>

      {/* Action cards */}
      <motion.div
        variants={container}
        initial="initial"
        animate="animate"
        className="flex flex-col gap-4"
      >
        {/* Create Game */}
        <motion.div
          variants={card}
          className="bg-surface border border-brand/40 rounded-2xl p-6"
        >
          <div className="flex items-center gap-4 mb-5">
            <span className="text-4xl">⚽</span>
            <div>
              <h2 className="text-xl font-bold text-white">Create Game</h2>
              <p className="text-gray-400 text-sm">
                Host a new match and invite players
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/game/create")}
            className="w-full bg-brand hover:bg-green-600 text-white font-bold py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            Create Game
          </motion.button>
        </motion.div>

        {/* Join Game */}
        <motion.div
          variants={card}
          className="bg-surface border border-brand/40 rounded-2xl p-6"
        >
          <div className="flex items-center gap-4 mb-5">
            <span className="text-4xl">🎯</span>
            <div>
              <h2 className="text-xl font-bold text-white">Join Game</h2>
              <p className="text-gray-400 text-sm">
                Enter a code to join an existing match
              </p>
            </div>
          </div>
          <form onSubmit={handleJoinGame} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter game code"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value)}
              className="flex-1 bg-pitch border border-brand/50 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold transition-colors placeholder-gray-600 text-sm"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!gameCode.trim()}
              className="bg-gold text-black font-bold px-5 py-2.5 rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer"
            >
              Join
            </motion.button>
          </form>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          variants={card}
          className="bg-surface border border-brand/40 rounded-2xl p-6"
        >
          <div className="flex items-center gap-4 mb-5">
            <span className="text-4xl">🏆</span>
            <div>
              <h2 className="text-xl font-bold text-white">Leaderboard</h2>
              <p className="text-gray-400 text-sm">
                See the top players on the pitch
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/leaderboard")}
            className="w-full border border-gold/60 text-gold hover:bg-gold hover:text-black font-bold py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            View Leaderboard
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
