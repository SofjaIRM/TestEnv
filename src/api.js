const { config } = require("dotenv");
const { join } = require("path");
const { ok } = require("assert");

const env = process.env.NODE_ENV || "dev";
ok(env === "prod" || env === "dev" || env === "test", " A env é inválida");

const configPath = join(__dirname, "..", "config", `.env.${env}`);
config({
  path: configPath,
});

const Hapi = require('@hapi/hapi')
const Context = require('./db/strategies/base/contextStrategy')
const MongoDB = require('./db/strategies/mongodb/mongodb')

const HeroRoutes = require('./routes/heroRoutes')
const HeroSchema = require('./db/strategies/mongodb/schemas/heroisSchema')

const PostgresDB = require('./db/strategies/postgres/postgresSQLStrategy')
const AuthRoutes = require('./routes/authRoutes')
const UserSchema = require('./db/strategies/postgres/schemas/usuarioSchema')


const HapiSwagger = require('hapi-swagger')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')
const HapiJwt = require('hapi-auth-jwt2')

require('dotenv').config()
const MINHA_CHAVE_SECRETA = process.env.JWT_KEY

const swaggerConfig = {
    info: {
        title: '#CursoNodeBR - API Herois',
        version: 'v1.0'
    },
    lang: 'pt'

}

const app = new Hapi.Server({
    port: process.env.PORT
})

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    const connectionPostgres = await PostgresDB.connect()
    const model = await PostgresDB.defineModel(connectionPostgres, UserSchema)
    const postgresModel = new Context(new PostgresDB(connectionPostgres, model));

    const connection = MongoDB.connect()
    const mongoDb = new Context(new MongoDB(connection, HeroSchema))


    await app.register([
        HapiJwt,
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerConfig
        }
    ])
    app.auth.strategy('jwt', 'jwt', {
        key: MINHA_CHAVE_SECRETA,
        // options: {
        //     expiresIn: 30
        // },
        validate: (dado, request) => {
            return {
                isValid: true
            }
        }
    })


    app.auth.default('jwt')


    app.route([
        ...mapRoutes(new HeroRoutes(mongoDb), HeroRoutes.methods()),
        ...mapRoutes(new AuthRoutes(MINHA_CHAVE_SECRETA, postgresModel), AuthRoutes.methods())
    ])

    await app.start()
    console.log('server running at', app.info.port)

    return app;
}
module.exports = main()