import { OperatorState } from '../server/models/operator_state';

export interface ControlApi {
  initializeOperator(): OperatorState
}
