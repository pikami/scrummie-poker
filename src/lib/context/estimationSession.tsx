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
  userId: string;
  name: string;
  tickets: string[];
  sessionState: string;
}

interface EstimationSessionTicket {
  id: string;
  name: string;
}

interface SessionStateType {
  currentTicketId: string;
  votesRevealed: boolean;
  votes: {
    userId: string;
    estimate: number;
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
    ticket: Omit<EstimationSessionTicket, 'id'>,
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
    ticket: Omit<EstimationSessionTicket, 'id'>,
  ) => {
    const currentSession = estimationSessions.find((x) => x.$id === sessionId);
    const response = await databases.updateDocument<EstimationSessionType>(
      APPWRITE_DATABASE_ID,
      APPWRITE_ESTIMATION_SESSION_COLLECTION_ID,
      sessionId,
      {
        tickets: currentSession?.tickets.concat([
          JSON.stringify({
            ...ticket,
            id: crypto.randomUUID(),
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
        ?.tickets.map<EstimationSessionTicket>((x) => JSON.parse(x)) ?? []
    );
  };

  const selectTicket = async (sessionId: string, ticketId: string) => {
    const response = await databases.updateDocument<EstimationSessionType>(
      APPWRITE_DATABASE_ID,
      APPWRITE_ESTIMATION_SESSION_COLLECTION_ID,
      sessionId,
      {
        sessionState: JSON.stringify({
          currentTicketId: ticketId,
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
      estimationSessions.find((x) => x.$id === sessionId)?.sessionState ?? '{}',
    );
  };

  const voteEstimate = async (
    sessionId: string,
    ticketId: string,
    estimate: number,
    userId: string,
  ) => {
    const currentState = getState(sessionId);
    const newVotes = (currentState.votes ?? [])
      .filter((x) => x.userId !== userId)
      .concat([
        {
          estimate: estimate,
          userId: userId,
        },
      ]);
    const response = await databases.updateDocument<EstimationSessionType>(
      APPWRITE_DATABASE_ID,
      APPWRITE_ESTIMATION_SESSION_COLLECTION_ID,
      sessionId,
      {
        sessionState: JSON.stringify({
          currentTicketId: ticketId,
          votes: newVotes,
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
        sessionState: JSON.stringify({
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
  };

  useEffect(() => {
    init();

    return client.subscribe<EstimationSessionType>(
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
