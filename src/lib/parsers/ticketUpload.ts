import { EntityModels } from '../types';
import Papa from 'papaparse';
import Showdown from 'showdown';

export interface TicketFileUploadResponse {
  tickets: EntityModels.EstimationSessionTicket[];
  error?: string;
}

export enum FileSchema {
  Jira,
}

export const handleTicketFileUpload = (
  event: React.ChangeEvent<HTMLInputElement>,
  callback: (response: TicketFileUploadResponse) => void,
  fileSchema: FileSchema = FileSchema.Jira,
) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Parse the CSV file using PapaParse
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      let parsedTickets: EntityModels.EstimationSessionTicket[] | null = null;
      switch (fileSchema) {
        // TODO: Add more file schemas
        case FileSchema.Jira:
          parsedTickets = parseJiraCSV(results.data);
          break;
        default:
      }

      callback({
        tickets: parsedTickets ?? [],
        error: parsedTickets ? undefined : 'Failed to parse JIRA CSV file.',
      });
    },
    error: (err) => {
      callback({
        tickets: [],
        error: `Error parsing CSV file: ${err.message}`,
      });
    },
  });
};

const parseJiraCSV = (
  data: any[],
): EntityModels.EstimationSessionTicket[] | null => {
  const converter = new Showdown.Converter();

  try {
    return data.map<EntityModels.EstimationSessionTicket>((row) => ({
      id: crypto.randomUUID(),
      name: row['Summary'],
      estimate: row['Story point estimate'] || '',
      content: converter.makeHtml(row['Description'] || ''),
    }));
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return null;
  }
};
