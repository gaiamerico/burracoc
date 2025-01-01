import React from 'react';
import { Trophy } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { createSet, updateGameStatus } from '../services/airtable';
import ScoreForm from './ScoreForm';

export default function ScoreBoard() {
  const { currentGame, teams, addSets, resetGame } = useGameStore();

  if (!currentGame) return null;

  const handleSubmit = async (scores: Array<{ team: string; base: number; points: number }>) => {
    const newSets = scores.map(score => ({
      team: score.team,
      idGame: currentGame.idGame,
      set: teams.find((t) => t.name === score.team)?.sets.length || 0 + 1,
      base: score.base,
      points: score.points,
      total: score.base + score.points,
    }));

    // Create all sets in Airtable
    await Promise.all(newSets.map(set => createSet(set)));
    
    // Update local state with all sets at once
    addSets(newSets);
  };

  const winner = teams.find((team) => {
    const hasHighestScore = !teams.some(
      otherTeam => otherTeam.name !== team.name && otherTeam.totalScore > team.totalScore
    );
    return team.totalScore >= currentGame.finalPointGame && hasHighestScore;
  });

  if (winner && currentGame.gameStatus === 0) {
    updateGameStatus(currentGame.idGame, 1);
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Punteggio Attuale
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {teams.map((team) => (
            <div
              key={team.name}
              className="bg-gray-50 p-4 rounded-lg border border-gray-200"
            >
              <h3 className="font-semibold text-lg mb-2">{team.name}</h3>
              <p className="text-3xl font-bold text-indigo-600">
                {team.totalScore}
              </p>
            </div>
          ))}
        </div>
      </div>

      {winner ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <Trophy className="w-12 h-12 text-green-600 mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-green-800">
            {winner.name} ha vinto la partita!
          </h2>
          <p className="text-green-600">
            Punteggio finale: {winner.totalScore} punti
          </p>
          <button
            onClick={resetGame}
            className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Torna alla Home
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Aggiungi Punteggi</h3>
          <ScoreForm teams={teams} onSubmit={handleSubmit} />
        </div>
      )}
    </div>
  );
}