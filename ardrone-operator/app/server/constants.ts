export class Constants {
  public static get WS_CONTROL_URL(): string { return "ws://localhost:9000" }
  public static get HTTP_CONTROL_URL(): string { return "http://localhost:9000" }
  public static get SERVER_PORT(): number { return 8000 }

  public static httpOperators(): string {
    return `${Constants.HTTP_CONTROL_URL}/rest/operators`
  }

  public static wsControlPath(operatorId: string): string {
    return `${Constants.WS_CONTROL_URL}/ws/api/${operatorId}`
  }

  public static wsVideoPath(operatorId: string): string {
    return `${Constants.WS_CONTROL_URL}/ws/video/${operatorId}`;
  }

  public static wsOperatorControlPath(): string {
    return `ws://localhost:${Constants.SERVER_PORT}/ws/api`
  }

  public static wsOperatorVideoPath(): string {
    return `ws://localhost:${Constants.SERVER_PORT}/ws/video`;
  }

}
