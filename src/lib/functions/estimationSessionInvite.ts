import { ExecutionMethod } from 'appwrite';
import { functions, SESSION_INVITE_FUNCTION_ID } from '../appwrite';

type SessionInviteInfo =
  | {
      success: true;
      id: string;
      name: string;
    }
  | {
      success: false;
      message: string;
    };

type JoinSessionResponse =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

const getInviteInfo = async (sessionId: string): Promise<SessionInviteInfo> => {
  const result = await functions.createExecution(
    SESSION_INVITE_FUNCTION_ID,
    undefined,
    false,
    `/?action=get-info&estimationId=${sessionId}`,
    ExecutionMethod.GET,
    {},
  );

  if (result.status === 'failed') {
    return {
      success: false,
      message: result.errors ?? 'Failed to get estimation session info',
    };
  }

  const responseBody = JSON.parse(result.responseBody);
  if (responseBody.message) {
    return {
      success: false,
      message: responseBody.message,
    };
  }

  const { id, name } = responseBody.result;
  return {
    success: true,
    id,
    name,
  };
};

const joinSession = async (sessionId: string): Promise<JoinSessionResponse> => {
  const result = await functions.createExecution(
    SESSION_INVITE_FUNCTION_ID,
    undefined,
    false,
    `/?action=join&estimationId=${sessionId}`,
    ExecutionMethod.GET,
    {},
  );

  if (result.status === 'failed') {
    return {
      success: false,
      message: result.errors ?? 'Failed to join session',
    };
  }

  const responseBody = JSON.parse(result.responseBody);
  if (responseBody.message) {
    return {
      success: false,
      message: responseBody.message,
    };
  }

  return {
    success: true,
  };
};

export { getInviteInfo, joinSession };
export type { SessionInviteInfo };
