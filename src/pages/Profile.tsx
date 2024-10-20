import { useForm } from '@tanstack/react-form';
import { Button, Card, Input } from 'src/components';
import { useUser } from 'src/lib/context/user';
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
      onSubmit: yup.object({
        name: yup.string().label('Name').max(128).required(),
      }),
    },
    validatorAdapter: yupValidator(),
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 transition-colors dark:bg-nero-900">
      <Card
        title="Update Name"
        className="w-full max-w-md bg-white shadow-lg dark:bg-nero-800"
        transparent
      >
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
      </Card>
    </div>
  );
};

export default Profile;
