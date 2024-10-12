import React from 'react';
import { EntityModels } from '../../../lib/types';

interface PlayerListProps {
  players: EntityModels.Player[];
  title?: string;
}

const PlayerList: React.FC<PlayerListProps> = ({
  players,
  title = 'Players',
}) => {
  return (
    <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg dark:bg-nero-800">
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h2>

      <ul className="max-h-48 divide-y divide-gray-300 overflow-y-auto dark:divide-gray-600">
        {players.length > 0 ? (
          players.map((player, index) => (
            <li
              key={index}
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
    </div>
  );
};

export default PlayerList;
