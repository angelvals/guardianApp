import { environment } from '../environments/environment';

/**
 * It is a class for all global constants/strings.
 */
export class PresentationUrlEndpointInfo {
  static get keys(): Keys {
    return {
      usersession: 'user/sess',
      sendPush: 'push/sendNotification',
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
  usersession: string;
  sendPush: string;
}
