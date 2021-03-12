const env = process.env;

const config = {
    db: {
        host: env.DB_HOST || 'localhost',
        port: env.DB_PORT || '5432',
        user: env.DB_USER || 'postgres',
        password: env.DB_PASSWORD || 'password',
        database: env.DB_DATABASE || 'database_cw'
    },
    listPerPage: env.LIST_PER_PAGE || 20
};

module.exports = config;