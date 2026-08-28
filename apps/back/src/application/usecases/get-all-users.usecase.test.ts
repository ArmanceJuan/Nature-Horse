import { getAllUsersUsecase } from "./get-all-users.usecase.js";
import { IUserRepository } from "../../domain/interfaces/user-repository.interface.js";
import { User } from "../../domain/entities/user.entity.js";

describe("getAllUsersUsecase", () => {
  it("should return all users from the repository", async () => {
    const fakeUsers: User[] = [
      {
        id: "1",
        email: "spirit.riviere@example.com",
        password: "hashed",
        firstName: "Spirit",
        lastName: "Rivière",
        phone: null,
        role: "CLIENT",
        otp_enable: false,
        otp_secret: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const fakeUserRepository: IUserRepository = {
      findAll: async () => fakeUsers,
      findById: async () => null,
      findByEmail: async () => null,
      create: async () => fakeUsers[0],
      update: async () => fakeUsers[0],
    };

    const getAllUsers = getAllUsersUsecase(fakeUserRepository);
    const result = await getAllUsers();

    const { password, ...expectedUser } = fakeUsers[0];

    expect(result).toEqual([expectedUser]);
    expect(result).toHaveLength(1);
  });
});
