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

  const result: EntityModels.EstimationSession = {
    id: data.$id,
    name: data.name,
    userId: data.userId,
    tickets,
    sessionState: {
      ...sessionState,
      currentPlayerVote: sessionState.votes.find((x) => x.userId === userId)
        ?.estimate,
      currentTicket: tickets.find((x) => x.id === sessionState.currentTicketId),
    },
  };

  return result;
};
