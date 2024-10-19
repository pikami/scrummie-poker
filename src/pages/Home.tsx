import { getRouteApi } from '@tanstack/react-router';
import { useEstimationsList } from '../lib/context/estimationsList';
import {
  Card,
  CreateEstimationSessionForm,
  Drawer,
  GridList,
} from '../components';
import { useState } from 'react';

const route = getRouteApi('/_authenticated/');

function Home() {
  const navigate = route.useNavigate();
  const estimationsList = useEstimationsList();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Estimation sessions</h1>

      <GridList
        colNum={2}
        className="my-3"
        items={estimationsList?.current ?? []}
        itemComponent={({ item }) => (
          <Card
            key={item.id}
            title={item.name}
            onClick={() => {
              navigate({
                to: '/estimate/session/$sessionId',
                params: { sessionId: item.id },
              });
            }}
          />
        )}
        addItemLabel="+ Create Estimation Session"
        onAddItem={() => setIsDrawerOpen(true)}
      />

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <CreateEstimationSessionForm onCreated={() => setIsDrawerOpen(false)} />
      </Drawer>
    </div>
  );
}

export default Home;
