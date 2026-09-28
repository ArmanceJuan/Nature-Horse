import { GetCurrentUserUseCase } from "./get-current-user.usecase.js";
import { UnauthorizedError } from "../../domain/errors/http-errors.js";
import { buildUser } from "../../tests/builders/user.builder.js";
import { InMemoryUserRepository } from "../../tests/fakes/in-memory-user.repository.js";

describe("GetCurrentUserUseCase", () => {
  it("returns the user matching the token", async () => {
    const user = buildUser({ id: "u1" });
    const useCase = new GetCurrentUserUseCase(
      new InMemoryUserRepository([user]),
    );

    expect(await useCase.execute("u1")).toEqual(user);
  });

  it("treats a token whose account no longer exists as unauthenticated", async () => {
    const useCase = new GetCurrentUserUseCase(new InMemoryUserRepository());

    await expect(useCase.execute("ghost")).rejects.toBeInstanceOf(
      UnauthorizedError,
    );
  });
});
