import {Role} from "./role.enum";
import {Permission} from "./permission";

export class User {
  id!: number;
  email!: string;
  firstName!: string;
  lastName!: string;
  token!: string;
  role!: Role | string;
  authorities!: Permission[];
}

export class UserCreateUpdateDTO {
  firstName!: string;
  lastName!: string;
  email!: string;
  password!: string;
  role!: Role;
}

export class UserDTO {
  firstName!: string;
  lastName!: string;
  email!: string;
  role!: Role;
  authorities!: Permission[];
}
