interface EstimationSession {
  id: string;
  userId: string;
  name: string;
  tickets: EstimationSessionTicket[];
  sessionState: SessionState;
  players: Player[];
  playerIds: string[];
}

interface EstimationSessionTicket {
  id: string;
  name: string;
  content: string;
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
  username: string;
  estimate: string;
}

interface Player {
  userId: string;
  name: string;
}

export type {
  EstimationSession,
  EstimationSessionTicket,
  Player,
  SessionState,
  PlayerVote,
};
