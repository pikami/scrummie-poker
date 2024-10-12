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
import { ID, Models, Query } from 'appwrite';
import { EntityModels } from '../types';
import { mapDatabaseToEntity } from '../mappers/estimationSession';

interface EstimationSessionType extends Models.Document {
  userId: string;
  name: string;
  tickets: string[];
  sessionState: string;
}

interface EstimationsListContextType {
  current: EntityModels.EstimationSession[];
  add: (
    estimationSession: Omit<EstimationSessionType, keyof Models.Document>,
  ) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

const EstimationsListContext = createContext<
  EstimationsListContextType | undefined
>(undefined);

export function useEstimationsList() {
  return useContext(EstimationsListContext);
}

export function EstimationsListContextProvider(props: PropsWithChildren) {
  const [estimationSessions, setEstimationSessions] = useState<
    EntityModels.EstimationSession[]
  >([]);

  const add = async (
    estimationSession: Omit<EstimationSessionType, keyof Models.Document>,
  ) => {
    const response = await databases.createDocument<EstimationSessionType>(
      DATABASE_ID,
      ESTIMATION_SESSION_COLLECTION_ID,
      ID.unique(),
      estimationSession,
    );
    setEstimationSessions((estimationSessions) =>
      [mapDatabaseToEntity(response, {}), ...estimationSessions].slice(0, 10),
    );
  };

  const remove = async (id: string) => {
    await databases.deleteDocument(
      DATABASE_ID,
      ESTIMATION_SESSION_COLLECTION_ID,
      id,
    );
    setEstimationSessions((estimationSessions) =>
      estimationSessions.filter(
        (estimationSession) => estimationSession.id !== id,
      ),
    );
    await init();
  };

  const init = async () => {
    const response = await databases.listDocuments<EstimationSessionType>(
      DATABASE_ID,
      ESTIMATION_SESSION_COLLECTION_ID,
      [Query.orderDesc('$createdAt'), Query.limit(10)],
    );
    setEstimationSessions(
      response.documents.map((document) => mapDatabaseToEntity(document, {})),
    );
  };

  useEffect(() => {
    init();

    return client.subscribe<EstimationSessionType>(
      [
        `databases.${DATABASE_ID}.collections.${ESTIMATION_SESSION_COLLECTION_ID}.documents`,
      ],
      (payload) => {
        setEstimationSessions((estimationSessions) =>
          estimationSessions
            .filter((x) => x.id != payload.payload.$id)
            .concat([mapDatabaseToEntity(payload.payload, {})])
            .slice(0, 10),
        );
      },
    );
  }, []);

  return (
    <EstimationsListContext.Provider
      value={{
        current: estimationSessions,
        add,
        remove,
      }}
    >
      {props.children}
    </EstimationsListContext.Provider>
  );
}
