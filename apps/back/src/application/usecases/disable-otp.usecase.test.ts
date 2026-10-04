import { DisableOtpUseCase } from "./disable-otp.usecase.js";
import {
  ConflictError,
  UnauthorizedError,
  ValidationError,
} from "../../domain/errors/http-errors.js";
import { buildUser } from "../../tests/builders/user.builder.js";
import { FakePasswordHasher } from "../../tests/fakes/fake-password-hasher.js";
import { InMemoryTwoFactorRepository } from "../../tests/fakes/in-memory-two-factor.repository.js";
import { InMemoryUserRepository } from "../../tests/fakes/in-memory-user.repository.js";

const PASSWORD = "Password1!";

const build = (otpEnabled = true) => {
  const users = new InMemoryUserRepository([
    buildUser({ id: "u1", password: `hashed:${PASSWORD}`, otpEnabled }),
  ]);
  const twoFactor = new InMemoryTwoFactorRepository(
    otpEnabled
      ? { u1: { secret: "SECRET", backupCodeHashes: ["hashed:CODE1"] } }
      : {},
    users,
  );
  const useCase = new DisableOtpUseCase(
    users,
    twoFactor,
    new FakePasswordHasher(),
  );

  return { twoFactor, useCase };
};

describe("DisableOtpUseCase", () => {
  it("disables two-factor authentication with the right password", async () => {
    const { twoFactor, useCase } = build();

    await useCase.execute({ userId: "u1", password: PASSWORD });

    expect(twoFactor.disabledUserIds).toEqual(["u1"]);
    expect(await twoFactor.getBackupCodeHashes("u1")).toEqual([]);
  });

  it("refuses a wrong password and disables nothing", async () => {
    const { twoFactor, useCase } = build();

    await expect(
      useCase.execute({ userId: "u1", password: "Wrong1!" }),
    ).rejects.toBeInstanceOf(ValidationError);
    expect(twoFactor.disabledUserIds).toEqual([]);
  });

  it("refuses to disable when it is not enabled", async () => {
    const { useCase } = build(false);

    await expect(
      useCase.execute({ userId: "u1", password: PASSWORD }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("refuses an unknown user", async () => {
    const { useCase } = build();

    await expect(
      useCase.execute({ userId: "ghost", password: PASSWORD }),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
