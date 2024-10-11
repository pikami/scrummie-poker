import { useEffect, useState } from 'react';
import {
  getInviteInfo,
  joinSession,
  SessionInviteInfo,
} from '../lib/functions/estimationSessionInvite';
import { getRouteApi } from '@tanstack/react-router';

const route = getRouteApi('/_authenticated/join/$sessionId');

const Join = () => {
  const navigate = route.useNavigate();
  const { sessionId } = route.useParams();
  const [sessionInfo, setSessionInfo] = useState<SessionInviteInfo>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getInviteInfo(sessionId).then((sessionInfo) => {
      setSessionInfo(sessionInfo);
      setIsLoading(false);
    });
  }, [sessionId]);

  const handleAccept = async () => {
    setIsLoading(true);
    await joinSession(sessionId);

    navigate({
      to: '/estimate/session/$sessionId',
      params: {
        sessionId: sessionId,
      },
    });
  };

  const handleReturnHome = () => {
    navigate({
      to: '/',
    });
  };

  if (!sessionInfo || isLoading) {
    // TODO: add loader
    return <p>Loading...</p>;
  }

  if (!sessionInfo.success) {
    return <p>{sessionInfo.message}</p>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 transition-colors dark:bg-nero-900">
      <div className="max-w-lg rounded-lg bg-white p-8 text-center shadow-lg dark:bg-nero-800">
        <h1 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
          You have been invited to join a new estimation session!
        </h1>
        <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
          Session Name: <strong>{sessionInfo.name}</strong>
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleAccept}
            className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
          >
            Accept
          </button>
          <button
            onClick={handleReturnHome}
            className="rounded-md bg-gray-300 px-6 py-2 text-sm font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-200 dark:bg-nero-700 dark:text-gray-100 dark:hover:bg-gray-600"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Join;
