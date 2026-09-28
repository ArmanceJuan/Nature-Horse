import { RegisterUserUseCase } from "./register-user.usecase.js";
import type { User } from "../../domain/entities/user.entity.js";
import {
  ConflictError,
  ValidationError,
} from "../../domain/errors/http-errors.js";
import { Email } from "../../domain/value-objects/email.js";
import { buildUser } from "../../tests/builders/user.builder.js";
import { FakePasswordHasher } from "../../tests/fakes/fake-password-hasher.js";
import { InMemoryUserRepository } from "../../tests/fakes/in-memory-user.repository.js";

const build = (users: User[] = []) => {
  const repository = new InMemoryUserRepository(users);

  return {
    repository,
    useCase: new RegisterUserUseCase(repository, new FakePasswordHasher()),
  };
};

const input = {
  email: "  Marie@Example.com ",
  password: "Password1!",
  firstName: " Marie ",
  lastName: "Martin",
};

describe("RegisterUserUseCase", () => {
  it("creates a client account with a normalized email and trimmed names", async () => {
    const { useCase } = build();

    const user = await useCase.execute(input);

    expect(user.email).toBe("marie@example.com");
    expect(user.firstName).toBe("Marie");
    expect(user.role).toBe("CLIENT");
    expect(user.otpEnabled).toBe(false);
  });

  it("never stores the password in clear", async () => {
    const { useCase } = build();

    const user = await useCase.execute(input);

    expect(user.password).not.toBe("Password1!");
    expect(user.password).toBe("hashed:Password1!");
  });

  it("stores the account so it can be found again", async () => {
    const { repository, useCase } = build();

    await useCase.execute(input);

    expect(
      await repository.findByEmail(Email.of("marie@example.com")),
    ).not.toBeNull();
  });

  it("keeps the phone number when there is one and none otherwise", async () => {
    const { useCase } = build();

    const withPhone = await useCase.execute({
      ...input,
      phone: " 0612345678 ",
    });
    const withoutPhone = await useCase.execute({
      ...input,
      email: "other@example.com",
    });

    expect(withPhone.phone).toBe("0612345678");
    expect(withoutPhone.phone).toBeNull();
  });

  it("refuses an email that already has an account, whatever its case", async () => {
    const { useCase } = build([buildUser({ email: "marie@example.com" })]);

    await expect(
      useCase.execute({ ...input, email: "MARIE@example.com" }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("refuses an email that is not valid", async () => {
    const { useCase } = build();

    await expect(
      useCase.execute({ ...input, email: "not-an-email" }),
    ).rejects.toBeInstanceOf(ValidationError);
  });
});
