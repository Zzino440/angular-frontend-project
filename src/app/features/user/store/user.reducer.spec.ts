import {initialUserState, userFeature} from './user.reducer';
import {UserActions} from './user.actions';
import {User} from '../models/user';

describe('user reducer', () => {
  const reducer = userFeature.reducer;
  const user = {id: 1, email: 'a@a.it'} as User;

  it('loadUsers imposta loading e azzera error', () => {
    const state = reducer({...initialUserState, error: 'x'}, UserActions.loadUsers({
      currentUserId: 1, email: 'a@a.it', page: 0, size: 10,
    }));
    expect(state.loading).toBeTrue();
    expect(state.error).toBeNull();
  });

  it('addUserSuccess aggiunge l\'utente senza mutare lo stato precedente', () => {
    const before = {...initialUserState, loading: true};
    const after = reducer(before, UserActions.addUserSuccess({user}));
    expect(after.users).toEqual([user]);
    expect(before.users).toEqual([]);       // immutabilità
    expect(after.loading).toBeFalse();
  });

  it('deleteUserSuccess rimuove per id', () => {
    const before = {...initialUserState, users: [user]};
    expect(reducer(before, UserActions.deleteUserSuccess({id: 1})).users).toEqual([]);
  });
});
