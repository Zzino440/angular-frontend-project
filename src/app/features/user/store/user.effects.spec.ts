import {of, throwError} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {Action} from '@ngrx/store';
import {loadUsers} from './user.effects';
import {UserActions} from './user.actions';
import {UserService} from '../services/user.service';
import {User} from '../models/user';
import {PagedResponse} from '../../../shared/models/paged-response';

describe('loadUsers effect', () => {
  const action = UserActions.loadUsers({currentUserId: 1, email: 'a@a.it', page: 0, size: 10});
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    userService = jasmine.createSpyObj<UserService>('UserService', ['getUserListExceptCurrent']);
  });

  it('emette loadUsersSuccess con la risposta del service', () => {
    const response = {content: [{id: 1} as User]} as PagedResponse<User>;
    userService.getUserListExceptCurrent.and.returnValue(of(response));

    const emitted: Action[] = [];
    loadUsers(of(action), userService).subscribe(a => emitted.push(a));

    expect(userService.getUserListExceptCurrent).toHaveBeenCalledWith(1, 'a@a.it', 0, 10);
    expect(emitted).toEqual([UserActions.loadUsersSuccess({response})]);
  });

  it('emette loadUsersFailure se il service va in errore', () => {
    userService.getUserListExceptCurrent.and.returnValue(
      throwError(() => new HttpErrorResponse({error: 'boom'})),
    );

    const emitted: Action[] = [];
    loadUsers(of(action), userService).subscribe(a => emitted.push(a));

    expect(emitted).toEqual([UserActions.loadUsersFailure({error: 'boom'})]);
  });
});
