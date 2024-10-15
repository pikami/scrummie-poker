interface CreateTicketRequest {
  name: string;
  content: string;
  estimate?: string;
}

interface EditTicketRequest extends Partial<CreateTicketRequest> {
  id: string;
}

export type { CreateTicketRequest, EditTicketRequest };
