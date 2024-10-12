import { Models } from 'appwrite';

interface EstimationSession extends Models.Document {
  userId: string;
  name: string;
  tickets: string[];
  sessionState: string;
  players: string[];
  playerIds: string[];
}

export type { EstimationSession };
