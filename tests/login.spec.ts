// ============================================================================
// ------------------------- login.spec.js ------------------------------
// ============================================================================
// Implementa la automatización real sobre el navegador, consume los datos generados por la IA

// tests/login.spec.ts
import { test, expect, Locator } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import type { TestData } from '../orchestrador';

test('qa-playwright', async ({ page }) => {
  // 1. Cargar parámetros tipados extraídos por el orquestador
  const contextPath = path.join(__dirname, 'context_ai.json');
  const dataAI = JSON.parse(fs.readFileSync(contextPath, 'utf-8')) as TestData;

  // Variables configurables del flujo
  const targetUrl: string = dataAI.url;
  const username: string = dataAI.username;
  const password: string = dataAI.password;
  const expectedRoute: string = dataAI.expected_route;

  console.log(`Ejecutando login en: ${targetUrl} con usuario: ${username}`);

  // Función en segundo plano para el banner de cookies
  await page.addLocatorHandler(
    page.getByRole('button', { name: /accept all|aceptar todo|aceptar|accept/i }),
    async (overlayButton: Locator) => {
      console.log('✔ Banner de cookies detectado: aceptando automáticamente.');
      await overlayButton.click();
    }
  );

  // 2. Navegar a la página de autenticación
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });

  // 3. Localizar campos e ingresar credenciales
  const usernameField = page.locator('input[type="text"], input[type="email"], input:not([type="password"]):not([type="hidden"])').first();
  const passwordField = page.locator('input[type="password"]').first();
  const loginButton = page.locator('button[type="submit"], button:has-text("Iniciar"), button:has-text("Ingresar"), button:has-text("Entrar"), button:has-text("Login")').first();

  await usernameField.waitFor({ state: 'visible', timeout: 30000 });
  await usernameField.fill(username);
  await passwordField.fill(password);
  await loginButton.click();

  // 4. Validar redirección exitosa al home
  await expect(page).toHaveURL(new RegExp(expectedRoute), { timeout: 30000 });
  console.log('✔ Autenticación verificada exitosamente.');

  await page.waitForTimeout(4000);
});