import { useForm } from '@tanstack/react-form';
import { Button, Input } from '../../../components';
import RichEditor from '../../../components/RichEditor';

interface EditTicketFormData {
  name: string;
  content: string;
}

interface EditTicketFormProps {
  initialData?: EditTicketFormData;
  onSave: (ticket: EditTicketFormData) => Promise<void>;
}

const EditTicketForm: React.FC<EditTicketFormProps> = ({
  initialData,
  onSave,
}) => {
  const form = useForm<EditTicketFormData>({
    defaultValues: initialData ?? {
      name: '',
      content: '',
    },
    onSubmit: async ({ value }) => {
      await onSave(value);
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
        <form.Field
          name="content"
          children={(field) => (
            <RichEditor
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        />
        <Button type="submit" fullWidth>
          Save
        </Button>
      </form>
    </div>
  );
};

export default EditTicketForm;
