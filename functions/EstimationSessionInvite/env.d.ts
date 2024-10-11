declare module 'bun' {
  interface Env {
    APPWRITE_FUNCTION_API_ENDPOINT: string;
    APPWRITE_FUNCTION_PROJECT_ID: string;
    APPWRITE_DATABASE_ID: string;
    APPWRITE_ESTIMATION_SESSION_COLLECTION_ID: string;
  }
}

export {};
