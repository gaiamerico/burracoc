import React from 'react';
import { TeamScore } from '../types/game';

interface ScoreFormProps {
  teams: TeamScore[];
  onSubmit: (scores: Array<{ team: string; base: number; points: number }>) => void;
}

export default function ScoreForm({ teams, onSubmit }: ScoreFormProps) {
  const [scores, setScores] = React.useState<Array<{ team: string; base: string; points: string }>>(
    teams.map(team => ({ team: team.name, base: '', points: '' }))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all teams have scores
    if (scores.some(score => !score.base || !score.points)) {
      alert('Inserisci i punteggi per tutte le squadre');
      return;
    }

    onSubmit(
      scores.map(score => ({
        team: score.team,
        base: parseInt(score.base),
        points: parseInt(score.points)
      }))
    );

    // Reset form
    setScores(teams.map(team => ({ team: team.name, base: '', points: '' })));
  };

  const updateScore = (index: number, field: 'base' | 'points', value: string) => {
    const newScores = [...scores];
    newScores[index] = { ...newScores[index], [field]: value };
    setScores(newScores);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {scores.map((score, index) => (
          <div key={score.team} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-lg mb-4">{score.team}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Punti Base
                </label>
                <input
                  type="number"
                  value={score.base}
                  onChange={(e) => updateScore(index, 'base', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Punti Extra
                </label>
                <input
                  type="number"
                  value={score.points}
                  onChange={(e) => updateScore(index, 'points', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Aggiungi Punteggi
      </button>
    </form>
  );
}