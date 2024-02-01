import {Role} from "./role.enum";

export class User {
  id!: number;
  email!:string;
  firstName!: string;
  lastName!: string;
  token!:string;
  role!: Role;
}
