// toolbar-items.config.ts
import {ToolbarItem} from "../models/toolbarItem.model";
import {Role} from "../../features/user/models/role.enum";

export const ToolbarItemsConfig: ToolbarItem[] = [
  {
    name: 'User List',
    route: 'users',
    roles: [Role.USER, Role.ADMIN]
  },
  {
    name: 'Add User',
    route: 'add-user',
    roles: [Role.ADMIN]
  }

  // Aggiungi qui altre voci
];
