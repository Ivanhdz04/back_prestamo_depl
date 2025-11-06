# 🚀 Guía Completa: Configurar Azure App Service para NestJS

## 📋 Requisitos Previos

1. ✅ Cuenta de Azure con suscripción activa
2. ✅ Tu proyecto ya conectado a Azure PostgreSQL
3. ✅ Git configurado (opcional, para despliegue automático)

---

## 📝 PASO 1: Crear el App Service

### 1.1 Acceder al Portal de Azure

1. Ve a [https://portal.azure.com](https://portal.azure.com)
2. Inicia sesión con tu cuenta de Azure

### 1.2 Crear el Recurso

1. Click en el botón **"+ Create a resource"** (arriba izquierda)
2. En el buscador, escribe: **"Web App"**
3. Selecciona **"Web App"** (debería aparecer como primera opción)
4. Click en **"Create"**

### 1.3 Configurar los Detalles Básicos

En la pestaña **"Basics"**, completa:

#### Project Details
- **Subscription**: Selecciona tu suscripción
- **Resource Group**: 
  - Si ya tienes uno con tu PostgreSQL, úsalo
  - Si no, click en **"Create new"** y ponle un nombre (ej: `rg-prestamos`)

#### Instance Details
- **Name**: `back-prestamos-v2` (o el nombre que prefieras)
  - ⚠️ **Importante**: Este nombre debe ser único globalmente
  - Si está ocupado, prueba: `back-prestamos-v2-tu-nombre`
- **Publish**: Selecciona **"Code"**
- **Runtime stack**: Selecciona **"Node 22 LTS"**
- **Operating System**: Selecciona **"Linux"** (recomendado) o **"Windows"**
- **Region**: 
  - ⚠️ **MUY IMPORTANTE**: Selecciona la **misma región** donde está tu Azure PostgreSQL
  - Esto reduce latencia y costos

#### App Service Plan
- **App Service Plan**: Click en **"Create new"**
  - **Name**: `plan-prestamos-v2`
  - **Operating System**: Debe coincidir con el que elegiste arriba (Linux/Windows)
  - **Region**: Misma región que elegiste
  - **Pricing tier**: 
    - Para empezar: **"Free F1"** (gratis, pero limitado)
    - Para producción: **"Basic B1"** ($13/mes aprox) o superior
    - Click en **"Select"**

### 1.4 Revisar y Crear

1. Click en **"Review + create"** (abajo)
2. Espera a que valide la configuración
3. Si todo está bien, click en **"Create"**
4. ⏳ Espera 2-5 minutos mientras se crea el App Service
5. Cuando termine, click en **"Go to resource"**

---

## ⚙️ PASO 2: Configurar Variables de Entorno

### 2.1 Acceder a Configuration

1. En tu App Service (deberías estar en la página principal)
2. En el menú izquierdo, busca **"Configuration"**
3. Click en **"Configuration"**

### 2.2 Agregar Application Settings

1. Ve a la pestaña **"Application settings"**
2. Click en **"+ New application setting"** para cada variable

Agrega estas variables **UNA POR UNA**:

| Name | Value | Descripción |
|------|-------|-------------|
| `DB_HOST` | `prestappbd.postgres.database.azure.com` | Tu host de PostgreSQL |
| `DB_PORT` | `5432` | Puerto de PostgreSQL |
| `DB_USER` | `IvanAdmin` | Tu usuario de BD |
| `DB_PASSWORD` | `tu_contraseña_real` | ⚠️ Tu contraseña real de PostgreSQL |
| `DB_NAME` | `bdPrestamos` | Nombre de tu base de datos |
| `DB_SSL` | `true` | SSL habilitado para Azure |
| `JWT_SECRET` | `tu_secret_key_muy_segura_aqui` | ⚠️ Genera una clave secreta fuerte |
| `PORT` | `8080` | Puerto que usa Azure (importante) |
| `STAGE` | `prod` | Indica que es producción |
| `CORS_ORIGINS` | `https://tu-frontend.azurewebsites.net` | URLs permitidas (separadas por comas) |

### 2.3 Guardar los Cambios

1. Después de agregar todas las variables, click en **"Save"** (arriba)
2. ⏳ Espera a que se guarden (aparecerá una notificación)
3. Click en **"Continue"** cuando te pregunte si quieres reiniciar

### 📝 Notas Importantes:

- **DB_PASSWORD**: Usa la misma contraseña que usas en pgAdmin
- **JWT_SECRET**: Genera una clave aleatoria fuerte (puedes usar: `openssl rand -base64 32`)
- **CORS_ORIGINS**: Si tienes frontend, agrega su URL. Si no, déjalo vacío o pon `*` temporalmente
- **PORT**: Azure usa el puerto 8080 automáticamente, pero es bueno especificarlo

---

## 🔧 PASO 3: Configurar Build y Startup

### 3.1 Configurar Startup Command

1. Sigue en **"Configuration"**
2. Ve a la pestaña **"General settings"**
3. Busca la sección **"Stack settings"**
4. En **"Startup Command"**, escribe:
   ```
   npm install && npm run build && npm run start:prod
   ```
   O más simple (Azure puede hacer el build automático):
   ```
   npm run start:prod
   ```

### 3.2 Configurar Build Automático (Opcional pero Recomendado)

1. En **"General settings"**, busca **"Build settings"**
2. Si está disponible, activa **"Enable build automation"**
3. Esto hará que Azure ejecute `npm install` y `npm run build` automáticamente

### 3.3 Guardar

1. Click en **"Save"** (arriba)
2. ⏳ Espera a que se guarde

---

## 📦 PASO 4: Desplegar tu Código

Tienes 3 opciones. Te recomiendo la **Opción A** (GitHub) porque es más fácil y automática.

### 🟢 Opción A: Desde GitHub (RECOMENDADO - Más Fácil)

#### 4.1 Subir tu código a GitHub

1. Si no tienes repositorio, créalo en [GitHub](https://github.com)
2. En tu terminal local:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/tu-repo.git
   git push -u origin main
   ```

#### 4.2 Conectar GitHub con Azure

1. En tu App Service, ve a **"Deployment Center"** (menú izquierdo)
2. En **"Source"**, selecciona **"GitHub"**
3. Click en **"Authorize"** y autoriza Azure a acceder a tu GitHub
4. Selecciona:
   - **Organization**: Tu organización o usuario
   - **Repository**: Tu repositorio
   - **Branch**: `main` (o `master`)
5. Click en **"Save"**
6. ⏳ Azure comenzará a desplegar automáticamente
7. Puedes ver el progreso en **"Logs"**

#### 4.3 Despliegue Automático

- Cada vez que hagas `git push`, Azure desplegará automáticamente
- Puedes ver los logs en **"Deployment Center"** → **"Logs"**

---

### 🟡 Opción B: Desde Visual Studio Code

1. Instala la extensión **"Azure App Service"** en VS Code
2. Abre tu proyecto en VS Code
3. Click en el ícono de Azure en la barra lateral
4. Click en **"Sign in to Azure"** e inicia sesión
5. Expande **"App Service"** → Encuentra tu App Service
6. Click derecho en tu App Service → **"Deploy to Web App"**
7. Selecciona la carpeta de tu proyecto
8. ⏳ Espera a que termine el despliegue

---

### 🔵 Opción C: Desde Azure CLI

1. Instala [Azure CLI](https://aka.ms/installazurecliwindows) si no lo tienes
2. Abre PowerShell o Terminal
3. Ejecuta:
   ```bash
   # Login
   az login
   
   # Navega a tu proyecto
   cd C:\Users\ISIS\Desktop\back_prestamos_v2
   
   # Desplegar
   az webapp up --name back-prestamos-v2 --resource-group tu-resource-group --runtime "NODE:22-lts"
   ```
4. ⏳ Espera a que termine

## Opción 2: Despliegue con Docker (Avanzado)

Si prefieres usar Docker, crea un `Dockerfile` y despliega en Azure Container Apps.

---

## ✅ PASO 5: Verificar que Funciona

### 5.1 Obtener la URL de tu App

1. En tu App Service, ve a **"Overview"** (menú izquierdo)
2. Verás la **URL** de tu aplicación (algo como: `https://back-prestamos-v2.azurewebsites.net`)
3. **Copia esa URL**

### 5.2 Probar los Endpoints

Abre en tu navegador:

1. **Swagger (Documentación)**:
   ```
   https://tu-app.azurewebsites.net/api
   ```
   - Deberías ver la documentación de Swagger
   - ✅ Si funciona, tu servidor está corriendo

2. **Endpoint de Seed** (crear usuario root):
   ```
   https://tu-app.azurewebsites.net/api/v1/seed
   ```
   - Método: **POST**
   - Puedes probarlo desde Swagger o con Postman
   - ✅ Si funciona, la conexión a BD está bien

### 5.3 Ver Logs en Tiempo Real

1. En tu App Service, ve a **"Log stream"** (menú izquierdo)
2. Verás los logs en tiempo real
3. Si hay errores, aparecerán aquí

## Notas Importantes

- **Synchronize**: Ya está desactivado en producción (`STAGE=prod`)
- **SSL**: Ya está configurado para Azure PostgreSQL
- **CORS**: Configura `CORS_ORIGINS` con las URLs de tu frontend
- **Logs**: Ve a **Log stream** en Azure Portal para ver logs en tiempo real
- **Escalado**: Puedes escalar tu App Service según necesites

---

## 🔍 Troubleshooting (Solución de Problemas)

### Problema: "Application Error" o página en blanco

**Solución:**
1. Ve a **"Log stream"** y revisa los errores
2. Verifica que todas las variables de entorno estén correctas
3. Revisa que el **Startup Command** sea: `npm run start:prod`

### Problema: Error de conexión a la base de datos

**Solución:**
1. Verifica que `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` estén correctos
2. Asegúrate de que `DB_SSL=true`
3. En Azure PostgreSQL, verifica que permita conexiones desde Azure Services
4. Ve a tu Azure PostgreSQL → **"Connection security"** → Activa **"Allow Azure services"**

### Problema: Puerto incorrecto

**Solución:**
1. Asegúrate de que `PORT=8080` esté en las variables de entorno
2. Azure usa el puerto 8080 por defecto

### Problema: Build falla

**Solución:**
1. Ve a **"Deployment Center"** → **"Logs"** para ver el error
2. Verifica que `package.json` tenga el script `start:prod`
3. Asegúrate de que el código compile localmente primero

### Problema: CORS bloqueado

**Solución:**
1. Verifica que `CORS_ORIGINS` tenga las URLs correctas
2. Si es para desarrollo, puedes poner `*` temporalmente (no recomendado para producción)

---

## 📚 Recursos Adicionales

- [Documentación oficial de Azure App Service](https://docs.microsoft.com/azure/app-service/)
- [Logs de Azure App Service](https://docs.microsoft.com/azure/app-service/troubleshoot-diagnostic-logs)
- [Configuración de Node.js en Azure](https://docs.microsoft.com/azure/app-service/configure-language-nodejs)

---

## 🎉 ¡Listo!

Si seguiste todos los pasos, tu API NestJS debería estar funcionando en Azure. 

**Tu API estará disponible en:**
- `https://tu-app.azurewebsites.net/api/v1/...`
- Swagger: `https://tu-app.azurewebsites.net/api`

¿Necesitas ayuda con algo más? 🚀

