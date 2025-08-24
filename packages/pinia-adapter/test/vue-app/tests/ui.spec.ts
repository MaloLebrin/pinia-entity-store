import { expect, test } from '@playwright/test'

test.describe('Vue App - Pinia Entity Store Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the main interface', async ({ page }) => {
    // Vérifier que l'interface principale s'affiche
    await expect(page.getByText('Pinia Entity Store Test')).toBeVisible()
    await expect(page.getByText('Créer un utilisateur')).toBeVisible()
    await expect(page.getByText('Utilisateurs')).toBeVisible()
    await expect(page.getByText('Actions globales')).toBeVisible()
    await expect(page.getByText('Statistiques')).toBeVisible()
  })

  test('should create a new user', async ({ page }) => {
    // Remplir le formulaire de création
    await page.fill('input[placeholder="Nom"]', 'John Doe')
    await page.fill('input[placeholder="Email"]', 'john@example.com')
    await page.fill('input[placeholder="Âge"]', '30')
    
    // Soumettre le formulaire
    await page.click('button:has-text("Créer")')
    
    // Vérifier que l'utilisateur apparaît dans la liste
    await expect(page.getByText('John Doe')).toBeVisible()
    await expect(page.getByText('john@example.com')).toBeVisible()
    await expect(page.getByText('Âge: 30')).toBeVisible()
  })

  test('should update an existing user', async ({ page }) => {
    // Créer d'abord un utilisateur
    await page.fill('input[placeholder="Nom"]', 'Jane Smith')
    await page.fill('input[placeholder="Email"]', 'jane@example.com')
    await page.fill('input[placeholder="Âge"]', '25')
    await page.click('button:has-text("Créer")')
    
    // Cliquer sur l'utilisateur pour le sélectionner
    await page.click('text=Jane Smith')
    
    // Modifier les champs
    await page.fill('input[placeholder="Nom"]', 'Jane Wilson')
    await page.fill('input[placeholder="Âge"]', '26')
    
    // Mettre à jour
    await page.click('button:has-text("Modifier")')
    
    // Vérifier les changements
    await expect(page.getByText('Jane Wilson')).toBeVisible()
    await expect(page.getByText('Âge: 26')).toBeVisible()
  })

  test('should delete a user', async ({ page }) => {
    // Créer un utilisateur
    await page.fill('input[placeholder="Nom"]', 'Bob Johnson')
    await page.fill('input[placeholder="Email"]', 'bob@example.com')
    await page.fill('input[placeholder="Âge"]', '35')
    await page.click('button:has-text("Créer")')
    
    // Vérifier qu'il est créé
    await expect(page.getByText('Bob Johnson')).toBeVisible()
    
    // Le sélectionner et le supprimer
    await page.click('text=Bob Johnson')
    await page.click('button:has-text("Supprimer")')
    
    // Vérifier qu'il est supprimé
    await expect(page.getByText('Bob Johnson')).not.toBeVisible()
  })

  test('should handle validation errors', async ({ page }) => {
    // Essayer de créer un utilisateur sans nom
    await page.fill('input[placeholder="Email"]', 'invalid@example.com')
    await page.fill('input[placeholder="Âge"]', '25')
    await page.click('button:has-text("Créer")')
    
    // Vérifier que le bouton est désactivé (validation côté client)
    await expect(page.locator('button:has-text("Créer")')).toBeDisabled()
    
    // Essayer de créer un utilisateur avec un email invalide
    await page.fill('input[placeholder="Nom"]', 'Test User')
    await page.fill('input[placeholder="Email"]', 'invalid-email')
    
    // Vérifier que le bouton est désactivé
    await expect(page.locator('button:has-text("Créer")')).toBeDisabled()
  })

  test('should display statistics correctly', async ({ page }) => {
    // Créer quelques utilisateurs
    const users = [
      { name: 'User 1', email: 'user1@example.com', age: '20' },
      { name: 'User 2', email: 'user2@example.com', age: '25' },
      { name: 'User 3', email: 'user3@example.com', age: '30' }
    ]
    
    for (const user of users) {
      await page.fill('input[placeholder="Nom"]', user.name)
      await page.fill('input[placeholder="Email"]', user.email)
      await page.fill('input[placeholder="Âge"]', user.age)
      await page.click('button:has-text("Créer")')
    }
    
    // Vérifier les statistiques
    await expect(page.getByText('Total: 3')).toBeVisible()
    await expect(page.getByText('Actifs: 0')).toBeVisible()
    await expect(page.getByText('Modifiés: 0')).toBeVisible()
  })

  test('should handle global actions', async ({ page }) => {
    // Créer quelques utilisateurs
    await page.fill('input[placeholder="Nom"]', 'User 1')
    await page.fill('input[placeholder="Email"]', 'user1@example.com')
    await page.fill('input[placeholder="Âge"]', '20')
    await page.click('button:has-text("Créer")')
    
    await page.fill('input[placeholder="Nom"]', 'User 2')
    await page.fill('input[placeholder="Email"]', 'user2@example.com')
    await page.fill('input[placeholder="Âge"]', '25')
    await page.click('button:has-text("Créer")')
    
    // Vérifier qu'il y a 2 utilisateurs
    await expect(page.getByText('Total: 2')).toBeVisible()
    
    // Utiliser l'action globale de reset
    await page.click('button:has-text("Réinitialiser le store")')
    
    // Vérifier que tout est réinitialisé
    await expect(page.getByText('Total: 0')).toBeVisible()
    await expect(page.getByText('User 1')).not.toBeVisible()
    await expect(page.getByText('User 2')).not.toBeVisible()
  })

  test('should handle active user selection', async ({ page }) => {
    // Créer un utilisateur
    await page.fill('input[placeholder="Nom"]', 'Active User')
    await page.fill('input[placeholder="Email"]', 'active@example.com')
    await page.fill('input[placeholder="Âge"]', '28')
    await page.click('button:has-text("Créer")')
    
    // Le sélectionner comme actif
    await page.click('text=Active User')
    await page.click('button:has-text("Activer")')
    
    // Vérifier qu'il est marqué comme actif
    await expect(page.getByText('Actifs: 1')).toBeVisible()
    
    // Le désactiver
    await page.click('text=Active User')
    await page.click('button:has-text("Activer")') // Le bouton bascule l'état
    
    // Vérifier qu'il n'est plus actif
    await expect(page.getByText('Actifs: 0')).toBeVisible()
  })
})
