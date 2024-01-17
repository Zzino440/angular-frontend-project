import {RegisterRequest} from "../../../security/models/register-request";

export interface User extends RegisterRequest{
  id: number;
  role: string;
  enabled: boolean;
  authorities: Authority[];
  username: string;
  credentialsNonExpired: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
}

export interface Authority {
  authority: string
}
