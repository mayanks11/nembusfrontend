import { LOAD_RUN_DATA, SET_RUN_DATA_LOADING } from './types';

/*
  Plot Analysis Run Data Action
  Nirmalya Saha
*/

export const loadRunData = (data) => ({
  type: LOAD_RUN_DATA,
  payload: data
});

export const setIsLoading = (data) => ({
  type: SET_RUN_DATA_LOADING,
  payload: data
});