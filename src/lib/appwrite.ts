import { Client, Account, Databases, Functions } from 'appwrite';

export const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export { ID } from 'appwrite';

export const account = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);

export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const ESTIMATION_SESSION_COLLECTION_ID = import.meta.env
  .VITE_APPWRITE_ESTIMATION_SESSION_COLLECTION_ID;
export const SESSION_INVITE_FUNCTION_ID = import.meta.env
  .VITE_SESSION_INVITE_FUNCTION_ID;
