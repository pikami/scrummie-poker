import { Card, GridList } from '../../../components';
import { PlayerVote } from '../../../lib/types/entityModels';

interface VoteListProps {
  className?: string;
  votes: PlayerVote[];
  revealed: boolean;
}

const VoteList: React.FC<VoteListProps> = ({ className, votes, revealed }) => {
  return (
    <div className={className}>
      <h2 className="mb-4 text-xl font-bold">Player Votes</h2>
      <GridList
        colNum={5}
        itemComponent={({ item }, idx) => (
          <Card
            key={idx}
            title={item.userId}
            description={revealed ? item.estimate : 'Hidden'}
          />
        )}
        items={votes}
      />
    </div>
  );
};

export default VoteList;
