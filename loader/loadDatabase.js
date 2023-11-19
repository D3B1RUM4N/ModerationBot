const { Database } = require('sqlite3').verbose();

module.exports = async () => {
    // Utilisation de la classe Database pour créer une connexion à la base de données SQLite
    let db = new Database('./database/bdd.db', (err) => {
        if (err) {
            console.error('Erreur lors de l\'ouverture de la base de données :', err.message);
        } else {
            console.log('Connexion à la base de données réussie.');
        }
    });

    return db;
};