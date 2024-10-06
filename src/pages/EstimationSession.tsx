import { getRouteApi } from '@tanstack/react-router';
import { useEstimationSessions } from '../lib/context/estimationSession';
import { useForm } from '@tanstack/react-form';
import { useUser } from '../lib/context/user';

const route = getRouteApi('/estimate/session/$sessionId');

const EstimationSession = () => {
  const { sessionId } = route.useParams();
  const user = useUser();
  const estimationSessions = useEstimationSessions();
  const estimationSession = estimationSessions?.current.find(
    (x) => x.$id == sessionId,
  );
  const tickets = estimationSessions?.getTickets(sessionId);
  const currentState = estimationSessions?.getState(sessionId);

  const createTicketForm = useForm({
    defaultValues: {
      name: '',
    },
    onSubmit: async ({ value }) => {
      await estimationSessions?.addTicket(sessionId, {
        Name: value.name,
      });
    },
  });

  return (
    <>
      <h1>Estimation Session - {estimationSession?.Name}</h1>
      <div>
        <h2>Tasks</h2>
        {tickets?.map((x) => (
          <div key={x.Id}>
            {x.Id} - {x.Name}
            <button
              onClick={() => estimationSessions?.selectTicket(sessionId, x.Id)}
            >
              Select
            </button>
          </div>
        ))}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            createTicketForm.handleSubmit();
          }}
        >
          <createTicketForm.Field
            name="name"
            children={(field) => (
              <input
                placeholder="Name"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
      {currentState?.CurrentTicketId && (
        <div>
          <h2>
            {currentState.CurrentTicketId} -{' '}
            {tickets?.find((x) => x.Id === currentState.CurrentTicketId)?.Name}
          </h2>
          {[0.5, 1, 2, 3, 5, 8, 13, 21].map((estimate) => (
            <button
              key={estimate}
              onClick={() =>
                estimationSessions?.voteEstimate(
                  sessionId,
                  currentState.CurrentTicketId,
                  estimate,
                  user.current?.$id ?? '',
                )
              }
            >
              {estimate}
            </button>
          ))}
          {currentState.VotesRevealed ? (
            <>
              <h3>Votes</h3>
              <ul>
                {currentState.Votes.map((vote) => (
                  <li key={vote.UserId}>
                    {vote.UserId} - {vote.Estimate}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <button onClick={() => estimationSessions?.revealVotes(sessionId)}>
              Reveal Votes
            </button>
          )}
        </div>
      )}
      <pre>Session Id: {sessionId}</pre>
    </>
  );
};

export default EstimationSession;
