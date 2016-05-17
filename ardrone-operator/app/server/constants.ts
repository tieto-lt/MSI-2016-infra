export class Constants {
  public static get WS_CONTROL_URL(): string { return "ws://localhost:9000" }
  public static get HTTP_CONTROL_URL(): string { return "http://localhost:9000" }

  public static httpOperators(): string {
    return `${Constants.HTTP_CONTROL_URL}/rest/operators`
  }

  public static wsStatePath(operatorId: string): string {
    return `${Constants.WS_CONTROL_URL}/ws/api/${operatorId}`
  }
}
