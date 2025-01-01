import React from 'react';
import { useForm } from 'react-hook-form';
import { Users } from 'lucide-react';
import { Game } from '../types/game';
import { createGame } from '../services/airtable';
import { useGameStore } from '../store/gameStore';
import { getCurrentDateTime } from '../utils/dateUtils';

interface NewGameFormData {
  nickname: string;
  numTeams: '2' | '3';
  team1: string;
  team2: string;
  team3?: string;
  finalPointGame: number;
}

export default function NewGameForm() {
  const { register, handleSubmit, watch } = useForm<NewGameFormData>({
    defaultValues: {
      numTeams: '2',
      finalPointGame: 2005,
    },
  });
  const setCurrentGame = useGameStore((state) => state.setCurrentGame);
  const numTeams = watch('numTeams');

  const onSubmit = async (data: NewGameFormData) => {
    const game: Game = {
      idGame: crypto.randomUUID(),
      dateTime: getCurrentDateTime(),
      nickname: data.nickname,
      finalPointGame: data.finalPointGame,
      team1: data.team1,
      team2: data.team2,
      team3: data.numTeams === '3' ? data.team3 : undefined,
      gameStatus: 0,
    };

    await createGame(game);
    setCurrentGame(game);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">Nuova Partita</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nickname
          </label>
          <input
            type="text"
            {...register('nickname', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Numero di Squadre
          </label>
          <select
            {...register('numTeams')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="2">2 Squadre</option>
            <option value="3">3 Squadre</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Squadra 1
          </label>
          <input
            type="text"
            {...register('team1', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Squadra 2
          </label>
          <input
            type="text"
            {...register('team2', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {numTeams === '3' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Squadra 3
            </label>
            <input
              type="text"
              {...register('team3')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Punteggio Finale
          </label>
          <input
            type="number"
            {...register('finalPointGame', { required: true, min: 1 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Inizia Partita
        </button>
      </form>
    </div>
  );
}