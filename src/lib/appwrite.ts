import { Client, Account, Databases } from 'appwrite';
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from '../constants';

export const client = new Client();

client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);

export { ID } from 'appwrite';

export const account = new Account(client);
export const databases = new Databases(client);
