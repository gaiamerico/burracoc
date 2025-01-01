import { create } from 'zustand';
import { Game, Set, TeamScore } from '../types/game';

interface GameState {
  currentGame: Game | null;
  teams: TeamScore[];
  setCurrentGame: (game: Game) => void;
  addSets: (sets: Set[]) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentGame: null,
  teams: [],
  setCurrentGame: (game) => {
    const teams = [
      { name: game.team1, totalScore: 0, sets: [] },
      { name: game.team2, totalScore: 0, sets: [] },
    ];
    if (game.team3) {
      teams.push({ name: game.team3, totalScore: 0, sets: [] });
    }
    set({ currentGame: game, teams });
  },
  addSets: (newSets) => {
    set((state) => {
      const updatedTeams = state.teams.map((team) => {
        const teamSets = newSets.filter(set => set.team === team.name);
        if (teamSets.length > 0) {
          const updatedSets = [...team.sets, ...teamSets];
          const totalScore = updatedSets.reduce((sum, set) => sum + set.total, 0);
          return { ...team, sets: updatedSets, totalScore };
        }
        return team;
      });
      return { teams: updatedTeams };
    });
  },
  resetGame: () => set({ currentGame: null, teams: [] }),
}));