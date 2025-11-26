const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const plan = await prisma.plan.upsert({
    where: { name: 'Free' },
    update: {},
    create: { name: 'Free', price: 0 },
  })

  const tenant = await prisma.tenant.create({
    data: {
      name: 'Oficina Demo',
      subdomain: 'demo',
      status: 'active',
      planId: plan.id
    }
  })

  await prisma.appUser.create({
    data: {
      tenantId: tenant.id,
      name: 'Admin',
      email: 'admin@demo.com',
      passwordHash: '123456',
    }
  })

  console.log({ tenantId: tenant.id })
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())