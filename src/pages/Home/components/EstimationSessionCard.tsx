import { getRouteApi } from '@tanstack/react-router';
import { Card } from 'src/components';
import { EntityModels } from 'src/lib/types';

interface EstimationSessionCardProps {
  item: EntityModels.EstimationSession;
}

const route = getRouteApi('/_authenticated/');

const EstimationSessionCard: React.FC<EstimationSessionCardProps> = ({
  item,
}) => {
  const navigate = route.useNavigate();

  return (
    <Card
      key={item.id}
      title={item.name}
      onClick={() => {
        navigate({
          to: '/estimate/session/$sessionId',
          params: { sessionId: item.id },
        });
      }}
    />
  );
};

export default EstimationSessionCard;
