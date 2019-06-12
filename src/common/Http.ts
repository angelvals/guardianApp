import { environment } from '../environments/environment';

/**
 * It is a class for all global constants/strings.
 */
export class PresentationUrlEndpointInfo {
  static get keys(): Keys {
    return {
      users: 'user/',
      usersession: 'user/sess',
      logout: 'user/logout',
      sendPush: 'push/sendNotification',
      registerPush: 'push/register',
      unRegisterPush: 'push/unRegister',
      post: 'post/',
    };
  }

  static get baseUrl(): string {
    return environment.baseUrl;
  }

  static get loginUrl(): string {
    return `${this.baseUrl}/auth/login`;
  }

  static get serviceUrl(): string {
    return `${this.baseUrl}`;
  }
}

interface Keys {
  users: string;
  usersession: string;
  logout: string;
  sendPush: string;
  registerPush: string;
  unRegisterPush: string;
  post: string;
}
