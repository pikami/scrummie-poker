import { useEffect, useState } from 'react';
import {
  getInviteInfo,
  joinSession,
  SessionInviteInfo,
} from 'src/lib/functions/estimationSessionInvite';
import { getRouteApi } from '@tanstack/react-router';
import { Button, ButtonColor, Card, Loader } from 'src/components';

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
    return <Loader fullHeight center />;
  }

  if (!sessionInfo.success) {
    return <p>{sessionInfo.message}</p>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 transition-colors dark:bg-nero-900">
      <Card
        title="You have been invited to join a new estimation session!"
        className="bg-white shadow-lg dark:bg-nero-800"
        transparent
      >
        <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
          Session Name: <strong>{sessionInfo.name}</strong>
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={handleAccept}>Accept</Button>
          <Button onClick={handleReturnHome} color={ButtonColor.Secondary}>
            Return Home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Join;
