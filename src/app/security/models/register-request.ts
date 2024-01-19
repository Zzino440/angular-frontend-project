import {LoginRequest} from "./login-request";

export interface RegisterRequest extends LoginRequest {
  firstName: string;
  lastName: string;
}
