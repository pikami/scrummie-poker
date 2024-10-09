import React, { useEffect, useState } from 'react';
import { useEstimationContext } from '../../lib/context/estimation';
import { getRouteApi } from '@tanstack/react-router';
import TaskSidebar from './components/TaskSidebar';
import VoteSelection from './components/VoteSelection';
import VoteList from './components/VoteList';
import { Button, ButtonColor, Drawer } from '../../components';
import CreateTicketForm from './components/CreateTicketForm';

const fibonacciSequence = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 100];

const route = getRouteApi('/_authenticated/estimate/session/$sessionId');

const Estimation: React.FC = () => {
  const { sessionId } = route.useParams();
  const estimationState = useEstimationContext();
  useEffect(() => estimationState?.setSessionId(sessionId), [sessionId]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  if (!estimationState?.currentSessionData) {
    return null; // TODO: Add a loader
  }

  const {
    setActiveTicket,
    setVote,
    setRevealed,
    createTicket,
    currentSessionData: {
      tickets: tickets,
      sessionState: {
        votesRevealed: revealed,
        votes: votes,
        currentPlayerVote,
        currentTicket,
      },
    },
  } = estimationState;

  return (
    <div className="flex h-screen">
      <TaskSidebar
        className="w-64 overflow-y-scroll bg-gray-50 p-4 dark:bg-nero-800"
        tickets={tickets}
        onSelectTicket={(ticket) => setActiveTicket(ticket.id)}
        onAddTicket={() => setDrawerOpen(true)}
      />

      <div className="flex w-full flex-grow flex-col p-6">
        {currentTicket ? (
          <>
            <h1 className="mb-4 text-2xl font-bold">{currentTicket.name}</h1>
            <p className="mb-8 text-gray-700 dark:text-gray-200">
              {currentTicket.id}
            </p>

            <VoteSelection
              className="mb-4 mt-auto flex flex-wrap gap-1 space-x-4"
              onSelect={(vote) => setVote(vote)}
              options={fibonacciSequence.map((x) => `${x}`)}
              value={currentPlayerVote}
            />

            <VoteList className="mt-6" revealed={revealed} votes={votes} />

            <div className="mt-4">
              <Button
                color={ButtonColor.Error}
                onClick={() => setRevealed(true)}
              >
                Reveal Votes
              </Button>
            </div>
          </>
        ) : (
          <p>Select a task to see the details and estimate.</p>
        )}
      </div>

      <Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <CreateTicketForm
          onCreate={async (ticket) => {
            await createTicket(ticket);
            setDrawerOpen(false);
          }}
        />
      </Drawer>
    </div>
  );
};

export default Estimation;
