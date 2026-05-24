import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import apiClient from "../lib/apiClient";
import axios from "axios";

export default function JoinGamePage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function joinGame() {
      try {
        if (!code) {
          setError("Invalid game code.");
          setLoading(false);
          return;
        }

        await apiClient.post(`/api/games/${code}/join`);
        navigate(`/game/lobby/${code}`);
      } catch (err) {
        let errorMessage = "Something went wrong. Please try again.";

        if (axios.isAxiosError(err)) {
          const status = err.response?.status;
          if (status === 404) {
            errorMessage = "Game not found. Check your code and try again.";
          } else if (status === 400) {
            errorMessage = "Game is full or already started.";
          }
        }

        setError(errorMessage);
        setLoading(false);
      }
    }

    joinGame();
  }, [code, navigate]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="text-5xl inline-block"
          >
            ⚽
          </motion.span>
          <p className="text-gray-400 animate-pulse text-sm tracking-widest uppercase mt-4">
            Joining game...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md bg-surface border border-brand/40 rounded-2xl p-8 shadow-2xl"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <span className="text-5xl">⚽</span>
          <h1 className="text-3xl font-black text-white mt-4">Join Game</h1>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-pitch border border-brand/30 rounded-lg p-6 mb-8 text-center"
        >
          <p className="text-gray-400 text-sm mb-2">Game Code</p>
          <p className="text-3xl font-black text-gold font-mono tracking-widest">
            {code?.toUpperCase()}
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-lg px-4 py-3 mb-6"
        >
          <p className="font-semibold mb-1">Unable to Join Game</p>
          <p>{error}</p>
        </motion.div>

        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/")}
          className="w-full bg-gold text-black font-bold py-3 rounded-lg hover:brightness-110 transition-all cursor-pointer"
        >
          Go Back
        </motion.button>
      </motion.div>
    </div>
  );
}
