import { useForm } from '@tanstack/react-form';
import { useUser } from '../lib/context/user';
import { Button, ButtonColor, Input } from '../components';
import { yupValidator } from '@tanstack/yup-form-adapter';
import * as yup from 'yup';

const Login = () => {
  const user = useUser();
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      console.log({ value });
    },
    validators: {
      onChange: yup.object({
        email: yup.string().label('Email').email().required(),
        password: yup.string().label('Password').min(8).max(256).required(),
      }),
    },
    validatorAdapter: yupValidator(),
  });

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6">
          <form.Field name="email">
            {(field) => (
              <Input
                label="Email address"
                type="email"
                autoComplete="email"
                required
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                errors={field.state.meta.errors}
              />
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <Input
                label="Password"
                type="password"
                autoComplete="current-password"
                required
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                errors={field.state.meta.errors}
              />
            )}
          </form.Field>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <div>
                {/* TODO: Add loader when submitting */}
                <div className="flex items-center justify-between gap-4">
                  <Button
                    disabled={!canSubmit}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      user.login(
                        form.state.values.email,
                        form.state.values.password,
                      );
                    }}
                  >
                    Sign in
                  </Button>

                  <Button
                    disabled={!canSubmit}
                    color={ButtonColor.Secondary}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      user.register(
                        form.state.values.email,
                        form.state.values.password,
                      );
                    }}
                  >
                    Register
                  </Button>
                </div>
              </div>
            )}
          </form.Subscribe>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Don't want to create an account?{' '}
          <a
            href="#"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            onClick={() => user.loginAsGuest()}
          >
            Sign in as a guest
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
