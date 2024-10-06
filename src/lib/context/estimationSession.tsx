import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { client, databases } from '../appwrite';
import { ID, Models, Query } from 'appwrite';
import {
  APPWRITE_DATABASE_ID,
  APPWRITE_ESTIMATION_SESSION_COLLECTION_ID,
} from '../../constants';

interface EstimationSessionType extends Models.Document {
  UserId: string;
  Name: string;
  Tickets: string[];
  SessionState: string;
}

interface EstimationSessionTicket {
  Id: string;
  Name: string;
}

interface SessionStateType {
  CurrentTicketId: string;
  VotesRevealed: boolean;
  Votes: {
    UserId: string;
    Estimate: number;
  }[];
}

interface EstimationSessionsContextType {
  current: EstimationSessionType[];
  add: (
    estimationSession: Omit<EstimationSessionType, keyof Models.Document>,
  ) => Promise<void>;
  remove: (id: string) => Promise<void>;
  addTicket: (
    sessionId: string,
    ticket: Omit<EstimationSessionTicket, 'Id'>,
  ) => Promise<void>;
  getTickets: (sessionId: string) => EstimationSessionTicket[];
  selectTicket: (sessionId: string, ticketId: string) => Promise<void>;
  getState: (sessionId: string) => SessionStateType;
  voteEstimate: (
    sessionId: string,
    ticketId: string,
    estimate: number,
    userId: string,
  ) => Promise<void>;
  revealVotes: (sessionId: string) => Promise<void>;
}

const EstimationSessionsContext = createContext<
  EstimationSessionsContextType | undefined
>(undefined);

export function useEstimationSessions() {
  return useContext(EstimationSessionsContext);
}

export function EstimationSessionProvider(props: PropsWithChildren) {
  const [estimationSessions, setEstimationSessions] = useState<
    EstimationSessionType[]
  >([]);

  const add = async (
    estimationSession: Omit<EstimationSessionType, keyof Models.Document>,
  ) => {
    const response = await databases.createDocument<EstimationSessionType>(
      APPWRITE_DATABASE_ID,
      APPWRITE_ESTIMATION_SESSION_COLLECTION_ID,
      ID.unique(),
      estimationSession,
    );
    setEstimationSessions((estimationSessions) =>
      [response, ...estimationSessions].slice(0, 10),
    );
  };

  const remove = async (id: string) => {
    await databases.deleteDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_ESTIMATION_SESSION_COLLECTION_ID,
      id,
    );
    setEstimationSessions((estimationSessions) =>
      estimationSessions.filter(
        (estimationSession) => estimationSession.$id !== id,
      ),
    );
    await init();
  };

  const addTicket = async (
    sessionId: string,
    ticket: Omit<EstimationSessionTicket, 'Id'>,
  ) => {
    const currentSession = estimationSessions.find((x) => x.$id === sessionId);
    const response = await databases.updateDocument<EstimationSessionType>(
      APPWRITE_DATABASE_ID,
      APPWRITE_ESTIMATION_SESSION_COLLECTION_ID,
      sessionId,
      {
        Tickets: currentSession?.Tickets.concat([
          JSON.stringify({
            ...ticket,
            Id: crypto.randomUUID(),
          }),
        ]),
      },
    );
    setEstimationSessions((estimationSessions) =>
      estimationSessions
        .filter((x) => x.$id != sessionId)
        .concat([response])
        .slice(0, 10),
    );
  };

  const getTickets = (sessionId: string) => {
    return (
      estimationSessions
        .find((x) => x.$id === sessionId)
        ?.Tickets.map<EstimationSessionTicket>((x) => JSON.parse(x)) ?? []
    );
  };

  const selectTicket = async (sessionId: string, ticketId: string) => {
    const response = await databases.updateDocument<EstimationSessionType>(
      APPWRITE_DATABASE_ID,
      APPWRITE_ESTIMATION_SESSION_COLLECTION_ID,
      sessionId,
      {
        SessionState: JSON.stringify({
          CurrentTicketId: ticketId,
        }),
      },
    );
    setEstimationSessions((estimationSessions) =>
      estimationSessions
        .filter((x) => x.$id != sessionId)
        .concat([response])
        .slice(0, 10),
    );
  };

  const getState = (sessionId: string): SessionStateType => {
    return JSON.parse(
      estimationSessions.find((x) => x.$id === sessionId)?.SessionState ?? '{}',
    );
  };

  const voteEstimate = async (
    sessionId: string,
    ticketId: string,
    estimate: number,
    userId: string,
  ) => {
    const currentState = getState(sessionId);
    const newVotes = (currentState.Votes ?? [])
      .filter((x) => x.UserId !== userId)
      .concat([
        {
          Estimate: estimate,
          UserId: userId,
        },
      ]);
    const response = await databases.updateDocument<EstimationSessionType>(
      APPWRITE_DATABASE_ID,
      APPWRITE_ESTIMATION_SESSION_COLLECTION_ID,
      sessionId,
      {
        SessionState: JSON.stringify({
          CurrentTicketId: ticketId,
          Votes: newVotes,
        }),
      },
    );
    setEstimationSessions((estimationSessions) =>
      estimationSessions
        .filter((x) => x.$id != sessionId)
        .concat([response])
        .slice(0, 10),
    );
  };

  const revealVotes = async (sessionId: string) => {
    const currentState = getState(sessionId);
    const response = await databases.updateDocument<EstimationSessionType>(
      APPWRITE_DATABASE_ID,
      APPWRITE_ESTIMATION_SESSION_COLLECTION_ID,
      sessionId,
      {
        SessionState: JSON.stringify({
          ...currentState,
          VotesRevealed: true,
        }),
      },
    );
    setEstimationSessions((estimationSessions) =>
      estimationSessions
        .filter((x) => x.$id != sessionId)
        .concat([response])
        .slice(0, 10),
    );
  };

  const init = async () => {
    const response = await databases.listDocuments<EstimationSessionType>(
      APPWRITE_DATABASE_ID,
      APPWRITE_ESTIMATION_SESSION_COLLECTION_ID,
      [Query.orderDesc('$createdAt'), Query.limit(10)],
    );
    setEstimationSessions(response.documents);

    client.subscribe<EstimationSessionType>(
      [
        `databases.${APPWRITE_DATABASE_ID}.collections.${APPWRITE_ESTIMATION_SESSION_COLLECTION_ID}.documents`,
      ],
      (payload) => {
        setEstimationSessions((estimationSessions) =>
          estimationSessions
            .filter((x) => x.$id != payload.payload.$id)
            .concat([payload.payload])
            .slice(0, 10),
        );
      },
    );
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <EstimationSessionsContext.Provider
      value={{
        current: estimationSessions,
        add,
        remove,
        addTicket,
        getTickets,
        selectTicket,
        getState,
        voteEstimate,
        revealVotes,
      }}
    >
      {props.children}
    </EstimationSessionsContext.Provider>
  );
}
