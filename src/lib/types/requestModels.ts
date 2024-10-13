interface CreateTicketRequest {
  name: string;
  content: string;
}

interface EditTicketRequest extends CreateTicketRequest {
  id: string;
}

export type { CreateTicketRequest, EditTicketRequest };
