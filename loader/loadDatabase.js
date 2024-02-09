// loadDatabase.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function loadDatabase() {
    try {
        await prisma.$connect();
        console.log('Connexion à la base de données établie');
        return prisma;
    } catch (e) {
        console.error('Erreur de connexion à la base de données', e);
        throw e;
    }
}

module.exports = loadDatabase;