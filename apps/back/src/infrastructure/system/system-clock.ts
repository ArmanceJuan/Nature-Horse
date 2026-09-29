import type { IClock } from "../../domain/interfaces/clock.interface.js";

export class SystemClock implements IClock {
  now(): Date {
    return new Date();
  }
}
