import reactLogo from '../assets/react.svg';
import viteLogo from '/vite.svg';
import './Home.css';
import { getRouteApi, Link } from '@tanstack/react-router';
import { useUser } from '../lib/context/user';
import { useEstimationSessions } from '../lib/context/estimationSession';
import { Card, GridList } from '../components';

const route = getRouteApi('/');

function Home() {
  const user = useUser();
  const navigate = route.useNavigate();
  const estimationSessions = useEstimationSessions();

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="text-3xl font-bold underline">Scrummie-Poker</h1>

      <ul>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/estimate/new">Create Estimation Session</Link>
        </li>
      </ul>
      <pre>User Id: {user.current?.$id}</pre>

      <div>
        <p>Estimation sessions</p>
        <GridList
          colNum={2}
          items={estimationSessions?.current ?? []}
          itemComponent={({ item }) => (
            <Card
              key={item.$id}
              title={item.Name}
              description={item.$id}
              onClick={() => {
                navigate({
                  to: '/estimate/session/$sessionId',
                  params: { sessionId: item.$id },
                });
              }}
            />
          )}
          onAddItem={() =>
            navigate({
              to: '/estimate/new',
            })
          }
        />
      </div>
    </>
  );
}

export default Home;
