## 🚀 Pipeline Inteligente de Calidad (PIC) - Módulo Login UISARD

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-orange.svg)](https://playwright.dev/)
[![Ollama](https://img.shields.io/badge/Ollama-Llama_3.2:3b-black.svg)](https://ollama.com/)
[![Node.js](https://img.shields.io/badge/Node.js->=18.0.0-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

Arquitectura de automatización de pruebas de software asistida por Inteligencia Artificial local y RAG (*Retrieval-Augmented Generation*). Transforma Historias de Usuario en especificaciones BDD, genera casos borde de forma asistida, extrae parámetros técnicos y ejecuta pruebas de regresión funcionales E2E sobre el sistema **UISARD** sin depender de APIs en la nube ni costos de licenciamiento.

---

### 📌 Características Principales

- **Soberanía y Privacidad de Datos:** Inferencia 100% on-premise utilizando **Ollama** (`llama3.2:3b`). Ningún dato de prueba o requerimiento sale de la infraestructura local.
- **RAG Local Desacoplado:** Ingesta de Historias de Usuario en formato Markdown/PDF sin necesidad de motores de bases de datos pesados para la fase inicial.
- **Enfoque BDD Híbrido:**
  - **Determinista (QA):** Extracción exacta mediante expresiones regulares de los criterios de aceptación y escenarios base definidos por el analista QA.
  - **Asistido (IA):** Generación automática de casos límite, valores negativos y pruebas de robustez
- **Ejecución E2E Robusta con Playwright:**
  - Sincronización asíncrona adaptada a interfaces en Angular Material.
  - Manejo en segundo plano de políticas y banners de cookies mediante `addLocatorHandler`.
  - Desacoplamiento total de datos mediante contratos de interfaz TypeScript (`context_ai.json`).
- **Circuito Cerrado de Retroalimentación:** Diagnóstico automático post-ejecución donde el LLM analiza el registro de consola de Playwright y emite un dictamen técnico de cumplimiento.

---
### 📂 Estructura del Repositorio
```text
qa-pic-uisard/
|-- docs/
|   |-- HU-01-Login.md             # Requerimiento formal y criterios de aceptación
|-- features/
|   |-- generatedAI.feature        # [Generado] Especificación BDD hibrida (QA + IA)
|-- node_modules/                  # Librerías
|-- test-results/                  # Resultados del test
|-- tests/
|   |-- context_ai.json            # [Generado] Datos técnicos (URL, roles)
|   |-- login.spec.ts              # Script E2E en Playwright tipado en TypeScript
|   |-- execution_report.json      # [Generado] Métricas detalladas de ejecución
|-- orchestrador.ts                # Orquestador del pipeline (RAG + Ollama + Runner)
|-- package.json                   # Definición de scripts y dependencias npm
|-- playwright.config.ts           # Configuración del motor de pruebas (slowMo, timeouts)
|-- tsconfig.json                  # Configuración del compilador TypeScript
|-- .gitignore                     # Exclusión de node_modules y capturas temporales
```

### 🏗️ Arquitectura del Pipeline

El orquestador central (`orchestrador.ts`) ejecuta el flujo en 5 fases secuenciales:

```text
[ Documentación HU ] 
       │
       ▼
 [ Etapa 1: RAG Local ] ──── Lectura de docs/HU-*.md y PDFs
       │
       ▼
 [ Etapa 2: Motor IA ] ───── Ollama (Llama 3.2:3b) genera casos borde y parámetros
       │
       ▼
 [ Etapa 3: Diseño BDD ] ─── Ensamblado estricto:
       │                      ├── features/generatedAI.feature
       │                      └── tests/context_ai.json
       ▼
 [ Etapa 4: Playwright ] ─── Ejecución E2E sobre Chromium/Google Chrome
       │
       ▼
 [ Etapa 5: Feedback IA ] ── Análisis del resultado del Motor IA (EXITOSO/FALLIDO) y dictamen técnico
```

### ⚙️ Requisitos Previos

- **Node.js:** Versión 18.x o superior.
- **Google Chrome** instalado en el sistema operativo (Chromium descargado por Playwright u otro navegador de preferencia).
- **Ollama:** Instalado y ejecutándose en segundo plano (http://localhost:11434).
```console
# Descargar modelo:
ollama pull llama3.2:3b
# Ejecutar modelo:
ollama run llama3.2:3b
```

### 🚀 Instalación y Despliegue Rápido
Clonar el repositorio:
```console
git clone [https://github.com/stevenU19/qa-pic-uisard.git](https://github.com/stevenU19/qa-pic-uisard.git)
```

Instalar dependencias del proyecto:
```console
cd qa-pic-uisard
npm install
```
Instalar el binario del navegador de Playwright (opcional):
```console
npx playwright install chromium
```

### 🧪 Ejecución
Modo Completo (Pipeline Inteligente End-to-End)
- Ejecuta la ingesta RAG, la consulta a Ollama, la generación BDD, la ejecución en Playwright con navegador visible y el reporte final de retroalimentación:

```console
npx tsx orchestrador.ts
```
- Ejecutar Únicamente la Prueba E2E en Playwright:  
Para validar únicamente el script de automatización utilizando los parámetros guardados en tests/context_ai.json:

```console
npx playwright test tests/login.spec.ts --headed
```

### 📊 Salidas del Pipeline
- *features/generatedAI.feature:* Documento de especificación BDD que contiene tanto los escenarios manuales del analista como los generados por la IA.
- *tests/context_ai.json:* Contrato de datos JSON con las rutas, roles y credenciales detectadas para la ejecución.
- *tests/reporte_ejecucion.json:* Registro detallado de pasos, tiempos de ejecución y aserciones de Playwright.

### 👤 Autor
Wilmer Steven Farfán Castillo   
Ingeniero QA   
Universidad Industrial de Santander (UIS)   

