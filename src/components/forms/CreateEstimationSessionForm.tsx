import { useForm } from '@tanstack/react-form';
import { useEstimationsList } from '../../lib/context/estimationsList';
import Input from '../Input';
import Button from '../Button';

interface CreateEstimationSessionFormProps {
  onCreated: () => void;
}

const CreateEstimationSessionForm: React.FC<
  CreateEstimationSessionFormProps
> = ({ onCreated }) => {
  const estimationsList = useEstimationsList();
  const form = useForm({
    defaultValues: {
      name: '',
    },
    onSubmit: async ({ value }) => {
      await estimationsList?.add({
        name: value.name,
      });
      onCreated();
    },
  });

  return (
    <>
      <h2 className="mb-4 text-xl font-bold">
        Create a New Estimation Session
      </h2>
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
    </>
  );
};

export default CreateEstimationSessionForm;
