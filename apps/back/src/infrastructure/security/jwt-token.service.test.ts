import jwt from "jsonwebtoken";
import { JwtTokenService } from "./jwt-token.service.js";
import { UnauthorizedError } from "../../domain/errors/http-errors.js";

const SECRET = "test-secret-".repeat(4);

const encode = (value: object) =>
  Buffer.from(JSON.stringify(value)).toString("base64url");

describe("JwtTokenService", () => {
  const service = new JwtTokenService(SECRET);
  const payload = { userId: "user-1", role: "ADMIN" as const };

  it("refuses to be built without a strong secret", () => {
    expect(() => new JwtTokenService(undefined)).toThrow("JWT_SECRET");
    expect(() => new JwtTokenService("")).toThrow("JWT_SECRET");
    expect(() => new JwtTokenService("too-short")).toThrow("JWT_SECRET");
    expect(
      () => new JwtTokenService("x".repeat(JwtTokenService.MIN_SECRET_LENGTH)),
    ).not.toThrow();
  });

  it("gives back what it signed", () => {
    expect(service.verify(service.sign(payload))).toEqual(payload);
  });

  it("puts nothing but the user id and the role in the token", () => {
    const decoded = jwt.decode(service.sign(payload)) as Record<
      string,
      unknown
    >;

    expect(Object.keys(decoded).sort()).toEqual([
      "exp",
      "iat",
      "role",
      "userId",
    ]);
  });

  it("makes the token valid for seven days", () => {
    const decoded = jwt.decode(service.sign(payload)) as {
      exp: number;
      iat: number;
    };

    expect(decoded.exp - decoded.iat).toBe(7 * 24 * 60 * 60);
  });

  it("refuses a token signed with another secret", () => {
    const foreign = new JwtTokenService("another-secret-".repeat(4)).sign(
      payload,
    );

    expect(() => service.verify(foreign)).toThrow(UnauthorizedError);
  });

  it("refuses a token whose content was changed", () => {
    const [header, content, signature] = service
      .sign({ userId: "user-1", role: "CLIENT" })
      .split(".");
    const forgedContent = encode({
      ...JSON.parse(Buffer.from(content, "base64url").toString()),
      role: "ADMIN",
    });

    expect(() =>
      service.verify(`${header}.${forgedContent}.${signature}`),
    ).toThrow(UnauthorizedError);
  });

  it("refuses a token that is not signed at all", () => {
    const unsigned = `${encode({ alg: "none", typ: "JWT" })}.${encode(payload)}.`;

    expect(() => service.verify(unsigned)).toThrow(UnauthorizedError);
  });

  it("refuses an expired token", () => {
    const expired = new JwtTokenService(SECRET, -10).sign(payload);

    expect(() => service.verify(expired)).toThrow(UnauthorizedError);
  });

  it("refuses a token carrying a role that does not exist", () => {
    const token = jwt.sign({ userId: "user-1", role: "SUPERADMIN" }, SECRET, {
      algorithm: "HS256",
    });

    expect(() => service.verify(token)).toThrow(UnauthorizedError);
  });

  it("refuses a token without user id", () => {
    const token = jwt.sign({ role: "ADMIN" }, SECRET, { algorithm: "HS256" });

    expect(() => service.verify(token)).toThrow(UnauthorizedError);
  });

  it("refuses text that is not a token", () => {
    expect(() => service.verify("not-a-token")).toThrow(UnauthorizedError);
    expect(() => service.verify("")).toThrow(UnauthorizedError);
  });
});
