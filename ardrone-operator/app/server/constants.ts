import { Configuration } from '../config'

export class Constants {

  public static wsControlPath(operatorId: string): string {
    return `${Configuration.wsControlUrl}/ws/api/${operatorId}`
  }

  public static wsVideoPath(operatorId: string): string {
    return `${Configuration.wsControlUrl}/ws/video/${operatorId}`;
  }

  public static wsOperatorControlPath(): string {
    return `ws://localhost:${Configuration.serverPort}/ws/api`
  }

  public static wsOperatorVideoPath(): string {
    return `ws://localhost:${Configuration.serverPort}/ws/video`;
  }

}
