const env = process.env;

const config = {
    db: {
        host: env.DB_HOST || 'localhost',
        port: env.DB_PORT || '5433' || '5432',
        user: env.DB_USER || 'postgres',
        password: env.DB_PASSWORD || 'myPassword',
        database: env.DB_DATABASE || 'database_cw'
    },
    listPerPage: env.LIST_PER_PAGE || 10
};

module.exports = config;