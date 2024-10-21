import { useForm } from '@tanstack/react-form';
import { useUser } from 'src/lib/context/user';
import { Button, ButtonColor, Card, Input } from 'src/components';
import { yupValidator } from '@tanstack/yup-form-adapter';
import * as yup from 'yup';
import { Link } from '@tanstack/react-router';

const Login = () => {
  const user = useUser();
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: yup.object({
        email: yup.string().label('Email').email().required(),
        password: yup.string().label('Password').min(8).max(256).required(),
      }),
    },
    validatorAdapter: yupValidator(),
  });

  return (
    <div className="flex h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <Card
        title="Sign in to your account"
        className="sm:mx-auto sm:w-full sm:max-w-sm"
      >
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
                <div className="flex items-center justify-between gap-4">
                  <Button
                    disabled={!canSubmit || isSubmitting}
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
                    disabled={!canSubmit || isSubmitting}
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
          <Link
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            onClick={() => user.loginAsGuest()}
          >
            Sign in as a guest
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;
