import { GetAllUsersUseCase } from "./get-all-users.usecase.js";
import { buildUser } from "../../tests/builders/user.builder.js";
import { InMemoryUserRepository } from "../../tests/fakes/in-memory-user.repository.js";

describe("GetAllUsersUseCase", () => {
  it("returns every user held by the repository", async () => {
    const users = [
      buildUser({ id: "u1" }),
      buildUser({ id: "u2", email: "other@example.com" }),
    ];
    const useCase = new GetAllUsersUseCase(new InMemoryUserRepository(users));

    expect(await useCase.execute()).toEqual(users);
  });

  it("returns users that cannot expose their secrets once serialized", async () => {
    const users = [buildUser({ otpSecret: "SECRET" })];
    const useCase = new GetAllUsersUseCase(new InMemoryUserRepository(users));

    const serialized = JSON.stringify(await useCase.execute());

    expect(serialized).not.toContain("hashed:Password1!");
    expect(serialized).not.toContain("SECRET");
  });

  it("returns an empty list when there is no user", async () => {
    const useCase = new GetAllUsersUseCase(new InMemoryUserRepository());

    expect(await useCase.execute()).toEqual([]);
  });
});
