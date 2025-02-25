import {Role} from "./role.enum";
import {Permission} from "./permission";

export class User {
  id!: number;
  email!: string;
  firstName!: string;
  lastName!: string;
  token!: string;
  role!: Role;
  authorities!: Permission[];
}
