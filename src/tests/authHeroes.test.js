const assert = require('assert')
const api = require('./../api')
const Context = require('../db/strategies/base/contextStrategy')
const Postgres = require('../db/strategies/postgres/postgresSQLStrategy')
const UsuarioSchema = require('../db/strategies/postgres/schemas/usuarioSchema')

let app = {}
const USER = {
    username: 'Xuxadasilva',
    password: '123'
}

const USER_DB = {
    username: USER.username.toLowerCase(),
    password: '$2b$04$hZT3NnN414nrpwv9927MyO3/yQoc03GLO.onJmKH3jrD/5oih7lEe'
}
describe('Auth test suit', function () {
    this.beforeAll(async () => {
        app = await api

        const connectionPostgres = await Postgres.connect()
        const model = await Postgres.defineModel(connectionPostgres, UsuarioSchema)
        const postgres = new Context(new Postgres(connectionPostgres, model))
        await postgres.update(null, USER_DB, true)
    })

    it('deve obter um token', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USER
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        
        assert.ok(statusCode === 200)
        assert.ok(dados.token.length > 10 )
    })

    it('deve retornar não autorizado ao tentar obter um login errado', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'ilso',
                password: '123'
            }
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.deepEqual(statusCode, 401)
        assert.deepEqual(dados.error, "Unauthorized")
    })

    
})