import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  client,
  DATABASE_ID,
  databases,
  ESTIMATION_SESSION_COLLECTION_ID,
} from '../appwrite';
import { DatabaseModels, EntityModels } from '../types';
import { useUser } from './user';
import { mapDatabaseToEntity } from '../mappers/estimationSession';
import { EditTicketRequest, CreateTicketRequest } from '../types/requestModels';
import { EstimationSessionTicket } from '../types/entityModels';

interface EstimationContextType {
  setSessionId: (sessionId: string) => void;
  setActiveTicket: (ticketId: string) => Promise<void>;
  setRevealed: (revealed: boolean) => Promise<void>;
  setVote: (estimate: string) => Promise<void>;
  createTicket: (ticket: CreateTicketRequest) => Promise<void>;
  createTickets: (tickets: CreateTicketRequest[]) => Promise<void>;
  updateTicket: (ticket: EditTicketRequest) => Promise<void>;
  currentSessionData?: EntityModels.EstimationSession;
}

const EstimationContext = createContext<EstimationContextType | undefined>(
  undefined,
);

export const useEstimationContext = () => {
  return useContext(EstimationContext);
};

export const EstimationContextProvider = (props: PropsWithChildren) => {
  const [sessionId, setSessionId] = useState('');
  const [currentSessionData, setCurrentSessionData] =
    useState<EntityModels.EstimationSession>();

  const { current: userData } = useUser();

  useEffect(() => {
    if (!sessionId || !userData) {
      return () => {};
    }

    databases
      .getDocument<DatabaseModels.EstimationSession>(
        DATABASE_ID,
        ESTIMATION_SESSION_COLLECTION_ID,
        sessionId,
      )
      .then((payload) => {
        const userId = userData?.$id ?? '';
        setCurrentSessionData(mapDatabaseToEntity(payload, { userId }));
      });

    return client.subscribe<DatabaseModels.EstimationSession>(
      [
        `databases.${DATABASE_ID}.collections.${ESTIMATION_SESSION_COLLECTION_ID}.documents.${sessionId}`,
      ],
      ({ payload }) => {
        const userId = userData?.$id ?? '';
        setCurrentSessionData(mapDatabaseToEntity(payload, { userId }));
      },
    );
  }, [sessionId, userData]);

  const setSessionIdFunc = (newSessionId: string) => {
    if (sessionId !== newSessionId) {
      setSessionId(newSessionId);
    }
  };

  const updateSessionState = async (
    data: Partial<EntityModels.SessionState>,
  ) => {
    await databases.updateDocument<DatabaseModels.EstimationSession>(
      DATABASE_ID,
      ESTIMATION_SESSION_COLLECTION_ID,
      sessionId,
      {
        sessionState: JSON.stringify({
          ...currentSessionData?.sessionState,
          ...data,
        }),
      },
    );
  };

  const setActiveTicket = async (ticketId: string) => {
    await updateSessionState({
      currentTicketId: ticketId,
      votes: [],
      votesRevealed: false,
    });
  };

  const setVote = async (estimate: string) => {
    const userId = userData?.$id ?? '';
    await updateSessionState({
      votes: currentSessionData?.sessionState.votes
        .filter((x) => x.userId !== userId)
        .concat([
          {
            estimate: estimate,
            userId: userId,
            username: userData?.name ?? '',
          },
        ]),
    });
  };

  const setRevealed = async (revealed: boolean) => {
    await updateSessionState({
      votesRevealed: revealed,
    });
  };

  const createTicket = (ticket: CreateTicketRequest) => createTickets([ticket]);

  const createTickets = async (tickets: CreateTicketRequest[]) => {
    const newTickets = tickets.map<EstimationSessionTicket>(
      ({ content, name, estimate }) => ({
        id: crypto.randomUUID(),
        name,
        content,
        estimate,
      }),
    );

    const newTicketsValue = newTickets
      .concat(currentSessionData?.tickets ?? [])
      .map((x) => JSON.stringify(x));

    await databases.updateDocument<DatabaseModels.EstimationSession>(
      DATABASE_ID,
      ESTIMATION_SESSION_COLLECTION_ID,
      sessionId,
      {
        tickets: newTicketsValue,
      },
    );
  };

  const updateTicket = async ({
    id,
    name,
    content,
    estimate,
  }: EditTicketRequest) => {
    const editedTicket = currentSessionData?.tickets.find((x) => x.id === id);
    if (!editedTicket) {
      return;
    }

    if (name !== undefined) {
      editedTicket.name = name;
    }

    if (content !== undefined) {
      editedTicket.content = content;
    }

    if (estimate !== undefined) {
      editedTicket.estimate = estimate;
    }

    const newTicketsValue = currentSessionData?.tickets.map((x) =>
      JSON.stringify(x),
    );

    await databases.updateDocument<DatabaseModels.EstimationSession>(
      DATABASE_ID,
      ESTIMATION_SESSION_COLLECTION_ID,
      sessionId,
      {
        tickets: newTicketsValue,
      },
    );
  };

  return (
    <EstimationContext.Provider
      value={{
        setSessionId: setSessionIdFunc,
        setActiveTicket,
        setRevealed,
        setVote,
        createTicket,
        createTickets,
        updateTicket,
        currentSessionData,
      }}
    >
      {props.children}
    </EstimationContext.Provider>
  );
};
