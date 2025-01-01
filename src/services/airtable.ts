import Airtable from 'airtable';
import { Game, Set } from '../types/game';
import { formatToISOString, formatFromISOString } from '../utils/dateUtils';

const base = new Airtable({ apiKey: import.meta.env.VITE_AIRTABLE_API_KEY }).base(
  import.meta.env.VITE_AIRTABLE_BASE_ID
);

export const createGame = async (game: Game) => {
  const record = await base('Game').create({
    idGame: game.idGame,
    DateTime: formatToISOString(game.dateTime),
    Nickname: game.nickname,
    FinalPointGame: Number(game.finalPointGame), // Ensure it's a number
    Team1: game.team1,
    Team2: game.team2,
    Team3: game.team3 || '',
    GameStatus: 0,
  });
  return record;
};

// Rest of the file remains the same
export const createSet = async (set: Set) => {
  const record = await base('Sets').create({
    Team: set.team,
    idGame: set.idGame,
    Set: set.set,
    Base: set.base,
    Points: set.points,
    Total: set.total,
  });
  return record;
};

export const getGamesByNickname = async (nickname: string) => {
  const records = await base('Game')
    .select({
      filterByFormula: `{Nickname} = '${nickname}'`,
      sort: [{ field: 'DateTime', direction: 'desc' }],
    })
    .all();
  return records.map((record) => ({
    idGame: record.get('idGame'),
    dateTime: formatFromISOString(record.get('DateTime') as string),
    nickname: record.get('Nickname'),
    finalPointGame: Number(record.get('FinalPointGame')),
    team1: record.get('Team1'),
    team2: record.get('Team2'),
    team3: record.get('Team3'),
    gameStatus: record.get('GameStatus'),
  }));
};

export const getSetsByGameId = async (gameId: string) => {
  const records = await base('Sets')
    .select({
      filterByFormula: `{idGame} = '${gameId}'`,
      sort: [{ field: 'Set', direction: 'asc' }],
    })
    .all();
  return records.map((record) => ({
    team: record.get('Team'),
    idGame: record.get('idGame'),
    set: record.get('Set'),
    base: record.get('Base'),
    points: record.get('Points'),
    total: record.get('Total'),
  }));
};

export const updateGameStatus = async (gameId: string, status: number) => {
  const records = await base('Game')
    .select({
      filterByFormula: `{idGame} = '${gameId}'`,
    })
    .all();

  if (records.length > 0) {
    await base('Game').update(records[0].id, {
      GameStatus: status,
    });
  }
};

export const deleteGame = async (gameId: string) => {
  // First delete all sets for this game
  const setRecords = await base('Sets')
    .select({
      filterByFormula: `{idGame} = '${gameId}'`,
    })
    .all();

  for (const record of setRecords) {
    await base('Sets').destroy(record.id);
  }

  // Then delete the game
  const gameRecords = await base('Game')
    .select({
      filterByFormula: `{idGame} = '${gameId}'`,
    })
    .all();

  if (gameRecords.length > 0) {
    await base('Game').destroy(gameRecords[0].id);
  }
};
