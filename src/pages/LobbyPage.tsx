import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import apiClient from "../lib/apiClient";

interface Player {
  id: string;
  username: string;
  isHost: boolean;
}

interface GameData {
  id: string;
  code: string;
  mode: string;
  max_players: number;
  host_id: string;
  status: string;
  players: Player[];
}

export default function LobbyPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [game, setGame] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startingGame, setStartingGame] = useState(false);

  const isHost = game?.host_id === user?.id;

  useEffect(() => {
    async function fetchGame() {
      try {
        const response = await apiClient.get(`/api/games/${code}`);

        setGame(response.data.game);
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load lobby. Please try again.";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchGame();

    const pollInterval = setInterval(() => {
      fetchGame();
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [code]);

  async function handleStartGame() {
    if (!code || startingGame) return;

    setStartingGame(true);
    try {
      await apiClient.patch(`/api/games/${code}/start`);
      navigate(`/game/${code}/play`);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to start game. Please try again.";
      setError(message);
      setStartingGame(false);
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

  const playerVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
    exit: { opacity: 0, x: 10 },
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
            Loading lobby...
          </p>
        </div>
      </div>
    );
  }

  if (error && !game) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
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
          <p className="text-red-400 text-center text-sm bg-red-400/10 border border-red-400/30 rounded-lg px-4 py-3">
            {error}
          </p>
        </motion.div>
      </div>
    );
  }

  if (!game) return null;

  const playerCount = game.players?.length || 0;
  const canStartGame = isHost && playerCount >= 2;
  const modeEmojiMap: Record<string, string> = {
    trivia: "⚡",
    bingo: "🎯",
    poll: "🗳️",
  };
  const modeEmoji = modeEmojiMap[game.mode] || "⚽";

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
        className="w-full max-w-2xl bg-surface border border-brand/40 rounded-2xl p-8 shadow-2xl"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <span className="text-5xl">⚽</span>
          <h1 className="text-3xl font-black text-white mt-4">Game Lobby</h1>
        </motion.div>

        {/* Game Code Section */}
        <motion.div
          variants={itemVariants}
          className="bg-pitch border border-brand/50 rounded-xl p-6 mb-8 text-center"
        >
          <p className="text-gray-400 text-sm mb-2">Share this code to join</p>
          <motion.p
            className="text-4xl font-black text-gold font-mono tracking-widest cursor-pointer hover:text-yellow-400 transition-colors"
            onClick={() => navigator.clipboard.writeText(game.code)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            title="Click to copy"
          >
            {game.code}
          </motion.p>
          <p className="text-xs text-gray-500 mt-2">Click to copy</p>
        </motion.div>

        {/* Game Info */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          <div className="bg-pitch border border-brand/30 rounded-lg p-4">
            <p className="text-gray-400 text-xs uppercase tracking-wide">
              Game Mode
            </p>
            <p className="text-white text-lg font-bold mt-1">
              {modeEmoji}{" "}
              {game.mode.charAt(0).toUpperCase() + game.mode.slice(1)}
            </p>
          </div>
          <div className="bg-pitch border border-brand/30 rounded-lg p-4">
            <p className="text-gray-400 text-xs uppercase tracking-wide">
              Max Players
            </p>
            <p className="text-white text-lg font-bold mt-1">
              {playerCount} / {game.max_players}
            </p>
          </div>
        </motion.div>

        {/* Players List */}
        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4">
            Players in Lobby
          </h2>
          <div className="bg-pitch border border-brand/30 rounded-lg p-4 space-y-2 max-h-64 overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {game.players && game.players.length > 0 ? (
                game.players.map((player) => (
                  <motion.div
                    key={player.id}
                    variants={playerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex items-center justify-between bg-surface border border-brand/40 rounded-lg px-4 py-3 hover:border-brand/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {player.isHost ? "👑" : "⚽"}
                      </span>
                      <div>
                        <p className="text-white font-semibold">
                          {player.username}
                        </p>
                        {player.isHost && (
                          <p className="text-xs text-gold">Host</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">
                    Waiting for players to join...
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Action Section */}
        <motion.div variants={itemVariants}>
          <AnimatePresence>
            {error && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-lg px-4 py-2 mb-4"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {isHost ? (
            <motion.button
              whileHover={{ scale: canStartGame ? 1.02 : 1 }}
              whileTap={{ scale: canStartGame ? 0.97 : 1 }}
              onClick={handleStartGame}
              disabled={!canStartGame || startingGame}
              className="w-full bg-gold text-black font-bold py-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {startingGame ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    ⚙️
                  </motion.span>
                  Starting Game…
                </span>
              ) : (
                "Start Game"
              )}
            </motion.button>
          ) : (
            <div className="bg-brand/20 border border-brand/40 rounded-lg px-4 py-3 text-center">
              <p className="text-gray-300 text-sm">
                ⏳ Waiting for host to start...
              </p>
            </div>
          )}

          {isHost && !canStartGame && (
            <p className="text-xs text-gray-500 text-center mt-3">
              Need at least 2 players to start
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
