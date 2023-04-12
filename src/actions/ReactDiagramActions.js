import {SET_PROPAGATOR_COUNT} from './types';

export const setPropagatorCount = (value) => ({
    type: SET_PROPAGATOR_COUNT,
    payload: value,
});