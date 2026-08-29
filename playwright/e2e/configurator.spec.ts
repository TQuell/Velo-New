import { test, expect } from '../support/fixtures'

/// AAA - Arrange, Act, Assert

test.describe('Configuração do Veículo', () => {
    test.beforeEach(async ({ app }) => {
        // Arrange
        await app.configurator.open()
    })

    test('deve alterar a cor do veículo atualizando a imagem e mantendo o preço base', async ({ app }) => {
        // Arrange
        await app.configurator.validateTotalPrice('R$ 40.000,00')

        // Act
        await app.configurator.selectColor('Midnight Black')

        // Assert
        await app.configurator.validateTotalPrice('R$ 40.000,00')
        await app.configurator.validateCarImage('/src/assets/midnight-black-aero-wheels.png')
    })

    test('deve atualizar a imagem e o preço ao alternar as rodas do veículo', async ({ app }) => {
        // Arrange
        await app.configurator.validateTotalPrice('R$ 40.000,00')

        // Act & Assert - Sport Wheels
        await app.configurator.selectWheels(/Sport Wheels/)
        await app.configurator.validateTotalPrice('R$ 42.000,00')
        await app.configurator.validateCarImage('/src/assets/glacier-blue-sport-wheels.png')

        // Act & Assert - Aero Wheels
        await app.configurator.selectWheels(/Aero Wheels/)
        await app.configurator.validateTotalPrice('R$ 40.000,00')
        await app.configurator.validateCarImage('/src/assets/glacier-blue-aero-wheels.png')
    })
})