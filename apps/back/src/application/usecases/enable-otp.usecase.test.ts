import { EnableOtpUseCase } from "./enable-otp.usecase.js";
import {
  ConflictError,
  UnauthorizedError,
  ValidationError,
} from "../../domain/errors/http-errors.js";
import { buildUser } from "../../tests/builders/user.builder.js";
import { FakeBackupCodeGenerator } from "../../tests/fakes/fake-backup-code.generator.js";
import { FakePasswordHasher } from "../../tests/fakes/fake-password-hasher.js";
import { FakeTotpService } from "../../tests/fakes/fake-totp.service.js";
import { InMemoryTwoFactorRepository } from "../../tests/fakes/in-memory-two-factor.repository.js";
import { InMemoryUserRepository } from "../../tests/fakes/in-memory-user.repository.js";

const PASSWORD = "Password1!";

const build = () => {
  const users = new InMemoryUserRepository([
    buildUser({ id: "u1", password: `hashed:${PASSWORD}` }),
  ]);
  const twoFactor = new InMemoryTwoFactorRepository({}, users);
  const useCase = new EnableOtpUseCase(
    users,
    twoFactor,
    new FakeTotpService(),
    new FakeBackupCodeGenerator(),
    new FakePasswordHasher(),
  );

  return { twoFactor, useCase };
};

const validInput = {
  userId: "u1",
  password: PASSWORD,
  secret: FakeTotpService.SECRET,
  code: FakeTotpService.VALID_CODE,
};

describe("EnableOtpUseCase", () => {
  it("stores the secret with hashed backup codes when the password and the code are right", async () => {
    const { twoFactor, useCase } = build();

    await useCase.execute(validInput);

    expect(twoFactor.enabled).toEqual([
      {
        userId: "u1",
        secret: FakeTotpService.SECRET,
        backupCodeHashes: [
          "hashed:CODE1",
          "hashed:CODE2",
          "hashed:CODE3",
          "hashed:CODE4",
          "hashed:CODE5",
        ],
      },
    ]);
  });

  it("returns the backup codes in clear, once", async () => {
    const { useCase } = build();

    const result = await useCase.execute(validInput);

    expect(result.backupCodes).toEqual([
      "CODE1",
      "CODE2",
      "CODE3",
      "CODE4",
      "CODE5",
    ]);
  });

  it("refuses a wrong password and stores nothing", async () => {
    const { twoFactor, useCase } = build();

    await expect(
      useCase.execute({ ...validInput, password: "Wrong1!" }),
    ).rejects.toBeInstanceOf(ValidationError);
    expect(twoFactor.enabled).toEqual([]);
  });

  it("refuses a wrong code and stores nothing", async () => {
    const { twoFactor, useCase } = build();

    await expect(
      useCase.execute({ ...validInput, code: "000000" }),
    ).rejects.toBeInstanceOf(ValidationError);
    expect(twoFactor.enabled).toEqual([]);
  });

  it("refuses to enable twice", async () => {
    const { useCase } = build();

    await useCase.execute(validInput);

    await expect(useCase.execute(validInput)).rejects.toBeInstanceOf(
      ConflictError,
    );
  });

  it("refuses an unknown user", async () => {
    const { useCase } = build();

    await expect(
      useCase.execute({ ...validInput, userId: "ghost" }),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
