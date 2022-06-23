const assert = require('assert')
const api = require('./../api')
let app = {}
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ilh1eGFkYXNpbHZhIiwiaWQiOjEsImlhdCI6MTY1NTkzOTEzOX0.FC8RclKziQKIlWdHlDSYLBPxgohHib9E8EqszHSKvUU'

const headers = {
    Authorization: TOKEN
}
const MOCK_HEROI_CADASTRAR = {
    nome: 'Chapolim Colorado',
    poder: 'marreta bionica'
}
const MOCK_HEROI_INICIAL = {
    nome: 'Gavião Negro',
    poder: 'A mira'
}

let MOCK_ID = ''
describe('API Heroes test suite', function ()  {
    this.beforeAll(async () => {
        app = await api
        const result = await app.inject({
            method: 'POST',
            url: '/herois',
            headers,
            payload: JSON.stringify(MOCK_HEROI_INICIAL)
        })
        const dados = JSON.parse(result.payload)
        MOCK_ID = dados._id
    })

    it('listar /herois', async () => {
        const result = await app.inject({
            method: "GET",
            headers,
            url: "/herois?skip=0&limit=100",
        });

        const statusCode = result.statusCode;
        const dados = JSON.parse(result.payload);

        assert.deepEqual(statusCode, 200);
        assert.ok(Array.isArray(dados));
    })

    it('listar /herois - deve listar somente 10 registros', async () => {
        const TAMANHO_LIMITE = 3
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
        })
        const dados = JSON.parse(result.payload)
       
        const statusCode = result.statusCode 
        assert.deepEqual(statusCode, 200)
        assert.ok(dados.length === TAMANHO_LIMITE)
    })

    it('listar /herois - deve retornar um erro com limit incorreto', async () => {
        const TAMANHO_LIMITE = 'AEEE'
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
        })

        const errorResult = 
        {"statusCode":400,
        "error":"Bad Request",
        "message":"\"limit\" must be a number",
        "validation":
        {"source":"query",
        "keys":["limit"]
    }}
        assert.deepEqual(result.statusCode, 400)
        assert.deepEqual(result.payload, JSON.stringify(errorResult))
    })

    it('listar GET - /herois - deve filtrar um item', async () => {
        
        const NAME = MOCK_HEROI_INICIAL.nome
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/herois?skip=0&limit=1000&nome=${NAME}`
        })

        const dados = JSON.parse(result.payload) 
        const statusCode = result.statusCode 
        assert.deepEqual(statusCode, 200)
        assert.deepEqual(dados[0].nome, NAME)
    })

    it('cadastrar POST - /herois', async () => {
        const result = await app.inject({
            method: 'POST',
            url: `/herois`,
            headers,
            payload: MOCK_HEROI_CADASTRAR
        })

        const statusCode = result.statusCode
        const {message, _id} = JSON.parse(result.payload)
        assert.deepEqual(statusCode, 200)
        assert.notStrictEqual(_id, undefined)
        assert.deepEqual(message, "Heroi cadastrado com sucesso!")
    })

    it('atualizar PATCH - /herois/:id', async () => {
        const _id = MOCK_ID
        const expected = {
            poder: 'Super mira'
        }
        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${_id}`,
            headers,
            payload: JSON.stringify(expected)
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepEqual(dados.message, 'Heroi atualizado com sucesso!')
    })

    
    it('atualizar PATCH - /herois/:id - não deve atualizar com ID incorreto!', async () => {
        const _id = `62ae1828464c3080429bad83`
        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${_id}`,
            headers,
            payload: JSON.stringify({
                poder: 'Super mira'
            })
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        const expected = {
                statusCode: 412,
                error: 'Precondition Failed',
                message: 'Id Não encontrado no banco!'
        }
        assert.ok(statusCode === 412)
        assert.deepEqual(dados, expected)
    })

    it('remover /herois/:id', async () => {
        const _id = MOCK_ID;

        const result = await app.inject({
            method: "DELETE",
            headers,
            url: `/herois/${_id}`,
        });

      
        const dados = JSON.parse(result.payload);
        
        assert.ok(result.statusCode === 200)
        assert.deepEqual(dados.message, "Heroi Removido com sucesso!");
    });
    it('remover /herois/:id não deve remover', async () => {
        const _id = '62ae1828464c3080429bad83'
        const result =  await app.inject({
            method: 'DELETE',
            headers,
            url: `/herois/${_id}` 
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        const expected = {
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'Id Não encontrado no banco!'
    }
        
        assert.ok(statusCode === 412) 
        assert.ok(dados, expected)
    })

    it('remover /herois/:id não deve remover com id invalido', async () => {
        const _id = 'ID_INVALIDO'
        const result =  await app.inject({
            method: 'DELETE',
            headers,
            url: `/herois/${_id}` 
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        const expected = {
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'An internal server error occurred'
    }
        assert.ok(statusCode === 500) 
        assert.deepEqual(dados, expected)
    })
})