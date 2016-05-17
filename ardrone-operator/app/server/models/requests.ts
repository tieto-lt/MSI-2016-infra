
//
// Model for communication between operator and controller
//

export class BaseRequest {
  clientId: String;
}

export class Ping extends BaseRequest {
  time: Date;
}
