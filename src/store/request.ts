import React from 'react';
import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

type RequestState = {
  endpoint: string;
  setEndpoint: (key: string) => void;
  method: string;
  setMethod: (key: string) => void;
  rawParamsBody: string;
  setRawParamsBody: (key: string) => void;
  response: string;
  setResponse: (key: string) => void;
};

export const requestUseStore = create(
  immer<RequestState>((set, get) => ({
    endpoint: '',
    setEndpoint: (endpoint) => {
      set({ endpoint });
    },
    method: '',
    setMethod: (method) => {
      set({ method });
    },
    rawParamsBody: '',
    setRawParamsBody: (rawParamsBody) => {
      set({ rawParamsBody });
    },
    response: '',
    setResponse: (response) => {
      set({ response });
    },
  })),
);
