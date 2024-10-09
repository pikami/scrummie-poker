import './Home.css';
import { getRouteApi, Link } from '@tanstack/react-router';
import { useUser } from '../lib/context/user';
import { useEstimationSessions } from '../lib/context/estimationSession';
import {
  Card,
  CreateEstimationSessionForm,
  Drawer,
  GridList,
} from '../components';
import { useState } from 'react';

const route = getRouteApi('/_authenticated/');

function Home() {
  const user = useUser();
  const navigate = route.useNavigate();
  const estimationSessions = useEstimationSessions();
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <h1 className="text-3xl font-bold underline">Scrummie-Poker</h1>

      <ul>
        <li>
          <Link to="/login">Login</Link>
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
              title={item.name}
              description={item.$id}
              onClick={() => {
                navigate({
                  to: '/estimate/session/$sessionId',
                  params: { sessionId: item.$id },
                });
              }}
            />
          )}
          onAddItem={() => setDrawerOpen(true)}
        />
      </div>

      <Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <CreateEstimationSessionForm onCreated={() => setDrawerOpen(false)} />
      </Drawer>
    </>
  );
}

export default Home;
