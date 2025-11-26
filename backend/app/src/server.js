const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger_output.json');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

const getTenantId = async () => {
    const tenant = await prisma.tenant.findFirst();
    return tenant.id;
};

app.get('/api/dashboard', async (req, res) => {
    const tenantId = await getTenantId();
    const osCount = await prisma.serviceOrder.count({ where: { tenantId, status: 'opened' } });
    const clientsCount = await prisma.client.count({ where: { tenantId } });
    const revenue = await prisma.serviceOrder.aggregate({
        where: { tenantId, status: 'finished' },
        _sum: { totalAmount: true }
    });
    res.json({ osOpened: osCount, clients: clientsCount, revenue: revenue._sum.totalAmount || 0 });
});

app.get('/api/clients', async (req, res) => {
    const tenantId = await getTenantId();
    const clients = await prisma.client.findMany({ 
        where: { tenantId },
        include: { vehicles: true } 
    });
    res.json(clients);
});

app.post('/api/clients', async (req, res) => {
    const tenantId = await getTenantId();
    const { name, phone, plate, model } = req.body;
    
    const client = await prisma.client.create({
        data: {
            tenantId,
            name,
            phone,
            vehicles: {
                create: {
                    tenantId,
                    plate,
                    model,
                    brand: 'Generica'
                }
            }
        }
    });
    res.json(client);
});


app.get('/api/os', async (req, res) => {
    const tenantId = await getTenantId();
    const os = await prisma.serviceOrder.findMany({
        where: { tenantId },
        include: { client: true, vehicle: true },
        orderBy: { createdAt: 'desc' }
    });
    res.json(os);
});

app.post('/api/os', async (req, res) => {
    const tenantId = await getTenantId();
    const { clientId, vehicleId, description, total } = req.body;

    const os = await prisma.serviceOrder.create({
        data: {
            tenantId,
            clientId,
            vehicleId,
            problemDescription: description,
            totalAmount: total || 0,
            status: 'opened'
        }
    });
    res.json(os);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend nodeJS rodando na porta ${PORT}`);
});