

const PING_INTERVAL = 5000;
const AWAY_THRESHOLD = 60000;
const CHECK_INTERVAL = 30000;

export class Operator {
  constructor(public connection: any, public lastPing: Date) {}
}

export class OperatorsManager {

  private connections = new Map<string, Operator>();

  registerOperator(operatorId: string) {
    this.connections.set(operatorId, new Operator(undefined, new Date()));
  }

  getConnection(operatorId: string): any {
    let operator = this.connections.get(operatorId);
    return operator && operator.connection;
  }

  registerConnection(operatorId: string, ws: any) {
    this.connections.set(operatorId, new Operator(ws, new Date()));
    ws.addEventListener('pong', (data, flags) => {
      let operator = this.connections.get(operatorId);
      if (operator) {
          operator.lastPing = new Date();
      }
    });
    // set interval for removin from connections map
    let pingInterval = setInterval(() => ws.ping("Are you alive?"), PING_INTERVAL);
    let connectionsMaintenanceInterval = setInterval(() => {
      let connection = this.connections.get(operatorId);
      let isOutdated = !connection || (new Date().getTime() - connection.lastPing.getTime()) > AWAY_THRESHOLD
      if (isOutdated) {
        clearInterval(pingInterval);
        clearInterval(connectionsMaintenanceInterval);
        this.connections.delete(operatorId);
      };
    }, CHECK_INTERVAL);
  }
}
