import { test, expect } from '../support/fixtures'
import { generateOrderCode } from '../support/helpers'
import type { OrderDetails } from '../support/actions/orderLookupActions'

/// AAA - Arrange, Act, Assert

test.describe('Consulta de Pedido', () => {

  test.beforeEach(async ({ app }) => {
    // Arrange
    await app.orderLookup.open()
  })

  test('deve consultar um pedido aprovado', async ({ app }) => {

    // Test Data
    const order: OrderDetails = {
      number: 'VLO-VDAOST',
      status: 'APROVADO' as const,
      color: 'Lunar White',
      wheels: 'aero Wheels',
      customer: {
        name: 'Harry  Potter',
        email: 'harry.potter@dev.com',
        document: '111.111.111-11',
        phone: '(11) 99999-9999'
      },
      payment: 'À Vista'
    }

    // Act  
    await app.orderLookup.searchOrder(order.number)
    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)

    })

  test('deve consultar um pedido reprovado', async ({ app }) => {

    // Test Data
    const order: OrderDetails = {
      number: 'VLO-K4BKZY',
      status: 'REPROVADO' as const,
      color: 'Midnight Black',
      wheels: 'sport Wheels',
      customer: {
        name: 'Harry  Potter',
        email: 'harry.potter@dev.com',
        document: '391.241.783-06',
        phone: '(11) 99999-9999'
      },
      payment: 'À Vista'
    }

    // Act  
    await app.orderLookup.searchOrder(order.number)
    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)

  

    // Validação do badge de status encapsulada nas actions
    await app.orderLookup.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido em analise', async ({ app }) => {

    // Test Data
    const order: OrderDetails = {
      number: 'VLO-6OMN0Y',
      status: 'EM_ANALISE' as const,
      color: 'Lunar White',
      wheels: 'aero Wheels',
      customer: {
        name: 'João da Silva',
        email: 'joao@velo.com',
        document: '104.240.300-71',
        phone: '(11) 99999-9999'
      },
      payment: 'À Vista'
    }

    // Act  
    await app.orderLookup.searchOrder(order.number)
    await app.orderLookup.validateOrderDetails(order)
    await app.orderLookup.validateStatusBadge(order.status)

    
  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ app, page }) => {

    const order = generateOrderCode()

    await app.orderLookup.searchOrder(order)


    await expect(page.locator('#root')).toMatchAriaSnapshot(`
      - img
      - heading "Pedido não encontrado" [level=3]
      - paragraph: Verifique o número do pedido e tente novamente
      `)

  })

  test('deve exibir mensagem quando o código do pedido está fora do padrão', async ({ app }) => {
    const orderCode = 'XYZ-000-INVÁLIDO'
    await app.orderLookup.searchOrder(orderCode)
    await app.orderLookup.validateOrderNotFound()
  })

  test('deve manter o botão de busca desabilitado com campo ou apneas espaços', async ({ app, page }) =>{
     const button = app.orderLookup.elements.searchButton
     await expect(button).toBeDisabled()

     await app.orderLookup.elements.orderInput.fill('    ')
     await expect(button).toBeDisabled()     

  }) 

})
