import {selectHasUsers} from './user.selectors';
import {User} from '../models/user';

describe('selectHasUsers', () => {
  it('false con lista vuota', () => expect(selectHasUsers.projector([])).toBeFalse());
  it('true con almeno un utente', () => expect(selectHasUsers.projector([{id: 1} as User])).toBeTrue());
});
