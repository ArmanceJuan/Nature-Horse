# Back-end architecture

## Layers

- **domain**: entities, value objects, repository and service interfaces, business errors. No dependency on Express or Prisma.
- **application**: use cases, one per business action, each a class with its dependencies received through the constructor.
- **infrastructure**: concrete implementations of the domain interfaces (Prisma, bcrypt, JWT, TOTP) and technical objects (clock, generators).
- **api**: Express controllers, routes, validators and middlewares, translating HTTP into use case calls.

## Composition

`src/api/config/container.ts` is the composition root: it is the only file that builds the concrete classes and wires them together. `src/api/app.ts` receives an already-built container (`createApp(container)`) instead of knowing its details, which makes it possible to plug in a fully in-memory test container.

## Object-oriented programming

- Entities carry their business rules (`Order.canBeCancelled()`, `Product.isVisibleInCatalog()`, `User.isAdmin()`), rather than staying plain data structures.
- Every repository implements a domain interface (`IProductRepository`, `IOrderRepository`...), with a Prisma implementation in production and an in-memory implementation in tests: this is the polymorphism that makes it possible to test without a database.
- Every dependency is received through the constructor, never imported directly by a use case or a controller.
- An error hierarchy (`ValidationError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `ConflictError`) extends `AppError`, itself a subclass of `Error`.

## Tests

Two levels:

- **Unit**: use cases and entities tested with in-memory repositories and services, no database involved.
- **Integration**: routes tested with Supertest, either against the real database (`app.ts` → `server-app.ts`), or fully in memory (`createApp` with `buildInMemoryContainer`).

## Security

- Passwords hashed with bcrypt, never stored or returned in clear text.
- Sessions via a JWT (HS256) in an `httpOnly`, `sameSite=strict` cookie.
- Optional TOTP two-factor authentication, with single-use backup codes (generated, then stored hashed).
- Role-based access control on sensitive routes, plus per-resource access checks in the use cases (an order is only visible to its owner or an administrator).
- All API input validated by `Validator` classes, which let through only the expected fields.
