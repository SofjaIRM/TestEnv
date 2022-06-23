const assert = require('assert')
const PasswordHelper = require('../helpers/passwordHelper')

const SENHA = 'Ilso@199422'
const HASH = '$2b$04$BvoyHQQV2p5L4.rdH5kcdO4w.oCVkNdtJqtQDBW7N4BdvP8i6Ch2m'
describe('UserHelper test suite', function() {
    it('deve gerar um hash a partir de uma senha', async () => {
        const result = await PasswordHelper.hashPassword(SENHA)
        
            assert.ok(result.length > 10)
        
    })

    it('deve comparar uma senha e seu hash', async () => {
        const result = await PasswordHelper.comparePassword(SENHA, HASH)
        assert.ok(result)
    })
})