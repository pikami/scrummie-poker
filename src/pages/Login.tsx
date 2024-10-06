import { useForm } from '@tanstack/react-form';
import { useUser } from '../lib/context/user';

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
  });

  return (
    <>
      <h1>Login or register</h1>
      <form>
        <form.Field
          name="email"
          children={(field) => (
            <input
              type="email"
              placeholder="Email"
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
        <form.Field
          name="password"
          children={(field) => (
            <input
              type="password"
              placeholder="Password"
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
        <div>
          <button
            className="button"
            type="button"
            onClick={() =>
              user.login(form.state.values.email, form.state.values.password)
            }
          >
            Login
          </button>
          <button
            className="button"
            type="button"
            onClick={() =>
              user.register(form.state.values.email, form.state.values.password)
            }
          >
            Register
          </button>
        </div>
      </form>
      <button onClick={() => user.loginAsGuest()}>Login as guest</button>
    </>
  );
};

export default Login;
