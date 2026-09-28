import { GenerateOtpSecretUseCase } from "./generate-otp-secret.usecase.js";
import { NotFoundError } from "../../domain/errors/http-errors.js";
import { buildUser } from "../../tests/builders/user.builder.js";
import { FakeQrCodeGenerator } from "../../tests/fakes/fake-qr-code.generator.js";
import { FakeTotpService } from "../../tests/fakes/fake-totp.service.js";
import { InMemoryUserRepository } from "../../tests/fakes/in-memory-user.repository.js";

const build = () =>
  new GenerateOtpSecretUseCase(
    new InMemoryUserRepository([
      buildUser({ id: "u1", email: "marie@example.com" }),
    ]),
    new FakeTotpService(),
    new FakeQrCodeGenerator(),
  );

describe("GenerateOtpSecretUseCase", () => {
  it("returns a new secret together with a QR code labelled with the email of the user", async () => {
    const result = await build().execute("u1");

    expect(result.secret).toBe(FakeTotpService.SECRET);
    expect(result.qrCode).toBe(
      `qr:marie@example.com:${FakeTotpService.SECRET}`,
    );
  });

  it("throws a NotFoundError for an unknown user", async () => {
    await expect(build().execute("ghost")).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
