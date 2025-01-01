import React, { useState } from 'react';
import { useGameStore } from './store/gameStore';
import NewGameForm from './components/NewGameForm';
import ScoreBoard from './components/ScoreBoard';
import GameHistory from './components/GameHistory';

function App() {
  const currentGame = useGameStore((state) => state.currentGame);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Burraco Score Tracker
        </h1>
        
        {!currentGame && (
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setShowHistory(false)}
              className={`px-4 py-2 rounded-md ${
                !showHistory
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-indigo-600'
              }`}
            >
              Nuova Partita
            </button>
            <button
              onClick={() => setShowHistory(true)}
              className={`px-4 py-2 rounded-md ${
                showHistory
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-indigo-600'
              }`}
            >
              Storico Partite
            </button>
          </div>
        )}
        
        {currentGame ? (
          <ScoreBoard />
        ) : showHistory ? (
          <GameHistory />
        ) : (
          <NewGameForm />
        )}
      </div>
    </div>
  );
}

export default App;