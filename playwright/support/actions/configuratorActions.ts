import { Page, expect } from '@playwright/test'

export function createConfiguratorActions(page: Page) {

  return {

    async open() {
      await page.goto('http://localhost:5173/configure')
      await expect(page.getByRole('heading', { name: 'Velô Sprint' })).toBeVisible()
    },

    async selectColor(color: string) {
      await page.getByRole('button', { name: color }).click()
    },

    async selectWheels(wheel: string | RegExp) {
      await page.getByRole('button', { name: wheel }).click()
    },

    async toggleOptional(name: string) {
      await page.getByText(name).click()
    },

    async validateTotalPrice(expectedPrice: string) {
      const priceElement = page.getByTestId('total-price')
      await expect(priceElement).toBeVisible()
      await expect(priceElement).toHaveText(expectedPrice)
    },

    async validateCarImage(expectedSrc: string | RegExp) {
      const carImage = page.locator('img[alt^="Velô Sprint"]')
      await expect(carImage).toBeVisible()
      await expect(carImage).toHaveAttribute('src', expectedSrc)
    },
  }
}
