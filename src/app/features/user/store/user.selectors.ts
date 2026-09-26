import {userFeature} from "./user.reducer";
import {createSelector} from "@ngrx/store";


export const selectHasUsers = createSelector(
  userFeature.selectUsers,
  (users) => users.length > 0
)
