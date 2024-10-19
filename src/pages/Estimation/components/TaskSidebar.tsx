import classNames from 'classnames';
import { Button, Card, Drawer, GridList } from '../../../components';
import { EstimationSessionTicket } from '../../../lib/types/entityModels';
import TicketImportForm from './TicketImportForm';
import { useState } from 'react';

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const containerClassName = classNames(
    className,
    'flex flex-col justify-between',
  );

  return (
    <div className={containerClassName}>
      <GridList
        className="no-scrollbar overflow-y-scroll"
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
        addItemLabel="+ Add Ticket"
        onAddItem={onAddTicket}
      />
      <Button className="mt-2" fullWidth onClick={() => setIsDrawerOpen(true)}>
        Import Tickets
      </Button>
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <TicketImportForm onTicketsImported={() => setIsDrawerOpen(false)} />
      </Drawer>
    </div>
  );
};

export default TaskSidebar;
