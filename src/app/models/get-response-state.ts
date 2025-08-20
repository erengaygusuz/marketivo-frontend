import { State } from './state';

export interface GetResponseState {
    _embedded: {
        states: State[];
    };
}
