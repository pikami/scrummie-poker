import { Card, GridList } from '../../../components';
import { EstimationSessionTicket } from '../../../lib/types/entityModels';

interface TaskSidebarProps {
  className?: string;
  tickets: EstimationSessionTicket[];
  onSelectTicket: (ticket: EstimationSessionTicket) => void;
  onAddTicket: () => void;
  onEditTicket: (ticketId: string) => void;
}

const TaskSidebar: React.FC<TaskSidebarProps> = ({
  className,
  tickets,
  onSelectTicket,
  onAddTicket,
  onEditTicket,
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
            description={item.estimate && `Estimate: ${item.estimate}`}
            onClick={() => onSelectTicket(item)}
            onEdit={() => onEditTicket(item.id)}
          />
        )}
        onAddItem={onAddTicket}
      />
    </div>
  );
};

export default TaskSidebar;
