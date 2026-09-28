import { RandomBackupCodeGenerator } from "./random-backup-code.generator.js";

describe("RandomBackupCodeGenerator", () => {
  const generator = new RandomBackupCodeGenerator();

  it("generates the requested number of codes", () => {
    expect(generator.generate(5)).toHaveLength(5);
    expect(generator.generate(0)).toEqual([]);
  });

  it("generates codes of eight uppercase hexadecimal characters", () => {
    generator.generate(10).forEach((code) => {
      expect(code).toMatch(/^[0-9A-F]{8}$/);
    });
  });

  it("does not generate the same code twice in a batch", () => {
    expect(new Set(generator.generate(20)).size).toBe(20);
  });
});
