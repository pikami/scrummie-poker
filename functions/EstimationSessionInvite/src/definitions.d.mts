declare type AppwriteRequest = {
  bodyRaw: string;
  body: Object;
  headers: Object;
  scheme: string;
  method: string;
  url: string;
  host: string;
  port: number;
  path: string;
  queryString: string;
  query: Object;
};

declare type AppwriteSendReturn = {
  body: any;
  statusCode: number;
  headers: Object;
};

declare type AppwriteResponse = {
  empty: () => AppwriteSendReturn;
  json: (obj: any, statusCode?: number, headers?: Object) => AppwriteSendReturn;
  text: (text: string) => AppwriteSendReturn;
  redirect: (
    url: string,
    statusCode?: number,
    headers?: Object,
  ) => AppwriteSendReturn;
  send: (
    body: any,
    statusCode?: number,
    headers?: Object,
  ) => AppwriteSendReturn;
};

declare type AppwriteRuntimeContext = {
  req: AppwriteRequest;
  res: AppwriteResponse;
  log: (message: any) => void;
  error: (message: any) => void;
};

export {
  AppwriteRequest,
  AppwriteSendReturn,
  AppwriteResponse,
  AppwriteRuntimeContext,
};
