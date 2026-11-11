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
  Scenario 04: Ingreso de campos obligatorios.
  Given que el Empleado UIS se encuentra en la pantalla del login de UISARD
  When el Empleado UIS dejará de ingresar sus credenciales
  Then el Sistema debe mostrar un mensaje de error de llenado de campos obligatorios.
  
  Scenario 05: Acceso a la interfaz con conexión a la base de datos.
  Given que el Empleado UIS se encuentra en la pantalla del login de UISARD y la base de datos está disponible
  When el Empleado UIS se loguea correctamente
  Then el Sistema debe mostrar la interfaz principal de UISARD con datos de la base de datos.
  
  Scenario 06: Acceso a la interfaz con error de servidor.
  Given que el Empleado UIS se encuentra en la pantalla del login de UISARD y el servidor está en mantenimiento
  When el Empleado UIS se loguea correctamente
  Then el Sistema debe mostrar un mensaje de error de conexión al servidor.
  
  test_data": {
