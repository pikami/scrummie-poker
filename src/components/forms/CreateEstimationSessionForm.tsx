import { useForm } from '@tanstack/react-form';
import { useEstimationsList } from '../../lib/context/estimationsList';
import Input from '../Input';
import Button from '../Button';
import { yupValidator } from '@tanstack/yup-form-adapter';
import * as yup from 'yup';

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
    validators: {
      onChange: yup.object({
        name: yup.string().label('Name').max(200).required(),
      }),
    },
    validatorAdapter: yupValidator(),
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
        <form.Field name="name">
          {(field) => (
            <Input
              label="Name"
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              errors={field.state.meta.errors}
            />
          )}
        </form.Field>
        <form.Subscribe selector={(state) => [state.canSubmit]}>
          {([canSubmit]) => (
            <Button type="submit" disabled={!canSubmit} fullWidth>
              Create
            </Button>
          )}
        </form.Subscribe>
      </form>
    </>
  );
};

export default CreateEstimationSessionForm;
