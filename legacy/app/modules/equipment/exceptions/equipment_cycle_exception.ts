import { AppException } from '#exceptions/app_exception';

export class EquipmentCycleException extends AppException {
  constructor(message = 'Cycle detected in equipment hierarchy.') {
    super({ code: 'VALIDATION_ERROR', message });
    this.name = 'EquipmentCycleException';
  }
}
