# 📘 Guía de Instalación - INAKAT

Esta guía te llevará paso a paso por la instalación completa de INAKAT en tu entorno local.

---

## ⚙️ Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

### Software Requerido

- **Node.js** v18.0.0 o superior
  - Verifica: `node --version`
  - Descarga: https://nodejs.org/

- **npm** v9.0.0 o superior (viene con Node.js)
  - Verifica: `npm --version`

- **Git**
  - Verifica: `git --version`
  - Descarga: https://git-scm.com/

### Cuentas Necesarias

1. **Supabase** (Base de datos PostgreSQL)
   - Crea cuenta en: https://supabase.com
   - Plan gratuito disponible

2. **Vercel** (Deploy y Blob Storage)
   - Crea cuenta en: https://vercel.com
   - Plan gratuito disponible

---

## 🚀 Instalación Paso a Paso

### 1. Clonar el Repositorio

```bash
# HTTPS
git clone https://github.com/tu-usuario/inakat.git

# SSH (recomendado si tienes SSH keys)
git clone git@github.com:tu-usuario/inakat.git

# Entrar al directorio
cd inakat
```

---

### 2. Instalar Dependencias

```bash
npm install
```

Esto instalará todas las dependencias listadas en `package.json`:
- Next.js 14
- React 18
- Prisma
- TypeScript
- Tailwind CSS
- Y más...

**Tiempo estimado:** 2-5 minutos

---

### 3. Configurar Supabase (Base de Datos)

#### A) Crear Proyecto en Supabase

1. Ve a https://supabase.com/dashboard
2. Click en "New Project"
3. Llena los datos:
   - **Name:** inakat-dev
   - **Database Password:** (genera una segura y guárdala)
   - **Region:** South America (más cercana a México)
4. Click "Create new project"
5. Espera 2-3 minutos a que se cree

#### B) Obtener Connection Strings

1. En tu proyecto, ve a **Settings** → **Database**
2. Baja hasta "Connection string"
3. Copia ambas URLs:

**Connection Pooling (para Prisma):**
```
postgresql://postgres.xxx:[PASSWORD]@aws-1-us-west-1.pooler.supabase.com:5432/postgres
```

**Direct Connection (para migraciones):**
```
postgresql://postgres.xxx:[PASSWORD]@aws-1-us-west-1.compute.amazonaws.com:5432/postgres
```

4. Reemplaza `[PASSWORD]` con tu contraseña de BD

---

### 4. Configurar Vercel Blob (Almacenamiento)

#### A) Crear Cuenta y Proyecto

1. Ve a https://vercel.com
2. Crea cuenta o inicia sesión
3. Importa tu repositorio de GitHub
4. En el proyecto, ve a **Storage**
5. Click "Create Database"
6. Selecciona "Blob"
7. Click "Create"

#### B) Obtener Token

1. En la página de Blob Storage
2. Ve a ".env.local" tab
3. Copia el valor de `BLOB_READ_WRITE_TOKEN`

---

### 5. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
touch .env.local
```

Edita el archivo con tu editor favorito y agrega:

```env
# =============================================
# BASE DE DATOS (Supabase)
# =============================================
DATABASE_URL="postgresql://postgres.xxx:[PASSWORD]@aws-1-us-west-1.pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres.xxx:[PASSWORD]@aws-1-us-west-1.compute.amazonaws.com:5432/postgres"

# =============================================
# AUTENTICACIÓN
# =============================================
JWT_SECRET="genera-un-secret-super-largo-y-seguro-aqui-min-32-caracteres"

# =============================================
# ALMACENAMIENTO (Vercel Blob)
# =============================================
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxx"

# =============================================
# ADMIN POR DEFECTO
# =============================================
ADMIN_EMAIL="admin@inakat.com"
ADMIN_PASSWORD="AdminInakat2024!"
ADMIN_NOMBRE="Administrador"

# =============================================
# APLICACIÓN
# =============================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**⚠️ IMPORTANTE:**

- Reemplaza `[PASSWORD]` con tu contraseña de Supabase
- Genera un `JWT_SECRET` seguro:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **NUNCA** comitees `.env.local` a Git

---

### 6. Configurar Base de Datos

#### A) Generar Cliente de Prisma

```bash
npx prisma generate
```

Esto genera el cliente de Prisma basado en tu `schema.prisma`.

#### B) Ejecutar Migraciones

```bash
npx prisma migrate dev
```

Esto creará todas las tablas en tu base de datos.

Cuando pregunte por el nombre de la migración, escribe:
```
initial_setup
```

#### C) Poblar con Datos de Ejemplo

```bash
npx prisma db seed
```

Esto creará:
- ✅ 2 usuarios admin
- ✅ 18 vacantes de ejemplo
- ✅ 12 aplicaciones de ejemplo

**Credenciales de Admin:**
```
Email: admin@inakat.com
Password: AdminInakat2024!

Email: guillermo.sanchezy@gmail.com
Password: Guillermo2024!
```

---

### 7. Ejecutar en Desarrollo

```bash
npm run dev
```

Deberías ver:

```
▲ Next.js 14.0.0
- Local:        http://localhost:3000
- Network:      http://192.168.1.x:3000

✓ Ready in 2.5s
```

---

### 8. Verificar Instalación

Abre tu navegador en http://localhost:3000

#### Probar estas rutas:

**✅ Home**
```
http://localhost:3000
```

**✅ Búsqueda de Vacantes**
```
http://localhost:3000/talents
```
Deberías ver 18 vacantes

**✅ Login Admin**
```
http://localhost:3000/login
```
Usa: admin@inakat.com / AdminInakat2024!

**✅ Panel Admin**
```
http://localhost:3000/admin
```
Deberías ver el dashboard

**✅ Panel de Aplicaciones**
```
http://localhost:3000/applications
```
Deberías ver 12 aplicaciones

**✅ Crear Vacante**
```
http://localhost:3000/create-job
```

---

## 🛠️ Herramientas Útiles

### Prisma Studio

Interface visual para tu base de datos:

```bash
npx prisma studio
```

Abre: http://localhost:5555

### Ver Logs

```bash
# Logs en tiempo real
npm run dev

# Ver logs con detalles
NODE_OPTIONS='--inspect' npm run dev
```

---

## 🐛 Problemas Comunes

### Error: "Cannot connect to database"

**Solución:**
1. Verifica que `DATABASE_URL` y `DIRECT_URL` sean correctas
2. Verifica que la contraseña no tenga caracteres especiales sin escapar
3. Verifica que tu IP esté permitida en Supabase (debería estar por defecto)

### Error: "Module not found"

**Solución:**
```bash
# Borrar node_modules y reinstalar
rm -rf node_modules
npm install
```

### Error: "Port 3000 already in use"

**Solución:**
```bash
# Matar proceso en puerto 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# O usar otro puerto:
PORT=3001 npm run dev
```

### Error: Prisma relacionado

**Solución:**
```bash
# Regenerar cliente de Prisma
npx prisma generate

# Reset completo de BD (⚠️ borra todos los datos)
npx prisma migrate reset
```

---

## ✅ Checklist de Instalación

- [ ] Node.js 18+ instalado
- [ ] Repositorio clonado
- [ ] Dependencias instaladas
- [ ] Proyecto Supabase creado
- [ ] Vercel Blob configurado
- [ ] `.env.local` creado y configurado
- [ ] Prisma client generado
- [ ] Migraciones ejecutadas
- [ ] Seed ejecutado
- [ ] Servidor corriendo en http://localhost:3000
- [ ] Home carga correctamente
- [ ] Login funciona
- [ ] Vacantes se muestran
- [ ] Panel admin accesible

---

## 🎉 ¡Instalación Completa!

Si todos los checks están ✅, tu instalación está lista.

**Próximos pasos:**

1. Lee la [Guía de Usuario](./USER_GUIDE.md)
2. Revisa la [Documentación de API](./API.md)
3. Empieza a desarrollar

---

## 📞 ¿Necesitas Ayuda?

- 📧 Email: soporte@inakat.com
- 💬 Discord: [INAKAT Community](https://discord.gg/inakat)
- 📖 Docs: [docs.inakat.com](https://docs.inakat.com)

---

**¡Feliz desarrollo! 🚀**
