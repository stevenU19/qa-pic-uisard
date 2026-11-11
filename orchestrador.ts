// ============================================================================
// ------------------------- Orquestador Central ------------------------------
// ============================================================================
// Implementa el RAG, la inferencia con Ollama, el arranque de Playwright y el análisis de fallos

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'llama3.2:3b';
const DIR_DOCS = path.join(__dirname, 'docs');

// --- Contratos de Datos (Interfaces TypeScript) ---
export interface TestData {
  url: string;
  username: string;
  password: string;
  expected_route: string;
}

interface OllamaParsedOutput {
  additional_scenarios?: string;
  gherkin?: string;
  test_data?: Partial<TestData> & { usuario?: string; ruta_esperada?: string };
  datos_prueba?: Partial<TestData> & { usuario?: string; ruta_esperada?: string };
}

interface OllamaApiResponse {
  response: string;
}

// ============================================================================
// PROMPT EDITABLE: Generación de casos borde para Login y extracción de datos
// ============================================================================
const manualPrompt = (contextHU: string): string => `
Eres un Arquitecto de Pruebas QA y Líder Técnico de Automatización BDD.
Analiza la siguiente especificación de requerimientos o Historia de Usuario (HU) de software.

OBJETIVOS:
1. Extrae el título del requerimiento y la narrativa BDD (Como / Quiero / Para).
2. Genera de 2 a 4 escenarios adicionales en Gherkin (Scenario, Given, When, And, Then) en español enfocados en: casos negativos, validaciones de campos obligatorios, valores límite o errores de servidor.
3. Extrae todos los parámetros de ejecución técnica, de base de datos, de lógica de negocio que detectes en el documento.

REGLAS DE SALIDA:
- Siempre agrega los escenarios base que ya vengan definidos (únicamente escenarios lenguaje guerkin).
- Agrega los escenarios adicionales justo delante de los escenarios base, siguiendo exactamente la misma estructura
- Debes continuar la enumeración a partir del último Scenario. Y poner el título empezando en infinitivo.
- Agrega un salto de línea antes de cada palabra 'Scenario' entre cada uno de los CP generados.
- Aborda globalmente los escenarios base, con el objetivo de complementarlos y así abordar las situaciones no cubiertas inicialmente.
- Responde OBLIGATORIAMENTE con un objeto JSON estricto con esta estructura:
{
  "feature_title": "Nombre corto y conciso de la funcionalidad",
  "narrative": "Como [rol]\\nQuiero [acción]\\nPara [beneficio]",
  "additional_scenarios": "Scenario 01: ...\\nGiven ...\\nWhen ...\\nThen ...",
  "test_data": {
    "url": "URL identificada (o ruta relativa)",
    "username": "Usuario si aplica",
    "password": "Password si aplica",
    "expected_route": "Ruta esperada post-acción",
    "form_data": {
      "clave_parametro": "valor detectado"
    }
  }
}

Historia de Usuario:
${contextHU}
`;

// --- Extracción determinista de escenarios base definidos por QA ---
function extractBaseScenarios(markdownContent: string): string {
  const criteriaMatch = markdownContent.match(/##\s*📋?✅?\s*Criterios de aceptación([\s\S]*?)(?=##|$)/i);
  return criteriaMatch && criteriaMatch[1] ? criteriaMatch[1].trim() : '';
}

// --- Sanitizador de salida Gherkin ---
function sanitizeGherkinOutput(rawGherkinText: string): string {
  if (!rawGherkinText) return '';
  return rawGherkinText
    .replace(/```gherkin/gi, '')
    .replace(/```/g, '')
    .trim();
}

// --- Etapa 1: RAG Local ---
// Función para leer documentos (.md o .pdf) del directorio local

async function restoreDirectoryContext(): Promise<string> {
  console.log('\n[ETAPA 1 - RAG LOCAL] Leyendo directorio de Historias de Usuario...');
  const files = fs.readdirSync(DIR_DOCS);
  let cumulativeContext = '';

  for (const file of files) {
    const fullPath = path.join(DIR_DOCS, file);
    if (file.endsWith('.md') || file.endsWith('.txt')) {
      cumulativeContext += `\n--- Document: ${file} ---\n` + fs.readFileSync(fullPath, 'utf-8');
    } else if (file.endsWith('.pdf')) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const pdfParse = require('pdf-parse');
      const dataBuffer = fs.readFileSync(fullPath);
      const pdfData = await pdfParse(dataBuffer);
      cumulativeContext += `\n--- Document PDF: ${file} ---\n` + pdfData.text;
    }
  }
  return cumulativeContext;
}

// --- Etapa 2: Motor IA Local ---
// Función para comunicarse con Ollama local 

async function queryOllama(prompt: string, jsonFormat = true): Promise<string> {
  const requestBody: Record<string, unknown> = {
    model: MODEL,
    prompt: prompt,
    stream: false,
  };
  if (jsonFormat) requestBody.format = 'json';

  const response = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Error conectando con Ollama: ${response.statusText}`);
  }
  const data = (await response.json()) as OllamaApiResponse;
  return data.response;
}

// --- Flujo Principal del Pipeline ---
async function executePipeline(): Promise<void> {
  try {
    const contextHU = await restoreDirectoryContext();
    console.log('✔ Contexto documental cargado correctamente.');

    console.log(`\n[ETAPA 2 - MOTOR IA] Consultando modelo local (${MODEL})...`);
    const responseAI = await queryOllama(manualPrompt(contextHU), true);

    let parsedOutput: OllamaParsedOutput = {};
    try {
      parsedOutput = JSON.parse(responseAI) as OllamaParsedOutput;
    } catch {
      console.warn('Advertencia: Respuesta de IA no es JSON estricto, aplicando rescate.');
    }

    console.log('\n[ETAPA 3 - DISEÑO BDD] Generando artefactos Gherkin y parámetros...');

    // Parámetros técnicos para Playwright
    const rawData = parsedOutput.test_data || parsedOutput.datos_prueba || {};
    const urlDetected = rawData.url || (contextHU.match(/https?:\/\/[^\s\)]+login/i) || ['https://rsi.uis.edu.co/develop/auth/#/auth/login'])[0];
    const userDetected = rawData.username || rawData.usuario || (contextHU.match(/Nombre:\*\*\s*([^\r\n]+)/i) || [, 'kjgomezj'])[1].trim();
    const passDetected = rawData.password || (contextHU.match(/Contraseña:\*\*\s*([^\r\n]+)/i) || [, '123456'])[1].trim();
    const expectedRoute = rawData.expected_route || rawData.ruta_esperada || (contextHU.match(/https?:\/\/[^\s\)]+home/i) || ['https://rsi.uis.edu.co/develop/auth/#/auth/home'])[0];

    const safeTestData: TestData = {
      url: urlDetected,
      username: userDetected,
      password: passDetected,
      expected_route: expectedRoute,
    };

    // 2. Ensamblaje híbrido de escenarios Gherkin
    const baseScenarios = extractBaseScenarios(contextHU);
    const rawAdditionalScenarios = parsedOutput.additional_scenarios || parsedOutput.gherkin || '';
    const cleanAdditionalScenarios = sanitizeGherkinOutput(
      typeof rawAdditionalScenarios === 'string' ? rawAdditionalScenarios : JSON.stringify(rawAdditionalScenarios, null, 2)
    );

    const featureContent = `Característica: Autenticación de Usuarios en UISARD
  Como usuario registrado del sistema UISARD
  Quiero ingresar mis credenciales en la pantalla de inicio de sesión
  Para acceder al panel principal de la plataforma

  # ==========================================
  # --- ESCENARIOS BASE (DEFINIDOS POR QA) ---
  # ==========================================
${baseScenarios ? baseScenarios.split('\n').map((line) => `  ${line}`).join('\n') : '  # Sin escenarios base detectados'}

  # ===================================================
  # --- ESCENARIOS ADICIONALES (GENERADOS POR IA) ---
  # ===================================================
${cleanAdditionalScenarios ? cleanAdditionalScenarios.split('\n').map((line) => `  ${line}`).join('\n') : '  # Sin escenarios adicionales generados'}
`;

    fs.mkdirSync(path.join(__dirname, 'features'), { recursive: true });
    fs.mkdirSync(path.join(__dirname, 'tests'), { recursive: true });

    fs.writeFileSync(path.join(__dirname, 'features', 'generatedAI.feature'), featureContent);
    fs.writeFileSync(path.join(__dirname, 'tests', 'context_ai.json'), JSON.stringify(safeTestData, null, 2));

    console.log('✔ Escenarios consolidados en: features/generatedAI.feature');
    console.log('✔ Parámetros extraídos en: tests/context_ai.json');

    // --- Etapa 4: Automatización E2E ---
    // Ejecutar Playwright abriendo el navegador 

    console.log('\n[ETAPA 4 - PLAYWRIGHT] Iniciando navegador y ejecutando prueba de Login...');
    let runningState = 'EXITOSO';
    let logDetails = '';

    // npx playwright test --ui
    try {
      const stdout = execSync('npx playwright test --headed', { encoding: 'utf-8' });
      logDetails = stdout;
      console.log(stdout);
    } catch (errorPlaywright: unknown) {
      runningState = 'FALLIDO';
      const err = errorPlaywright as { stdout?: string; stderr?: string; message?: string };
      logDetails = (err.stdout || '') + '\n' + (err.stderr || err.message || '');
      console.error('✖ La prueba en Playwright reportó un fallo:\n', logDetails);
    }

    // --- Etapa 5: Ciclo de Retroalimentación (Enviar resultados de vuelta a llama3.2:3b) ---
    console.log(`\n[RETROALIMENTACIÓN IA] Analizando resultado (${runningState}) con ${MODEL}...`);
    const feedbackPrompt = `
Actúa como un Auditor de Calidad QA. Se ejecutó una prueba automatizada de Login basada en esta Historia de Usuario:
${contextHU}

Resultado de ejecución: ${runningState}.
Registro de consola:
${logDetails.slice(-600)}

Escribe un dictamen técnico breve (máximo 5 líneas) indicando si se cumplió el criterio de autenticación o qué se debe revisar.
`;

    const finalReport = await queryOllama(feedbackPrompt, false);
    console.log('\n============================================================');
    console.log('DICTAMEN DE RETROALIMENTACIÓN (OLLAMA - LLAMA 3.2:3B):');
    console.log(finalReport.trim());
    console.log('============================================================\n');

  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error en el Orquestador:', err.message);
  }
}

executePipeline();