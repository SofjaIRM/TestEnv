

const ContextStrategy = require('./db/strategies/base/contextStrategy')
const MongoDB = require('./db/strategies/mongodb')
const Postgres = require('./db/strategies/postgres')

const ContextMongo = new ContextStrategy(new MongoDB())
ContextMongo.create()


const ContextPostgres = new ContextStrategy(new Postgres())
ContextPostgres.create()