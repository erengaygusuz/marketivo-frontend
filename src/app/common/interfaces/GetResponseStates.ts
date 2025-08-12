import { State } from '../models/state';

export interface GetResponseStates {
    _embedded: {
        states: State[];
    };
}
