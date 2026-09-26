import {User} from "../models/user";
import {createFeature, createReducer, on} from "@ngrx/store";
import {UserActions} from "./user.actions";

export interface UserState{
  users: User[];
  pagination: {totalElements: number; totalPages: number; pageSize: number; pageNumber: number};
  loading: boolean;
  error: string | null;
}

export const initialUserState: UserState = {
  users: [],
  pagination: {totalElements: 0, totalPages: 0, pageSize: 10, pageNumber: 0},
  loading: false,
  error: null
}

export const userFeature = createFeature({
  name: 'user',
  reducer: createReducer(
    initialUserState,

    on(
      UserActions.loadUsers,
      UserActions.addUser,
      UserActions.updateUser,
      UserActions.deleteUser,
      (state) => ({...state, loading: true, error: null})
    ),

    on(UserActions.loadUsersSuccess, (state,{response}) =>({
      ...state,
      users: response.content,
      pagination:{
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        pageSize: response.size,
        pageNumber: response.number
      },
      loading: false
    })),

    on(UserActions.addUserSuccess, (state, {user}) => ({
      ...state,
      users: [...state.users, user],
      loading: false
    })),

    on(UserActions.updateUserSuccess, (state, {user}) => ({
      ...state,
      users: state.users.map(u => (u.id === user.id ? user : u)),
      loading: false
    })),

    on(UserActions.deleteUserSuccess, (state, {id}) => ({
      ...state,
      users: state.users.filter(u => u.id !== id),
      loading: false
    })),

    on(
      UserActions.loadUsersFailure,
      UserActions.addUserFailure,
      UserActions.updateUserFailure,
      UserActions.deleteUserFailure,
      (state, {error}) => ({...state, loading:false, error}),
      ),

    on(UserActions.clearUsers, (state) => ({...state, users:[]})),
  ),
});
