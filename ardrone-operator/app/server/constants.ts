import { Configuration } from '../config'

export class Constants {

  public static missionFinishedUrl(missionId: string) {
    return `${Configuration.httpControlUrl}/api/missions/${missionId}`
  }

  public static retrieveMissionsUrl() {
    return `${Configuration.httpControlUrl}/api/missions/`
  }

  public static reserveMissionsUrl(missionId) {
    return `${Configuration.httpControlUrl}/api/missions/${missionId}/reserve`
  }

  public static wsControlPath(operatorToken: string): string {
    return `${Configuration.wsControlUrl}/ws/api/${operatorToken}`
  }

  public static wsVideoPath(operatorToken: string): string {
    return `${Configuration.wsControlUrl}/ws/video/${operatorToken}`;
  }

  public static wsOperatorControlPath(): string {
    return `ws://localhost:${Configuration.serverPort}/ws/api`
  }

  public static wsOperatorVideoPath(): string {
    return `ws://localhost:${Configuration.serverPort}/ws/video`;
  }

}
