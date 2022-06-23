const equal = require('assert')
const assert = require('assert')
const deepEqual = require('assert')
const MongoDb = require('../db/strategies/mongodb/mongodb')
const HeroiSchema = require('../db/strategies/mongodb/schemas/heroisSchema')
const Context = require('../db/strategies/base/contextStrategy')

const MOCK_HEROI_CADASTRAR = { nome: 'Mulher Maravilha', poder: 'laço' };
const MOCK_HEROI_DEFAULT = { nome: `Homem Aranha-${Date.now()}`, poder: 'teias' };
const MOCK_HEROI_ATUALIZAR = { nome: `Patolino-${Date.now()}`, poder: 'velocidade' };

let MOCK_HEROI_ID = ''

let context = {}

describe('Mongo Suite de testes', function () {
    this.beforeAll(async () => {
      const connection = MongoDb.connect()
      context = new Context(new MongoDb(connection, HeroiSchema))
      await context.create(MOCK_HEROI_DEFAULT)
      const result = await context.create(MOCK_HEROI_ATUALIZAR)
      MOCK_HEROI_ID = result._id
    });

    it('verificar conexão', async () => {
        const result = await context.isConnected()
        const expected ='Conectado'

        equal(result, expected)
    })
    
    it('cadastrar', async () => {
        const{nome, poder} = await context.create(MOCK_HEROI_CADASTRAR)
        deepEqual({nome, poder}, MOCK_HEROI_CADASTRAR)
    })

    it('listar', async () => {
        const [{nome, poder}] = await context.read({nome: MOCK_HEROI_DEFAULT.nome})
        const result = {nome, poder}
        assert.deepEqual(result, MOCK_HEROI_DEFAULT)
    })

    it('atualizar', async () => {
      const result = await context.update(MOCK_HEROI_ID, {
          poder: 'voar'
      })
     result.nModified, 1
  })

  it('remover', async () => {
    const result = await context.delete(MOCK_HEROI_ID)
    result.n, 1
  })
    });
