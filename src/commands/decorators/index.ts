import { ICommand } from '../Command';

export interface CommandExecutePropertyDescriptor extends PropertyDescriptor {
  value?: ICommand['execute'];
}

export * from './Paginated';
export * from './Restricted';