import { QrCodeGenerator } from "./qr-code.generator.js";

describe("QrCodeGenerator", () => {
  it("returns a PNG image as a data URL", async () => {
    const url = await new QrCodeGenerator("Nature Horse").generate(
      "marie@example.com",
      "JBSWY3DPEHPK3PXP",
    );

    expect(url.startsWith("data:image/png;base64,")).toBe(true);
  });
});
