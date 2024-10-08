interface EstimationSession {
  id: string;
  userId: string;
  name: string;
  tickets: EstimationSessionTicket[];
  sessionState: SessionState;
}

interface EstimationSessionTicket {
  id: string;
  name: string;
}

interface SessionState {
  currentTicketId?: string;
  votesRevealed: boolean;
  votes: PlayerVote[];
  currentPlayerVote?: string;
  currentTicket?: EstimationSessionTicket;
}

interface PlayerVote {
  userId: string;
  estimate: string;
}

export type {
  EstimationSession,
  EstimationSessionTicket,
  SessionState,
  PlayerVote,
};
