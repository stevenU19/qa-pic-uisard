Característica: Autenticación de Usuarios en UISARD
  Como usuario registrado del sistema UISARD
  Quiero ingresar mis credenciales en la pantalla de inicio de sesión
  Para acceder al panel principal de la plataforma

  # ==========================================
  # --- ESCENARIOS BASE (DEFINIDOS POR QA) ---
  # ==========================================
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

  # ===================================================
  # --- ESCENARIOS ADICIONALES (GENERADOS POR IA) ---
  # ===================================================
  Scenario 04: Error de servidor al intentar iniciar sesión.
  Given que el Empleado UIS intenta iniciar sesión con una contraseña inválida
  When el Empleado UIS es redirigido al servidor de error
  Then se muestra un mensaje de error de conexión.
  
  Scenario 05: Validación de campo obligatorio del nombre de usuario.
  Given que el Empleado UIS no completa el campo de nombre de usuario
  When el Empleado UIS intenta iniciar sesión
  Then se muestra un mensaje de error de formato de campo.
  
  Scenario 06: Cambio de rol a Empleado UIS con información incorrecta.
  Given que el Empleado UIS se encuentra en el home de UISARD con información incorrecta
  When el Empleado UIS intenta cambiar su rol actual por Empleado UIS
  Then se muestra un mensaje de error de invalidación de rol.
  
  Scenario 07: Error de red en la autenticación.
  Given que el Empleado UIS se encuentra en la pantalla del login de UISARD
  When el Empleado UIS da clic en el botón de inicio de sesión y la conexión se vuelve errática
  Then se muestra un mensaje de error de conexión.
