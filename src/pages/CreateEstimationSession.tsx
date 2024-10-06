import { useForm } from '@tanstack/react-form';
import { useEstimationSessions } from '../lib/context/estimationSession';
import { useUser } from '../lib/context/user';

const CreateEstimationSession = () => {
  const user = useUser();
  const estimationSessions = useEstimationSessions();
  const form = useForm({
    defaultValues: {
      name: '',
    },
    onSubmit: async ({ value }) => {
      await estimationSessions?.add({
        Name: value.name,
        UserId: user.current?.$id,
      });
    },
  });

  return (
    <>
      <h1>Create Estimation Session</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="name"
          children={(field) => (
            <input
              placeholder="Name"
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default CreateEstimationSession;
