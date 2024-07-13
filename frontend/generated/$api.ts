import type { Methods as Methods_1lgtes2 } from './ping';
import type { AspidaClient, BasicHeaders } from 'aspida';

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? 'https://localhost:3000/api' : baseURL).replace(/\/$/, '');
  const PATH0 = '/ping';
  const GET = 'GET';

  return {
    ping: {
      /**
       * @returns success
       */
      get: (option?: { config?: T | undefined } | undefined) =>
        fetch<Methods_1lgtes2['get']['resBody'], BasicHeaders, Methods_1lgtes2['get']['status']>(prefix, PATH0, GET, option).json(),
      /**
       * @returns success
       */
      $get: (option?: { config?: T | undefined } | undefined) =>
        fetch<Methods_1lgtes2['get']['resBody'], BasicHeaders, Methods_1lgtes2['get']['status']>(prefix, PATH0, GET, option).json().then(r => r.body),
      $path: () => `${prefix}${PATH0}`,
    },
  };
};

export type ApiInstance = ReturnType<typeof api>;
export default api;
