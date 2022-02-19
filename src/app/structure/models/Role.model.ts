import {IRole} from '../interface/IRole';

export  class RoleModel implements IRole{
  authority: string;
  description: string;
  title: string;
  uuid: string;

  constructor(authority ?: string, description ?: string, title ?: string, uuid ?: string) {
    this.authority = authority;
    this.description = description;
    this.title = title;
    this.uuid = uuid;
  }
}
