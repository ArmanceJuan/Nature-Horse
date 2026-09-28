import { LoginUserUseCase } from "./login-user.usecase.js";
import type { LoginResult } from "./login-user.usecase.js";
import type { User } from "../../domain/entities/user.entity.js";
import { UnauthorizedError } from "../../domain/errors/http-errors.js";
import { buildUser } from "../../tests/builders/user.builder.js";
import { FakePasswordHasher } from "../../tests/fakes/fake-password-hasher.js";
import { FakeTokenService } from "../../tests/fakes/fake-token.service.js";
import { FakeTotpService } from "../../tests/fakes/fake-totp.service.js";
import { InMemoryUserRepository } from "../../tests/fakes/in-memory-user.repository.js";

const PASSWORD = "Password1!";

const build = (
  users: User[] = [buildUser({ password: `hashed:${PASSWORD}` })],
) => {
  const hasher = new FakePasswordHasher();
  const useCase = new LoginUserUseCase(
    new InMemoryUserRepository(users),
    hasher,
    new FakeTotpService(),
    new FakeTokenService(),
  );

  return { hasher, useCase };
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

    expect(session.user.id).toBe("user-1");
    expect(session.token).toBe("token:user-1:CLIENT");
  });

  it("accepts the email whatever its case", async () => {
    const { useCase } = build();

    const session = expectSession(
      await useCase.execute({
        email: " CLIENT@Example.com ",
        password: PASSWORD,
      }),
    );

    expect(session.user.id).toBe("user-1");
  });

  it("puts the role of the account in the token", async () => {
    const { useCase } = build([
      buildUser({ role: "ADMIN", password: `hashed:${PASSWORD}` }),
    ]);

    const session = expectSession(
      await useCase.execute({
        email: "client@example.com",
        password: PASSWORD,
      }),
    );

    expect(session.token).toBe("token:user-1:ADMIN");
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

  it("treats an email that is not valid like an unknown account", async () => {
    const { hasher, useCase } = build();

    await expect(
      useCase.execute({ email: "not-an-email", password: PASSWORD }),
    ).rejects.toBeInstanceOf(UnauthorizedError);
    expect(hasher.simulations).toBe(1);
  });

  it("gives the same answer for an unknown account and for a wrong password", async () => {
    const { useCase } = build();

    const unknown = await useCase
      .execute({ email: "ghost@example.com", password: PASSWORD })
      .catch((error) => error);
    const wrong = await useCase
      .execute({ email: "client@example.com", password: "Wrong1!" })
      .catch((error) => error);

    expect(unknown.message).toBe(wrong.message);
    expect(unknown.statusCode).toBe(wrong.statusCode);
  });

  it("asks for a code when two-factor authentication is enabled and none is given", async () => {
    const { useCase } = build([otpUser()]);

    const result = await useCase.execute({
      email: "client@example.com",
      password: PASSWORD,
    });

    expect(result).toEqual({ requiresOtp: true });
    expect("token" in result).toBe(false);
  });

  it("opens the session when the code is right", async () => {
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

  it("refuses a wrong code", async () => {
    const { useCase } = build([otpUser()]);

    await expect(
      useCase.execute({
        email: "client@example.com",
        password: PASSWORD,
        code: "000000",
      }),
    ).rejects.toMatchObject({ statusCode: 401, message: "Invalid OTP code" });
  });

  it("refuses a code when the account has no secret", async () => {
    const user = buildUser({
      password: `hashed:${PASSWORD}`,
      otpEnabled: true,
      otpSecret: null,
    });
    const { useCase } = build([user]);

    await expect(
      useCase.execute({
        email: "client@example.com",
        password: PASSWORD,
        code: FakeTotpService.VALID_CODE,
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
