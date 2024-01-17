// toolbar-items.config.ts
import {ToolbarItem} from "../models/toolbarItem.model";

export const ToolbarItemsConfig: ToolbarItem[] = [
  {id: 1, name: 'User List', route: '/users', requiresAuth: true},
  {id: 2, name: 'Add User', route: '/add-user', requiresAuth: true}
  // Aggiungi qui altre voci
];
