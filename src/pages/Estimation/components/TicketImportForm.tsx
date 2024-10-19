import { useState } from 'react';
import {
  handleTicketFileUpload,
  TicketFileUploadResponse,
} from '../../../lib/parsers/ticketUpload';
import { EstimationSessionTicket } from '../../../lib/types/entityModels';
import { Button, Card, GridList, Loader } from '../../../components';
import HtmlEmbed from '../../../components/HtmlEmbed';
import { useEstimationContext } from '../../../lib/context/estimation';

interface TicketImportFormProps {
  onTicketsImported: () => void;
}

const TicketImportForm: React.FC<TicketImportFormProps> = ({
  onTicketsImported,
}) => {
  const [error, setError] = useState<string>('');
  const [tickets, setTickets] = useState<EstimationSessionTicket[]>([]);
  const estimationContext = useEstimationContext();

  if (!estimationContext) {
    return <Loader center fullHeight />;
  }

  const { createTickets } = estimationContext;

  const onParsedTickets = ({ tickets, error }: TicketFileUploadResponse) => {
    if (error) {
      setError(error);
    }
    setTickets(tickets);
  };

  const onCreateTickets = async () => {
    await createTickets(tickets);
    onTicketsImported();
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
        Upload Ticket List CSV
      </h2>

      <input
        type="file"
        accept=".csv"
        onChange={(e) => {
          setTickets([]);
          setError('');
          handleTicketFileUpload(e, onParsedTickets);
        }}
        className="mb-4 block w-full text-sm text-gray-900 dark:text-gray-100"
      />

      {error && <p className="text-red-500">{error}</p>}

      {tickets.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-2 mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">
            Tickets to be imported
          </h3>
          <GridList
            className="no-scrollbar overflow-y-scroll"
            items={tickets}
            colNum={1}
            itemComponent={({ item }) => (
              <Card
                key={item.id}
                title={item.name}
                description={`Estimate: ${item.estimate || 'N/A'}`}
              >
                <HtmlEmbed className="h-16 w-full" body={item.content} />
              </Card>
            )}
          />
          <Button className="mt-4" fullWidth onClick={onCreateTickets}>
            Import
          </Button>
        </div>
      )}
    </div>
  );
};

export default TicketImportForm;
