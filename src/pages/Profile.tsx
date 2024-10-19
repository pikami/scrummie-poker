import { useForm } from '@tanstack/react-form';
import { Button, Input } from '../components';
import { useUser } from '../lib/context/user';
import { yupValidator } from '@tanstack/yup-form-adapter';
import * as yup from 'yup';

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
    validators: {
      onChange: yup.object({
        name: yup.string().label('Name').max(128).required(),
      }),
    },
    validatorAdapter: yupValidator(),
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
          <updateUsernameForm.Field name="name">
            {(field) => {
              return (
                <Input
                  label="Name"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  errors={field.state.meta.errors}
                />
              );
            }}
          </updateUsernameForm.Field>
          <updateUsernameForm.Subscribe
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
          </updateUsernameForm.Subscribe>
        </form>
      </div>
    </div>
  );
};

export default Profile;
