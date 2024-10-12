import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { useUser } from '../lib/context/user';

const Header = () => {
  const { current, isLoading, logout } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (isLoading || !current) {
    return null;
  }

  const userName =
    current.name.length > 0 ? current.name : `Guest - ${current.$id}`;

  return (
    <header className="bg-white shadow-md transition-colors dark:bg-nero-700">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link
            to="/"
            className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100"
          >
            Scrummie-Poker
          </Link>
        </div>

        <div className="relative lg:flex lg:flex-1 lg:justify-end">
          <button
            className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100"
            onClick={toggleDropdown}
          >
            {userName} <span aria-hidden="true">&darr;</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 z-10 mt-10 w-48 rounded-md bg-white shadow-lg dark:bg-nero-800">
              <Link
                className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-nero-700"
                to="/profile"
              >
                Profile
              </Link>
              <Link
                className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-nero-700"
                onClick={() => logout()}
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
