import React, { useEffect, useState } from 'react';
import { useEstimationContext } from '../../lib/context/estimation';
import { getRouteApi } from '@tanstack/react-router';
import TaskSidebar from './components/TaskSidebar';
import VoteSelection from './components/VoteSelection';
import VoteList from './components/VoteList';
import { Button, ButtonColor, Drawer } from '../../components';
import EditTicketForm from './components/EditTicketForm';
import PlayerList from './components/PlayerList';
import HtmlEmbed from '../../components/HtmlEmbed';

const fibonacciSequence = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 100];

const route = getRouteApi('/_authenticated/estimate/session/$sessionId');

const Estimation: React.FC = () => {
  const { sessionId } = route.useParams();
  const estimationState = useEstimationContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTicketId, setEditingTicketId] = useState<string>('');

  useEffect(() => estimationState?.setSessionId(sessionId), [sessionId]);

  if (!estimationState?.currentSessionData) {
    return null; // TODO: Add a loader
  }

  const {
    setActiveTicket,
    setVote,
    setRevealed,
    createTicket,
    updateTicket,
    currentSessionData: {
      tickets,
      sessionState: {
        votesRevealed: revealed,
        votes,
        currentPlayerVote,
        currentTicket,
      },
      players,
    },
  } = estimationState;

  return (
    <div className="flex h-screen">
      <TaskSidebar
        className="w-64 overflow-y-scroll bg-gray-50 p-4 dark:bg-nero-800"
        tickets={tickets}
        onSelectTicket={(ticket) => setActiveTicket(ticket.id)}
        onAddTicket={() => setIsDrawerOpen(true)}
        onEditTicket={(ticketId) => {
          setEditingTicketId(ticketId);
          setIsDrawerOpen(true);
        }}
      />

      <div className="flex w-full flex-grow flex-col p-6">
        {currentTicket ? (
          <>
            <h1 className="mb-4 text-2xl font-bold">{currentTicket.name}</h1>
            <div className="grow">
              <HtmlEmbed
                className="h-full w-full"
                body={currentTicket.content}
              />
            </div>

            <VoteSelection
              className="mb-4 flex flex-wrap gap-1 space-x-4"
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

      <PlayerList sessionId={sessionId} players={players ?? []} />

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingTicketId('');
        }}
      >
        <EditTicketForm
          initialData={tickets.find((x) => x.id === editingTicketId)}
          onSave={async (ticket) => {
            if (editingTicketId.length > 0) {
              await updateTicket({
                ...ticket,
                id: editingTicketId,
              });
            } else {
              await createTicket(ticket);
            }
            setIsDrawerOpen(false);
          }}
        />
      </Drawer>
    </div>
  );
};

export default Estimation;
