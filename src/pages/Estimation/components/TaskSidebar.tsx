import { Card, GridList } from '../../../components';
import { EstimationSessionTicket } from '../../../lib/types/entityModels';

interface TaskSidebarProps {
  className?: string;
  tickets: EstimationSessionTicket[];
  onSelectTicket: (ticket: EstimationSessionTicket) => void;
  onAddTicket: () => void;
}

const TaskSidebar: React.FC<TaskSidebarProps> = ({
  className,
  tickets,
  onSelectTicket,
  onAddTicket,
}) => {
  return (
    <div className={className}>
      <GridList
        items={tickets}
        colNum={1}
        itemComponent={({ item }) => (
          <Card
            key={item.id}
            title={item.name}
            description={item.id}
            onClick={() => onSelectTicket(item)}
          />
        )}
        onAddItem={onAddTicket}
      />
    </div>
  );
};

export default TaskSidebar;
