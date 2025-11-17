# 🔐 Variables de Entorno - INAKAT

Guía completa de todas las variables de entorno necesarias para INAKAT.

---

## 📋 Tabla de Contenidos

1. [Archivo .env.local](#archivo-envlocal)
2. [Base de Datos](#base-de-datos)
3. [Autenticación](#autenticación)
4. [Almacenamiento](#almacenamiento)
5. [Configuración de Admin](#configuración-de-admin)
6. [Aplicación](#aplicación)
7. [Producción vs Desarrollo](#producción-vs-desarrollo)

---

## 📄 Archivo .env.local

Crea este archivo en la raíz de tu proyecto:

```bash
touch .env.local
```

⚠️ **IMPORTANTE:** Este archivo **NUNCA** debe commitearse a Git.

Verificar que `.gitignore` incluye:
```
.env.local
.env*.local
```

---

## 🗄️ Base de Datos

### DATABASE_URL

**Propósito:** URL de conexión pooled a PostgreSQL para queries regulares

**Origen:** Supabase → Project Settings → Database → Connection String → Connection pooling

**Formato:**
```env
DATABASE_URL="postgresql://postgres.xxx:[PASSWORD]@aws-1-us-west-1.pooler.supabase.com:5432/postgres"
```

**Componentes:**
- `postgres.xxx` - ID único de tu proyecto Supabase
- `[PASSWORD]` - Contraseña de tu base de datos
- `aws-1-us-west-1.pooler.supabase.com` - Host del pooler
- `5432` - Puerto de PostgreSQL
- `postgres` - Nombre de la base de datos

**Ejemplo:**
```env
DATABASE_URL="postgresql://postgres.abcdefghijklmn:MySecurePass123@aws-1-us-west-1.pooler.supabase.com:5432/postgres"
```

**⚠️ Notas:**
- Usa connection pooling para mejor performance
- Supabase limita conexiones directas a 60
- Con pooling puedes tener 10,000+ conexiones

---

### DIRECT_URL

**Propósito:** URL de conexión directa para migraciones de Prisma

**Origen:** Supabase → Project Settings → Database → Connection String → Direct connection

**Formato:**
```env
DIRECT_URL="postgresql://postgres.xxx:[PASSWORD]@aws-1-us-west-1.compute.amazonaws.com:5432/postgres"
```

**Diferencia con DATABASE_URL:**
- Usa `.compute.amazonaws.com` en lugar de `.pooler.supabase.com`
- Conexión directa sin pooling
- Requerida para `prisma migrate`

**Ejemplo:**
```env
DIRECT_URL="postgresql://postgres.abcdefghijklmn:MySecurePass123@aws-1-us-west-1.compute.amazonaws.com:5432/postgres"
```

**⚠️ Notas:**
- Solo usar para migraciones
- No usar en queries de la aplicación
- Conexiones limitadas a 60

---

### Obtener Credenciales de Supabase

**Paso a paso:**

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Click en **Settings** (⚙️) → **Database**
4. Baja hasta **Connection string**
5. Copia ambas URLs:
   - **Connection pooling** → `DATABASE_URL`
   - **Direct connection** → `DIRECT_URL`
6. Reemplaza `[YOUR-PASSWORD]` con tu contraseña de BD

**Contraseña olvidada:**
- Settings → Database → Database password → Reset password

---

## 🔐 Autenticación

### JWT_SECRET

**Propósito:** Clave secreta para firmar y verificar tokens JWT

**Generación:**

```bash
# Opción 1: Con Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Opción 2: Con OpenSSL
openssl rand -hex 32

# Opción 3: Online (menos seguro)
# https://www.grc.com/passwords.htm
```

**Formato:**
```env
JWT_SECRET="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
```

**Requisitos:**
- ✅ Mínimo 32 caracteres
- ✅ Hexadecimal (0-9, a-f)
- ✅ Generado aleatoriamente
- ✅ Único por ambiente

**Ejemplo:**
```env
JWT_SECRET="8f4c2a9d7e6b5a3c1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1"
```

**⚠️ Seguridad:**
- 🔴 **NUNCA** compartir este valor
- 🔴 **NUNCA** commitear a Git
- 🔴 **NUNCA** usar valores por defecto
- ✅ Diferente para cada ambiente (dev, staging, prod)
- ✅ Rotar cada 3-6 meses

**¿Qué pasa si se filtra?**
- Todos los tokens existentes quedan comprometidos
- Atacante puede generar tokens válidos
- **Acción:** Cambiar inmediatamente y forzar re-login de todos

---

## 📦 Almacenamiento

### BLOB_READ_WRITE_TOKEN

**Propósito:** Token para subir archivos a Vercel Blob Storage

**Origen:** Vercel Project → Storage → Blob → .env.local tab

**Formato:**
```env
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_A1b2C3d4E5f6_G7H8I9J0K1L2M3N4O5P6Q7R8S9T0"
```

**Obtención:**

1. Ve a https://vercel.com
2. Selecciona tu proyecto
3. **Storage** → **Create Database** → **Blob**
4. Click en **Create**
5. En la pestaña **.env.local** copia el token

**Ejemplo:**
```env
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_x7k2mP9qR4tL1nB5wC8vD3sF6hJ0gM2aY4zE7"
```

**⚠️ Notas:**
- Permite lectura Y escritura
- Vercel también ofrece tokens de solo lectura
- Token tiene acceso a TODOS los archivos del proyecto

**Límites (Plan Free):**
- 1GB de almacenamiento
- 100GB de ancho de banda/mes

**Alternativas:**
- AWS S3
- Cloudinary
- Uploadthing

---

## 👨‍💼 Configuración de Admin

Variables para crear usuario admin por defecto al ejecutar el seed.

### ADMIN_EMAIL

**Propósito:** Email del usuario administrador por defecto

**Formato:**
```env
ADMIN_EMAIL="admin@inakat.com"
```

**Ejemplo:**
```env
ADMIN_EMAIL="admin@tuempresa.com"
```

**⚠️ Notas:**
- Se crea al ejecutar `npx prisma db seed`
- Puedes cambiarlo antes del seed
- Después del seed, cambiar en la base de datos

---

### ADMIN_PASSWORD

**Propósito:** Contraseña del usuario administrador por defecto

**Formato:**
```env
ADMIN_PASSWORD="AdminInakat2024!"
```

**Ejemplo:**
```env
ADMIN_PASSWORD="MySecureAdminPass123!"
```

**Requisitos:**
- Mínimo 8 caracteres
- Al menos 1 mayúscula
- Al menos 1 número
- Caracteres especiales recomendados

**⚠️ Seguridad:**
- Cambiar después del primer login
- No usar contraseñas obvias
- Se guarda hasheada con bcrypt

---

### ADMIN_NOMBRE

**Propósito:** Nombre del usuario administrador

**Formato:**
```env
ADMIN_NOMBRE="Administrador"
```

**Ejemplo:**
```env
ADMIN_NOMBRE="Juan Pérez"
```

---

## 🌐 Aplicación

### NEXT_PUBLIC_APP_URL

**Propósito:** URL base de la aplicación

**Formato:**
```env
# Desarrollo
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Producción
NEXT_PUBLIC_APP_URL="https://inakat.vercel.app"
```

**Uso:**
- Links absolutos en emails
- Redirects después de login
- Compartir links

**⚠️ Prefijo `NEXT_PUBLIC_`:**
- Se expone al cliente (navegador)
- Accesible vía `process.env.NEXT_PUBLIC_APP_URL`
- No incluir datos sensibles

---

## 🔄 Producción vs Desarrollo

### Archivo .env.local (Desarrollo)

```env
# Supabase Dev
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# JWT Dev (diferente a producción!)
JWT_SECRET="dev-secret-32-chars-minimum-length"

# Vercel Blob Dev
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# Admin
ADMIN_EMAIL="admin@inakat.com"
ADMIN_PASSWORD="AdminInakat2024!"
ADMIN_NOMBRE="Administrador"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

### Variables en Vercel (Producción)

**Configurar en:** Vercel Project → Settings → Environment Variables

```env
# Supabase Prod (proyecto diferente!)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# JWT Prod (¡DIFERENTE a dev!)
JWT_SECRET="prod-secret-must-be-different-32-chars-min"

# Vercel Blob Prod
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# Admin Prod
ADMIN_EMAIL="admin@inakat.com"
ADMIN_PASSWORD="SecureProductionPass123!"
ADMIN_NOMBRE="Administrador"

# App Prod
NEXT_PUBLIC_APP_URL="https://inakat.com"
```

**⚠️ Importante:**
- Usar bases de datos SEPARADAS para dev y prod
- JWT_SECRET DIFERENTE en cada ambiente
- Nunca usar datos de producción en desarrollo

---

## 📝 Plantilla Completa

Copia esto a tu `.env.local`:

```env
# =============================================
# BASE DE DATOS (Supabase)
# =============================================
DATABASE_URL="postgresql://postgres.xxx:[PASSWORD]@aws-1-us-west-1.pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres.xxx:[PASSWORD]@aws-1-us-west-1.compute.amazonaws.com:5432/postgres"

# =============================================
# AUTENTICACIÓN
# =============================================
# Generar con: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET="reemplazar-con-secret-aleatorio-minimo-32-caracteres"

# =============================================
# ALMACENAMIENTO (Vercel Blob)
# =============================================
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxx"

# =============================================
# ADMIN POR DEFECTO (para seed)
# =============================================
ADMIN_EMAIL="admin@inakat.com"
ADMIN_PASSWORD="AdminInakat2024!"
ADMIN_NOMBRE="Administrador"

# =============================================
# APLICACIÓN
# =============================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# =============================================
# OPCIONAL - EMAIL (próximamente)
# =============================================
# SMTP_HOST="smtp.gmail.com"
# SMTP_PORT="587"
# SMTP_USER="noreply@inakat.com"
# SMTP_PASS="app-specific-password"

# =============================================
# OPCIONAL - ANALYTICS (próximamente)
# =============================================
# GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
# HOTJAR_ID="1234567"
```

---

## ✅ Checklist de Configuración

- [ ] `.env.local` creado
- [ ] `DATABASE_URL` configurado y probado
- [ ] `DIRECT_URL` configurado
- [ ] `JWT_SECRET` generado aleatoriamente (32+ chars)
- [ ] `BLOB_READ_WRITE_TOKEN` obtenido de Vercel
- [ ] Variables de admin configuradas
- [ ] `NEXT_PUBLIC_APP_URL` correcto
- [ ] `.env.local` en `.gitignore`
- [ ] Conexión a BD verificada: `npx prisma db pull`
- [ ] Servidor reiniciado después de cambios

---

## 🐛 Debugging

### Ver variables cargadas

```bash
# En desarrollo
node -e "require('dotenv').config({path:'.env.local'}); console.log(process.env.DATABASE_URL)"

# Ver todas (sin valores sensibles)
node -e "require('dotenv').config({path:'.env.local'}); console.log(Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('JWT')))"
```

### Verificar conexión a BD

```bash
npx prisma db pull
# Si funciona, la conexión es correcta
```

### Probar JWT Secret

```typescript
// test-jwt.ts
import * as jose from 'jose';

const secret = process.env.JWT_SECRET!;
const token = await new jose.SignJWT({ userId: 1 })
  .setProtectedHeader({ alg: 'HS256' })
  .sign(new TextEncoder().encode(secret));

console.log('Token generated:', token);
```

---

## 🔒 Seguridad

### ❌ NUNCA:

- Commitear `.env.local` a Git
- Compartir credenciales por email/chat
- Usar valores por defecto en producción
- Reusar JWT_SECRET entre ambientes
- Hardcodear valores en código

### ✅ SIEMPRE:

- Usar `.gitignore` para `.env*`
- Variables diferentes por ambiente
- Rotar secretos periódicamente
- Usar secrets managers en prod (Vercel Env Vars)
- Mínimo privilegio (tokens con permisos justos)

---

## 📚 Referencias

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Prisma Connection URLs](https://www.prisma.io/docs/reference/database-reference/connection-urls)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pool)

---

**Última actualización:** Enero 2025
