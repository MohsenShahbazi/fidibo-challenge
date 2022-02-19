import {ILogin} from '../interface/ILogin';
import {IAuthority} from '../interface/IAuthority';


export  class LoginModel implements ILogin {
  authorities: IAuthority[];
  description: string;
  email: string;
  firstName: string;
  lastName: string;
  login: string;
  password: string;
  picture: string[];
  status: number;
  uuid: string;
}
