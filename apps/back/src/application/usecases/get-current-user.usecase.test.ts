import { getCurrentUserUsecase } from "./get-current-user.usecase.js";
import { IUserRepository } from "../../domain/interfaces/user-repository.interface.js";
import { User } from "../../domain/entities/user.entity.js";

describe("getCurrentUserUsecase", () => {
  const user = {
    id: "u1",
    email: "admin@example.com",
    password: "hashed",
    firstName: "Admin",
    lastName: "Test",
    phone: null,
    role: "ADMIN",
    otp_enable: false,
    otp_secret: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as User;

  const buildRepository = (found: User | null): IUserRepository => ({
    findAll: async () => [],
    findById: async () => found,
    findByEmail: async () => null,
    create: async () => user,
    update: async () => user,
  });

  it("returns the user matching the token", async () => {
    const getCurrentUser = getCurrentUserUsecase(buildRepository(user));

    expect(await getCurrentUser("u1")).toEqual(user);
  });

  it("throws 401 when the account no longer exists", async () => {
    const getCurrentUser = getCurrentUserUsecase(buildRepository(null));

    await expect(getCurrentUser("ghost")).rejects.toMatchObject({
      statusCode: 401,
    });
  });
});
