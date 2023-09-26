const { PrismaClient, Role } = require("@prisma/client");

const db = new PrismaClient({
  log: ["query", "info", "warn"],
});

const users = [
  {
    id: "f25618e4-a270-4481-b10f-03056583f31f",
    email: "bill.sourour@arcnovus.com",
    name: "Bill",
    password: "$2a$10$CcppCTt7IC/CVXbGvsln.OZepnNSzsPDuvAmxazoZtU4SdvlQ9xSy",
    role: Role.GUARDIAN,
    createdAt: "2023-09-21T12:34:56Z",
    updatedAt: "2023-09-21T12:34:56Z",
    version: 1,
  },
  {
    id: "b29efd9a-162d-47a1-aee6-80cba4807d19",
    email: "bill.sourour@me.com", //"sarah.j.sourour@gmail.com",
    name: "Sarah",
    password: "$2a$10$HEWxekQ9IhaJLAe3m9AIIugCg1UsuMFvftNxou0jRpzk0WYrZKpMa",
    role: Role.GUARDIAN,
    createdAt: "2023-09-21T12:34:56Z",
    updatedAt: "2023-09-21T12:34:56Z",
    version: 1,
  },
  {
    id: "cc0fab71-f987-4d6e-9e46-c7931f137c72",
    email: "bill@devmastery.com", //"cox-twardowski@heritage-academy.com",
    name: "Alex",
    password: "$2a$10$8iv/tl2Kx7ssm5tJ9PE14ul7N5aZP7eVWHboa1bQFCqqvtiqOZXne",
    role: Role.EDUCATOR,
    createdAt: "2023-09-21T12:34:56Z",
    updatedAt: "2023-09-21T12:34:56Z",
    version: 1,
  },
  {
    id: "c008325a-347c-408e-8857-7f145cf6e70e",
    email: "billsparks@gmail.com", // "mckendry@heritage-academy.com",
    name: "Morgan",
    password: "$2a$10$M/YkVcZA.6OcOnXGoGeHKOjJ2.l.WWf.MS/dREb/qvWLx9gUvoq3m",
    role: Role.EDUCATOR,
    createdAt: "2023-09-21T12:34:56Z",
    updatedAt: "2023-09-21T12:34:56Z",
    version: 1,
  },
];

async function main() {
  for (const user of users) {
    const { id, createdAt, ...update } = user;
    console.log(`Upserting user with ID: ${id}`);
    await db.user.upsert({
      where: { id: user.id, version: user.version },
      update: update,
      create: user,
    });
    console.log(`Upserted user with ID: ${id}`);
  }
}

main()
  .then(() => {
    console.log("Done.");
  })
  .catch((e) => {
    console.error("Main function error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
