import {Role} from "./role.enum";
import {Permission} from "./permission";
import {FormControl} from "@angular/forms";

export class User {
  id!: number;
  email!: string;
  firstName!: string;
  lastName!: string;
  token!: string;
  role!: Role;
  authorities!: Permission[];
}

export interface UserForm {
  firstName:FormControl<string>;
  lastName:FormControl<string>;
  email:FormControl<string>;
  password:FormControl<string>;
  role:FormControl<Role | string>;
}
