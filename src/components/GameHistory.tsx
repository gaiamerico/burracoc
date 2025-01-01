import React, { useState, useEffect } from 'react';
import { History, ChevronDown, ChevronUp, Play, Trash2 } from 'lucide-react';
import { getGamesByNickname, getSetsByGameId, deleteGame } from '../services/airtable';
import { Game, Set } from '../types/game';
import { useGameStore } from '../store/gameStore';

export default function GameHistory() {
  const [nickname, setNickname] = useState('');
  const [games, setGames] = useState<Game[]>([]);
  const [expandedGame, setExpandedGame] = useState<string | null>(null);
  const [gameSets, setGameSets] = useState<{ [key: string]: Set[] }>({});
  const [loading, setLoading] = useState(false);
  const setCurrentGame = useGameStore((state) => state.setCurrentGame);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname) return;

    setLoading(true);
    try {
      const gamesData = await getGamesByNickname(nickname);
      setGames(gamesData as Game[]);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
    setLoading(false);
  };

  const toggleGameExpansion = async (gameId: string) => {
    if (expandedGame === gameId) {
      setExpandedGame(null);
      return;
    }

    setExpandedGame(gameId);
    if (!gameSets[gameId]) {
      try {
        const sets = await getSetsByGameId(gameId);
        setGameSets((prev) => ({ ...prev, [gameId]: sets as Set[] }));
      } catch (error) {
        console.error('Error fetching sets:', error);
      }
    }
  };

  const handleResumeGame = (game: Game) => {
    setCurrentGame(game);
  };

  const handleDeleteGame = async (gameId: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questa partita?')) {
      try {
        await deleteGame(gameId);
        setGames(games.filter(g => g.idGame !== gameId));
      } catch (error) {
        console.error('Error deleting game:', error);
      }
    }
  };

  const calculateTeamTotals = (gameId: string) => {
    const sets = gameSets[gameId] || [];
    const totals: { [key: string]: number } = {};
    
    sets.forEach((set) => {
      totals[set.team] = (totals[set.team] || 0) + set.total;
    });
    
    return totals;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-2 mb-6">
          <History className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-800">Storico Partite</h2>
        </div>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Inserisci il nickname"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={loading}
            >
              {loading ? 'Ricerca...' : 'Cerca'}
            </button>
          </div>
        </form>

        {games.length > 0 ? (
          <div className="space-y-4">
            {games.map((game) => (
              <div
                key={game.idGame}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="bg-gray-50 p-4 flex items-center justify-between">
                  <div className="flex-1 cursor-pointer" onClick={() => toggleGameExpansion(game.idGame)}>
                    <p className="font-semibold">
                      {game.dateTime}
                    </p>
                    <p className="text-sm text-gray-600">
                      Squadre: {game.team1}, {game.team2}
                      {game.team3 && `, ${game.team3}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {game.gameStatus === 0 && (
                      <button
                        onClick={() => handleResumeGame(game)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                        title="Riprendi partita"
                      >
                        <Play className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteGame(game.idGame)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      title="Elimina partita"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    {expandedGame === game.idGame ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </div>

                {expandedGame === game.idGame && (
                  <div className="p-4">
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Punteggi Finali:</h4>
                      {Object.entries(calculateTeamTotals(game.idGame)).map(
                        ([team, total]) => (
                          <p key={team}>
                            {team}: <span className="font-bold">{total}</span>
                          </p>
                        )
                      )}
                    </div>

                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left">Set</th>
                          <th className="px-4 py-2 text-left">Squadra</th>
                          <th className="px-4 py-2 text-right">Base</th>
                          <th className="px-4 py-2 text-right">Punti</th>
                          <th className="px-4 py-2 text-right">Totale</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {(gameSets[game.idGame] || []).map((set, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2">{set.set}</td>
                            <td className="px-4 py-2">{set.team}</td>
                            <td className="px-4 py-2 text-right">{set.base}</td>
                            <td className="px-4 py-2 text-right">{set.points}</td>
                            <td className="px-4 py-2 text-right">{set.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          nickname && !loading && (
            <p className="text-center text-gray-600">
              Nessuna partita trovata per questo nickname.
            </p>
          )
        )}
      </div>
    </div>
  );
}
