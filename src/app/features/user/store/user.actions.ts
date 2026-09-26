import {createActionGroup, emptyProps, props} from "@ngrx/store";
import {PagedResponse} from "../../../shared/models/paged-response";
import {User} from "../models/user";


export const UserActions = createActionGroup({
  source: 'User',
  events: {
    'Load Users': props<{ currentUserId: number | undefined; email: string; page: number; size: number }>(),
    'Load Users Success': props<{ response: PagedResponse<User> }>(),
    'Load Users Failure': props<{ error: string }>(),

    'Add User': props<{ user: Partial<User> }>(),
    'Add User Success': props<{ user: User }>(),
    'Add User Failure': props<{ error: string }>(),

    'Update User': props<{ id: number; user: Partial<User> }>(),
    'Update User Success': props<{ user: User }>(),
    'Update User Failure': props<{ error: string }>(),

    'Delete User': props<{ id: number }>(),
    'Delete User Success': props<{ id: number }>(),
    'Delete User Failure': props<{ error: string }>(),

    'Clear Users': emptyProps(),
  }
})
