import { useForm } from '@tanstack/react-form';
import { Button, Input } from '../../../components';
import { EstimationSessionTicket } from '../../../lib/types/entityModels';

interface CreateTicketFormProps {
  onCreate: (ticket: Omit<EstimationSessionTicket, 'id'>) => Promise<void>;
}

const CreateTicketForm: React.FC<CreateTicketFormProps> = ({ onCreate }) => {
  const form = useForm({
    defaultValues: {
      name: '',
    },
    onSubmit: async ({ value }) => {
      await onCreate(value);
    },
  });

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">Create a New Ticket</h2>
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="name"
          children={(field) => (
            <Input
              label="Name"
              required
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
        <Button type="submit" fullWidth>
          Create
        </Button>
      </form>
    </div>
  );
};

export default CreateTicketForm;
