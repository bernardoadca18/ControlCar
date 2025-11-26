;const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed...')

  const plan = await prisma.plan.upsert({
    where: { name: 'Free' },
    update: {},
    create: {
      name: 'Free',
      price: new Prisma.Decimal(0),
      features: {},
      isActive: true,
      createdAt: new Date()
    },
  })
  console.log(`Plano criado: ${plan.name}`)

  const owner = await prisma.user.upsert({
    where: { username: 'admin_demo1' },
    update: {}, 
    create: {
      username: 'admin_demo1',
      email: 'admin1@demo.com',
      password: 'senha_teste', 
      first_name: 'Admin1',
      last_name: 'Demo',
      is_superuser: true,
      is_staff: true,
      is_active: true,
      is_deleted: false,
      date_joined: new Date(),
      last_login: new Date()
    }
  })
  console.log(`Dono (AuthUser) criado: ${owner.username}`)

  const tenant = await prisma.tenant.upsert({
    where: { subdomain: 'demo' },
    update: { 
      ownerId: owner.id, 
      planId: plan.id 
    },
    create: {
      name: 'Oficina Demo',
      subdomain: 'demo',
      status: 'active',
      cnpj: '00.000.000/0001-00',
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId: owner.id,
      planId: plan.id,
    }
  })

 const appUser = await prisma.appUser.upsert({
    where: {
      tenantId_email: { 
        tenantId: tenant.id,
        email: 'admin11@demo.com'
      }
    },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Admin Node11',
      email: 'admin11@demo.com', 
      role: 'admin',
      isActive: true,
      passwordHash: '123456', 
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })
  console.log(`Usuário criado: ${appUser.name}`)

  console.log({ 
    tenantId: tenant.id, 
    userId: appUser.id,
    planId: plan.id 
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })