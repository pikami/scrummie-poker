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
import { ID, Query } from 'appwrite';
import { DatabaseModels, EntityModels } from '../types';
import {
  mapDatabaseToEntity,
  mapEntityToDatabase,
} from '../mappers/estimationSession';
import { useUser } from './user';

interface EstimationsListContextType {
  current: EntityModels.EstimationSession[];
  add: (estimationSession: { name: string; userId?: string }) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

const EstimationsListContext = createContext<
  EstimationsListContextType | undefined
>(undefined);

export function useEstimationsList() {
  return useContext(EstimationsListContext);
}

export function EstimationsListContextProvider(props: PropsWithChildren) {
  const { current: userData } = useUser();
  const [estimationSessions, setEstimationSessions] = useState<
    EntityModels.EstimationSession[]
  >([]);

  const add = async (estimationSession: { name: string; userId?: string }) => {
    if (!userData) {
      throw Error('Tried to create new estimation with no user context');
    }

    const username =
      userData.name.length > 0 ? userData.name : `Guest - ${userData.$id}`;

    const newEstimationSession: Partial<EntityModels.EstimationSession> = {
      name: estimationSession.name,
      userId: userData.$id,
      playerIds: [userData.$id],
      players: [
        {
          userId: userData.$id,
          name: username,
        },
      ],
    };

    const response =
      await databases.createDocument<DatabaseModels.EstimationSession>(
        DATABASE_ID,
        ESTIMATION_SESSION_COLLECTION_ID,
        ID.unique(),
        mapEntityToDatabase(newEstimationSession),
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
    const response =
      await databases.listDocuments<DatabaseModels.EstimationSession>(
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

    return client.subscribe<DatabaseModels.EstimationSession>(
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
