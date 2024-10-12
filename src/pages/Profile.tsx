import { useForm } from '@tanstack/react-form';
import { Button, Input } from '../components';
import { useUser } from '../lib/context/user';

const Profile = () => {
  const user = useUser();
  const updateUsernameForm = useForm({
    defaultValues: {
      name: '',
    },
    onSubmit: async ({ value }) => {
      await user.updateUsername(value.name);
      updateUsernameForm.reset();
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 transition-colors dark:bg-nero-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-nero-800">
        <h1 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Update Name
        </h1>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            updateUsernameForm.handleSubmit();
          }}
        >
          <updateUsernameForm.Field
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
            Update
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
