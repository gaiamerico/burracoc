export interface Game {
  idGame: string;
  dateTime: string;
  nickname: string;
  finalPointGame: number;
  team1: string;
  team2: string;
  team3?: string;
  gameStatus: number;
}

export interface Set {
  team: string;
  idGame: string;
  set: number;
  base: number;
  points: number;
  total: number;
}

export interface TeamScore {
  name: string;
  totalScore: number;
  sets: Set[];
}