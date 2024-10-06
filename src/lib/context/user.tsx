import { ID, Models } from 'appwrite';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { account } from '../appwrite';

interface UserContextType {
  current: Models.Session | Models.User<Models.Preferences> | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = (props: PropsWithChildren) => {
  const [user, setUser] = useState<
    Models.Session | Models.User<Models.Preferences> | null
  >(null);

  const login = async (email: string, password: string) => {
    const loggedIn = await account.createEmailPasswordSession(email, password);
    setUser(loggedIn);
    window.location.replace('/'); // you can use different redirect method for your application
  };

  const logout = async () => {
    await account.deleteSession('current');
    setUser(null);
  };

  const register = async (email: string, password: string) => {
    await account.create(ID.unique(), email, password);
    await login(email, password);
  };

  const loginAsGuest = async () => {
    const session = await account.createAnonymousSession();
    setUser(session);
    window.location.replace('/'); // you can use different redirect method for your application
  };

  const init = async () => {
    try {
      const loggedIn = await account.get();
      setUser(loggedIn);
    } catch (err) {
      setUser(null);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <UserContext.Provider
      value={{ current: user, login, logout, register, loginAsGuest }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
