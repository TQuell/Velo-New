import { Page, expect } from '@playwright/test'

export type CustomerData = {
  name: string
  surname: string
  email: string
  phone: string
  cpf: string
  store?: string
}

export function createCheckoutActions(page: Page) {
  const nameInput = page.getByLabel('Nome', { exact: true })
  const surnameInput = page.getByLabel('Sobrenome')
  const emailInput = page.getByLabel('Email')
  const phoneInput = page.getByLabel('Telefone')
  const cpfInput = page.getByLabel('CPF')
  const storeSelect = page.getByTestId('checkout-store')
  const cashButton = page.getByTestId('payment-avista')
  const financingButton = page.getByTestId('payment-financiamento')
  const entryValueInput = page.getByTestId('input-entry-value')
  const termsCheckbox = page.getByTestId('checkout-terms')
  const confirmButton = page.getByRole('button', { name: 'Confirmar Pedido' })

  return {
    elements: {
      nameInput,
      surnameInput,
      emailInput,
      phoneInput,
      cpfInput,
      storeSelect,
      cashButton,
      financingButton,
      entryValueInput,
      termsCheckbox,
      confirmButton,
    },

    async open() {
      await page.goto('http://localhost:5173/order')
      await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible()
    },

    async fillCustomerData(data: CustomerData) {
      if (data.name) await nameInput.fill(data.name)
      if (data.surname) await surnameInput.fill(data.surname)
      if (data.email) await emailInput.fill(data.email)
      if (data.phone) await phoneInput.fill(data.phone)
      if (data.cpf) await cpfInput.fill(data.cpf)
      if (data.store) {
        await storeSelect.click()
        await page.getByRole('option', { name: data.store }).click()
      }
    },

    async selectPaymentCash() {
      await cashButton.click()
    },

    async selectPaymentFinancing(entryValue?: number) {
      await financingButton.click()
      if (entryValue !== undefined) {
        await entryValueInput.fill(entryValue.toString())
      }
    },

    async acceptTerms() {
      await termsCheckbox.check()
    },

    async submit() {
      await confirmButton.click()
    },

    async validateFieldError(message: string) {
      await expect(page.getByText(message)).toBeVisible()
    },

    async validateOrderApproved() {
      await expect(page).toHaveURL(/.*\/success/)
      await expect(page.getByRole('heading', { name: 'Pedido Aprovado!' })).toBeVisible()
    },

    async validateCreditRejected() {
      await expect(page).toHaveURL(/.*\/success/)
      await expect(page.getByRole('heading', { name: 'Crédito Reprovado' })).toBeVisible()
    },
  }
}
