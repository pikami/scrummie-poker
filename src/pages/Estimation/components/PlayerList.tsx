import React from 'react';
import { EntityModels } from '../../../lib/types';
import CopyInput from '../../../components/CopyInput';

interface PlayerListProps {
  sessionId: string;
  players: EntityModels.Player[];
  title?: string;
}

const PlayerList: React.FC<PlayerListProps> = ({
  sessionId,
  players,
  title = 'Players',
}) => {
  return (
    <div className="flex w-full max-w-sm flex-col justify-between rounded-lg bg-white p-6 shadow-lg dark:bg-nero-800">
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h2>

      <ul className="flex-grow divide-y divide-gray-300 overflow-y-auto dark:divide-gray-600">
        {players.length > 0 ? (
          players.map((player) => (
            <li
              key={player.userId}
              className="py-2 text-sm text-gray-900 dark:text-gray-100"
            >
              {player.name}
            </li>
          ))
        ) : (
          <li className="text-sm text-gray-500 dark:text-gray-400">
            No players available
          </li>
        )}
      </ul>

      <div className="flex flex-row flex-wrap items-center justify-center gap-2">
        <div className="text-l align-middle font-semibold">
          Invite others to join your session
        </div>
        <CopyInput value={`${window.location.origin}/join/${sessionId}`} />
      </div>
    </div>
  );
};

export default PlayerList;
