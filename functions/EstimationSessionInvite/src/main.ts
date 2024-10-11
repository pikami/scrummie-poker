import { Client, Databases } from 'node-appwrite';
import { AppwriteRuntimeContext, AppwriteSendReturn } from './definitions.mjs';

const joinSession = async ({
  client,
  estimationId,
  userId,
  ctx: { error, res },
}: {
  client: Client;
  estimationId: string;
  userId: string;
  ctx: AppwriteRuntimeContext;
}): Promise<AppwriteSendReturn> => {
  const databases = new Databases(client);

  let estimation;
  try {
    estimation = await databases.getDocument(
      Bun.env.APPWRITE_DATABASE_ID,
      Bun.env.APPWRITE_ESTIMATION_SESSION_COLLECTION_ID,
      estimationId,
    );
  } catch (e) {
    error({ e });
    return res.json(
      {
        message: 'Estimation with this id does not exist',
      },
      400,
    );
  }

  try {
    const permissions: string[] = estimation['$permissions'];
    permissions.push(`read("user:${userId}")`);
    permissions.push(`update("user:${userId}")`);

    await databases.updateDocument(
      Bun.env.APPWRITE_DATABASE_ID,
      Bun.env.APPWRITE_ESTIMATION_SESSION_COLLECTION_ID,
      estimationId,
      {},
      permissions,
    );

    return res.json({
      message: 'Estimation session joined',
    });
  } catch (e) {
    error({ e });
    return res.json(
      {
        message: 'Failed to join estimation session',
      },
      500,
    );
  }
};

const getSessionInfo = async ({
  client,
  estimationId,
  ctx: { log, res },
}: {
  client: Client;
  estimationId: string;
  ctx: AppwriteRuntimeContext;
}): Promise<AppwriteSendReturn> => {
  const databases = new Databases(client);

  try {
    const estimation = await databases.getDocument(
      Bun.env.APPWRITE_DATABASE_ID,
      Bun.env.APPWRITE_ESTIMATION_SESSION_COLLECTION_ID,
      estimationId,
    );

    return res.json({
      result: {
        id: estimation.$id,
        name: estimation.name,
      },
    });
  } catch (e) {
    console.log({ e });
    log({ e });
    return res.json(
      {
        message: 'Estimation with this id does not exist',
      },
      400,
    );
  }
};

export default async (ctx: AppwriteRuntimeContext) => {
  const { req, res } = ctx;
  const userId = req.headers['x-appwrite-user-id'];
  if (!userId) {
    return res.json(
      {
        message: 'Unauthorized',
      },
      401,
    );
  }

  const action = req.query['action'];
  const estimationId = req.query['estimationId'];
  if (!action || !estimationId) {
    return res.json(
      {
        message: 'Bad request',
      },
      400,
    );
  }

  const client = new Client()
    .setEndpoint(Bun.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(Bun.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] ?? '');

  if (action === 'get-info') {
    return await getSessionInfo({
      client,
      ctx,
      estimationId,
    });
  }

  if (action === 'join') {
    return await joinSession({
      client,
      estimationId,
      userId,
      ctx,
    });
  }

  return res.json(
    {
      message: 'Not found',
    },
    404,
  );
};
