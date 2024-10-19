import { useForm } from '@tanstack/react-form';
import { Button, Input } from '../../../components';
import RichEditor from '../../../components/RichEditor';
import { yupValidator } from '@tanstack/yup-form-adapter';
import * as yup from 'yup';

interface EditTicketFormData {
  name: string;
  estimate?: string;
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
  const form = useForm({
    defaultValues: initialData ?? {
      name: '',
      estimate: '',
      content: '',
    },
    onSubmit: async ({ value }) => {
      await onSave(value);
    },
    validators: {
      onChange: yup.object({
        name: yup.string().label('Name').max(200).required(),
      }),
    },
    validatorAdapter: yupValidator(),
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
        <form.Field name="name">
          {(field) => (
            <Input
              label="Name"
              required
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              errors={field.state.meta.errors}
            />
          )}
        </form.Field>
        <form.Field name="estimate">
          {(field) => (
            <Input
              label="Estimate"
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              errors={field.state.meta.errors}
            />
          )}
        </form.Field>
        <form.Field name="content">
          {(field) => (
            <RichEditor
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </form.Field>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit}
              isLoading={isSubmitting}
              fullWidth
            >
              Update
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
};

export default EditTicketForm;
