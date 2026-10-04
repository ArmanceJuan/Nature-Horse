import { LoginUserUseCase } from "./login-user.usecase.js";
import type { LoginResult } from "./login-user.usecase.js";
import type { User } from "../../domain/entities/user.entity.js";
import { UnauthorizedError } from "../../domain/errors/http-errors.js";
import { buildUser } from "../../tests/builders/user.builder.js";
import { FakePasswordHasher } from "../../tests/fakes/fake-password-hasher.js";
import { FakeTokenService } from "../../tests/fakes/fake-token.service.js";
import { FakeTotpService } from "../../tests/fakes/fake-totp.service.js";
import { InMemoryTwoFactorRepository } from "../../tests/fakes/in-memory-two-factor.repository.js";
import { InMemoryUserRepository } from "../../tests/fakes/in-memory-user.repository.js";

const PASSWORD = "Password1!";

const build = (
  users: User[] = [buildUser({ password: `hashed:${PASSWORD}` })],
  twoFactorSeed: Record<
    string,
    { secret: string; backupCodeHashes: string[] }
  > = {},
) => {
  const hasher = new FakePasswordHasher();
  const twoFactor = new InMemoryTwoFactorRepository(twoFactorSeed);
  const useCase = new LoginUserUseCase(
    new InMemoryUserRepository(users),
    hasher,
    new FakeTotpService(),
    new FakeTokenService(),
    twoFactor,
  );

  return { hasher, twoFactor, useCase };
};

const expectSession = (result: LoginResult) => {
  if (result.requiresOtp) {
    throw new Error("A session was expected");
  }

  return result;
};

const otpUser = () =>
  buildUser({
    password: `hashed:${PASSWORD}`,
    otpEnabled: true,
    otpSecret: FakeTotpService.SECRET,
  });

describe("LoginUserUseCase", () => {
  it("opens a session for valid credentials", async () => {
    const { useCase } = build();

    const session = expectSession(
      await useCase.execute({
        email: "client@example.com",
        password: PASSWORD,
      }),
    );

    expect(session.token).toBe("token:user-1:CLIENT");
  });

  it("refuses a wrong password", async () => {
    const { useCase } = build();

    await expect(
      useCase.execute({ email: "client@example.com", password: "Wrong1!" }),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("refuses an unknown account and spends the same effort as for a known one", async () => {
    const { hasher, useCase } = build();

    await expect(
      useCase.execute({ email: "ghost@example.com", password: PASSWORD }),
    ).rejects.toBeInstanceOf(UnauthorizedError);
    expect(hasher.simulations).toBe(1);
  });

  it("asks for a code when two-factor authentication is enabled and none is given", async () => {
    const { useCase } = build([otpUser()]);

    const result = await useCase.execute({
      email: "client@example.com",
      password: PASSWORD,
    });

    expect(result).toEqual({ requiresOtp: true });
  });

  it("opens the session when the TOTP code is right", async () => {
    const { useCase } = build([otpUser()]);

    const session = expectSession(
      await useCase.execute({
        email: "client@example.com",
        password: PASSWORD,
        code: FakeTotpService.VALID_CODE,
      }),
    );

    expect(session.token).toBe("token:user-1:CLIENT");
  });

  it("opens the session with a valid backup code", async () => {
    const { useCase } = build([otpUser()], {
      "user-1": { secret: "irrelevant", backupCodeHashes: ["hashed:CODE1"] },
    });

    const session = expectSession(
      await useCase.execute({
        email: "client@example.com",
        password: PASSWORD,
        code: "CODE1",
      }),
    );

    expect(session.token).toBe("token:user-1:CLIENT");
  });

  it("consumes the backup code so it cannot be used a second time", async () => {
    const { twoFactor, useCase } = build([otpUser()], {
      "user-1": { secret: "irrelevant", backupCodeHashes: ["hashed:CODE1"] },
    });

    await useCase.execute({
      email: "client@example.com",
      password: PASSWORD,
      code: "CODE1",
    });

    await expect(
      useCase.execute({
        email: "client@example.com",
        password: PASSWORD,
        code: "CODE1",
      }),
    ).rejects.toMatchObject({ statusCode: 401, message: "Invalid OTP code" });
    expect(await twoFactor.getBackupCodeHashes("user-1")).toEqual([]);
  });

  it("leaves the other backup codes usable after one is consumed", async () => {
    const { useCase } = build([otpUser()], {
      "user-1": {
        secret: "irrelevant",
        backupCodeHashes: ["hashed:CODE1", "hashed:CODE2"],
      },
    });

    await useCase.execute({
      email: "client@example.com",
      password: PASSWORD,
      code: "CODE1",
    });

    await expect(
      useCase.execute({
        email: "client@example.com",
        password: PASSWORD,
        code: "CODE2",
      }),
    ).resolves.toBeDefined();
  });

  it("refuses a wrong code that is neither the TOTP code nor a backup code", async () => {
    const { useCase } = build([otpUser()], {
      "user-1": { secret: "irrelevant", backupCodeHashes: ["hashed:CODE1"] },
    });

    await expect(
      useCase.execute({
        email: "client@example.com",
        password: PASSWORD,
        code: "000000",
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("does not ask for the code before the password has been checked", async () => {
    const { useCase } = build([otpUser()]);

    await expect(
      useCase.execute({ email: "client@example.com", password: "Wrong1!" }),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
