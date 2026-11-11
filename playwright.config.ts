// ============================================================================
// ------------------------- playwright.config.js -----------------------------
// ============================================================================
// Configura el comportamiento del motor de Playwright, para permitir la visualización de la prueba en pantalla y la captura de resultados

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  outputDir: 'test-results', // Carpeta raíz para artefactos y evidencias
  preserveOutput: 'failures-only', // Solo conserva evidencias de tests que fallaron
  timeout: 90000,
  expect: {
    timeout: 15000,
  },
  use: {
    channel: 'chrome',
    headless: false, // Abre el navegador en pantalla
    ignoreHTTPSErrors: true, // Evita bloqueos por certificados en entornos develop
    actionTimeout: 15000, // Máximo 15 segundos esperando un clic o escritura
    navigationTimeout: 60000, // Máximo 60 segundos para cargar páginas pesadas
    viewport: { width: 1280, height: 720 },
    launchOptions: {
      slowMo: 400, // Pausa moderada entre acciones para no sobrecargar la red
    },
    screenshot: 'only-on-failure',
  },
  reporter: [
    ['list'],
    ['json', { outputFile: 'tests/execution_report.json' }],
  ],
});