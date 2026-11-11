# 📖 Historias de Usuario

Como usuario registrado del sistema UISARD, 
quiero ingresar mis credenciales en la pantalla de inicio de sesión,
para acceder al panel del empleado.

## 📄 Información complementaria

- **Rol:** Empleado UIS
- **Ruta de menú:** Panel del empleado → Situaciones administrativas → Permisos
- **Mockup:** Figma
- **Usuario de prueba:**
-   **Nombre:** kjgomezj
-   **Contraseña:** 123456
- **GitLab Front merge:** Merge1
- **GitLab Back merges:** Merge2

## ⚙️ Requerimientos funcionales
1. El usuario debe ingresar un nombre de usuario y contraseña válidos.
2. Al hacer clic en el botón de "Iniciar sesión", el sistema debe redirigir al home principal
3. La interfaz del home de UISARD debe ser visible en pantalla tras la autenticación.


## 📋✅ Criterios de aceptación
Scenario 01: Acceder a la interfaz UISARD.  
Given que el Empleado UIS se encuentra en la pantalla del login de UISARD
When el Empleado UIS digita sus credenciales
And da clic en el botón "Iniciar sesión"
Then el Sistema debe mostrar el home principal de UISARD.

Scenario 02: Cambiar de rol a Empleado UIS.  
Given que el Empleado UIS se encuentra en el home de UISARD
When el Empleado UIS cambia su rol actual por Empleado UIS
Then el Sistema debe mostrar el panel de información del empleado.

Scenario 03: Acceder al panel de situaciones administrativas.  
Given que el Empleado UIS se encuentra en el panel de información del empleado
When el Empleado UIS da clic en la card "Situaciones administrativas"
Then el Sistema debe redirigir al panel de situaciones administrativas.

## 📋✅ Definición de hecho
- Código documentado y/o comentado.
- Pruebas unitarias realizadas, superadas y con cobertura mayor al 80%.
- Resueltas incidencias detectadas en fase de desarrollo y pruebas.
- Cumple con los requisitos funcionales.
- Cumple con los requerimientos no funcionales.
- Cumple los criterios de aceptación.
- Todas las tareas asociadas están hechas.