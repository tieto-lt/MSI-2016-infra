
type State = "Initialized" | "Connected" |  "Idle"

export class OperatorState {

    constructor(public state: State, public id: String) {}
}
