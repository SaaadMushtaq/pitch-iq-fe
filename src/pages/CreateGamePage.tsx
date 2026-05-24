import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../lib/apiClient";

type GameMode = "trivia" | "bingo" | "poll";

export default function CreateGamePage() {
  const navigate = useNavigate();
  const [gameMode, setGameMode] = useState<GameMode>("trivia");
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreateGame(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post("/api/games", {
        mode: gameMode,
        max_players: maxPlayers,
      });

      const { code } = response.data;
      navigate(`/game/lobby/${code}`);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to create game. Please try again.";
      setError(message);
      setLoading(false);
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
          },
        }}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md bg-surface border border-brand/40 rounded-2xl p-8 shadow-2xl"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <span className="text-5xl">⚽</span>
          <h1 className="text-3xl font-black text-white mt-4">Create Game</h1>
          <p className="text-gray-400 mt-1 text-sm">Set up your next match</p>
        </motion.div>

        <form onSubmit={handleCreateGame} className="flex flex-col gap-5">
          {/* Game Mode Dropdown */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold text-gray-300 mb-1.5">
              Game Mode
            </label>
            <select
              value={gameMode}
              onChange={(e) => setGameMode(e.target.value as GameMode)}
              className="w-full bg-pitch border border-brand/50 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold transition-colors cursor-pointer"
            >
              <option value="trivia">⚡ Trivia</option>
              <option value="bingo">🎯 Bingo</option>
              <option value="poll">🗳️ Poll</option>
            </select>
          </motion.div>

          {/* Max Players Input */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold text-gray-300 mb-1.5">
              Max Players
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMaxPlayers(Math.max(2, maxPlayers - 1))}
                disabled={maxPlayers <= 2 || loading}
                className="bg-brand/30 hover:bg-brand/50 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg px-3 py-2.5 transition-colors"
              >
                −
              </button>
              <input
                type="number"
                value={maxPlayers}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) {
                    setMaxPlayers(Math.min(10, Math.max(2, val)));
                  }
                }}
                min="2"
                max="10"
                className="flex-1 bg-pitch border border-brand/50 text-white text-center rounded-lg px-4 py-2.5 focus:outline-none focus:border-gold transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                type="button"
                onClick={() => setMaxPlayers(Math.min(10, maxPlayers + 1))}
                disabled={maxPlayers >= 10 || loading}
                className="bg-brand/30 hover:bg-brand/50 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg px-3 py-2.5 transition-colors"
              >
                +
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {maxPlayers} player{maxPlayers !== 1 ? "s" : ""} max
            </p>
          </motion.div>

          {/* Error Message */}
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

          {/* Create Button */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.97 }}
            type="submit"
            disabled={loading}
            className="bg-gold text-black font-bold py-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-1 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  ⚙️
                </motion.span>
                Creating Game…
              </span>
            ) : (
              "Create Game"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
