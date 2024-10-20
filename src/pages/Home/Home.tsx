import { useEstimationsList } from 'src/lib/context/estimationsList';
import { Drawer, DrawerSize, GridList } from 'src/components';
import { useState } from 'react';
import CreateEstimationSessionForm from './components/CreateEstimationSessionForm';
import EstimationSessionCard from './components/EstimationSessionCard';

function Home() {
  const estimationsList = useEstimationsList();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Estimation sessions</h1>

      <GridList
        colNum={2}
        className="my-3"
        items={estimationsList?.current ?? []}
        itemComponent={EstimationSessionCard}
        addItemLabel="+ Create Estimation Session"
        onAddItem={() => setIsDrawerOpen(true)}
      />

      <Drawer
        size={DrawerSize.Small}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <CreateEstimationSessionForm onCreated={() => setIsDrawerOpen(false)} />
      </Drawer>
    </div>
  );
}

export default Home;
