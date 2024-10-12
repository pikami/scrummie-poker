import { DatabaseModels, EntityModels } from '../types';

export const mapDatabaseToEntity = (
  data: DatabaseModels.EstimationSession,
  { userId }: { userId?: string },
) => {
  const sessionState: EntityModels.SessionState = data.sessionState
    ? JSON.parse(data.sessionState)
    : {
        votes: [],
      };

  const tickets = data.tickets
    ? data.tickets.map<EntityModels.EstimationSessionTicket>((ticket) =>
        JSON.parse(ticket),
      )
    : [];

  const players = data.players
    ? data.players.map<EntityModels.Player>((user) => JSON.parse(user))
    : [];

  const votes = sessionState.votes.map<EntityModels.PlayerVote>((vote) => ({
    ...vote,
    username:
      players.find((x) => x.userId === vote.userId)?.name ?? vote.userId,
  }));

  const result: EntityModels.EstimationSession = {
    id: data.$id,
    name: data.name,
    userId: data.userId,
    tickets,
    players,
    playerIds: data.playerIds,
    sessionState: {
      ...sessionState,
      votes,
      currentPlayerVote: sessionState.votes.find((x) => x.userId === userId)
        ?.estimate,
      currentTicket: tickets.find((x) => x.id === sessionState.currentTicketId),
    },
  };

  return result;
};

export const mapEntityToDatabase = (
  data: Partial<EntityModels.EstimationSession>,
) => {
  const result: Partial<DatabaseModels.EstimationSession> = {
    $id: data.id,
    name: data.name,
    userId: data.userId,
    tickets: data.tickets?.map((ticket) => JSON.stringify(ticket)),
    playerIds: data.playerIds,
    players: data.players?.map((player) => JSON.stringify(player)),
    sessionState: JSON.stringify(data.sessionState),
  };

  return result;
};
