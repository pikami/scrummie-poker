import { useForm } from '@tanstack/react-form';
import { Button, ButtonColor, Input } from '../../../components';
import { PlayerVote } from '../../../lib/types/entityModels';
import { yupValidator } from '@tanstack/yup-form-adapter';
import * as yup from 'yup';

interface VoteListProps {
  className?: string;
  votes: PlayerVote[];
  revealed: boolean;
  setRevealed: (revealed: boolean) => Promise<void>;
  onSetEstimate: (estimate: string) => Promise<void>;
}

const EstimationResult: React.FC<VoteListProps> = ({
  className,
  revealed,
  votes,
  setRevealed,
  onSetEstimate,
}) => {
  const form = useForm({
    defaultValues: {
      estimate: '',
    },
    onSubmit: async ({ value }) => {
      await onSetEstimate(value.estimate);
    },
    validators: {
      onChange: yup.object({
        estimate: yup.string().label('Estimate').max(10).required(),
      }),
    },
    validatorAdapter: yupValidator(),
  });

  if (!revealed) {
    return votes.length > 0 ? (
      <div className="mt-4">
        <Button color={ButtonColor.Error} onClick={() => setRevealed(true)}>
          Reveal Votes
        </Button>
      </div>
    ) : null;
  }

  const numericVotes = votes
    .map((vote) => parseFloat(vote.estimate))
    .filter((vote) => !isNaN(vote));

  const averageVote =
    numericVotes.length > 0
      ? numericVotes.reduce((sum, vote) => sum + vote, 0) / numericVotes.length
      : null;

  return (
    <div className={className}>
      {averageVote !== null && (
        <div className="mb-4 text-lg font-semibold">
          Average Vote: {averageVote.toFixed(2)}
        </div>
      )}

      <form
        className="flex items-end gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field name="estimate">
          {(field) => (
            <Input
              label="Estimate"
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              errors={field.state.meta.errors}
            />
          )}
        </form.Field>
        <form.Subscribe selector={(state) => [state.canSubmit]}>
          {([canSubmit]) => (
            <Button type="submit" disabled={!canSubmit}>
              Save
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
};

export default EstimationResult;
