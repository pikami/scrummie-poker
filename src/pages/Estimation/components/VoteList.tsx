import { Card, GridList } from 'src/components';
import { PlayerVote } from 'src/lib/types/entityModels';

interface VoteListProps {
  className?: string;
  votes: PlayerVote[];
  revealed: boolean;
}

const VoteList: React.FC<VoteListProps> = ({ className, votes, revealed }) => {
  const voteListItem = ({ item }: { item: PlayerVote }, idx: string) => (
    <Card
      key={idx}
      title={item.username}
      description={revealed ? item.estimate : 'Hidden'}
    />
  );

  return (
    <div className={className}>
      {votes.length > 0 && (
        <h2 className="mb-4 text-xl font-bold">Player Votes</h2>
      )}
      <GridList colNum={5} itemComponent={voteListItem} items={votes} />
    </div>
  );
};

export default VoteList;
