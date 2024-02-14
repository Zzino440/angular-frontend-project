import {Role} from "../../features/user/models/role.enum";

export interface ToolbarItem {
  name: string;
  route: string;
  roles:Role[];
  // Aggiungi qui altre proprietà se necessario
}
