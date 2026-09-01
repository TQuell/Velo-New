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

    test('CT03 - deve calcular o preço dinâmico ao adicionar e remover opcionais', async ({ app, page }) => {
        // Arrange - Localizadores
        const precisionPark = page.getByRole('checkbox', { name: /Precision Park/i })
        const fluxCapacitor = page.getByRole('checkbox', { name: /Flux Capacitor/i })

        // Checkpoint: Garantir visibilidade dos elementos
        await expect(precisionPark).toBeVisible()
        await expect(fluxCapacitor).toBeVisible()

        // Arrange - Checkpoint inicial
        await app.configurator.validateTotalPrice('R$ 40.000,00')
        await expect(precisionPark).not.toBeChecked()
        await expect(fluxCapacitor).not.toBeChecked()

        // Act & Assert - Passo 1: Marcar Precision Park (+ R$ 5.500,00)
        await app.configurator.toggleOptional('Precision Park')
        await expect(precisionPark).toBeChecked()
        await app.configurator.validateTotalPrice('R$ 45.500,00')

        // Act & Assert - Passo 2: Marcar Flux Capacitor (+ R$ 5.000,00)
        await app.configurator.toggleOptional('Flux Capacitor')
        await expect(fluxCapacitor).toBeChecked()
        await app.configurator.validateTotalPrice('R$ 50.500,00')

        // Act & Assert - Passo 3: Desmarcar opcionais agrupados
        await fluxCapacitor.uncheck()
        await precisionPark.uncheck()
        await app.configurator.validateTotalPrice('R$ 40.000,00')
    })
})