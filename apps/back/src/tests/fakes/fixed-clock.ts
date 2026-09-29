import type { IClock } from "../../domain/interfaces/clock.interface.js";

export class FixedClock implements IClock {
  private readonly instant: Date;

  constructor(instant: Date) {
    this.instant = instant;
  }

  now(): Date {
    return new Date(this.instant.getTime());
  }
}
