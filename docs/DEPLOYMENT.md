# 🚀 Guía de Deploy - INAKAT

Guía completa para desplegar INAKAT a producción en Vercel.

---

## 📋 Pre-requisitos

Antes de hacer deploy, asegúrate de tener:

- ✅ Código funcionando en desarrollo
- ✅ Cuenta de GitHub
- ✅ Cuenta de Vercel
- ✅ Base de datos Supabase (producción)
- ✅ Vercel Blob Storage configurado

---

## 🎯 Estrategia de Deploy

### Ambientes

**Desarrollo:**
- `localhost:3000`
- Base de datos de desarrollo
- Variables de entorno locales

**Preview (Staging):**
- URLs temporales de Vercel
- Base de datos de staging (recomendado)
- Variables de preview

**Producción:**
- Dominio principal
- Base de datos de producción
- Variables de producción

---

## 🏗️ Preparación

### 1. Crear Proyecto Supabase de Producción

**⚠️ IMPORTANTE:** Usa una base de datos DIFERENTE para producción

1. Ve a https://supabase.com/dashboard
2. Click "New Project"
3. Llena:
   - **Name:** `inakat-production`
   - **Database Password:** (genera una fuerte y guárdala en password manager)
   - **Region:** South America
4. Espera 2-3 minutos

**Obtener URLs:**
- Settings → Database
- Copia `DATABASE_URL` (pooling)
- Copia `DIRECT_URL` (direct)
- Guárdalas para el siguiente paso

---

### 2. Preparar Repositorio GitHub

**Si aún no tienes repo:**

```bash
# Inicializar git
git init

# Agregar archivos
git add .

# Commit inicial
git commit -m "Initial commit - INAKAT platform"

# Crear repo en GitHub
# Ve a https://github.com/new

# Agregar remote
git remote add origin git@github.com:tu-usuario/inakat.git

# Push
git push -u origin main
```

**Verificar .gitignore:**

```bash
# Debe incluir:
.env.local
.env*.local
node_modules/
.next/
.vercel/
```

---

### 3. Verificar Build Local

```bash
# Limpiar
rm -rf .next

# Build
npm run build

# Si hay errores, arreglarlos antes de continuar
```

---

## 🌐 Deploy a Vercel

### Opción A: Deploy desde GitHub (Recomendado)

**Paso 1:** Ve a https://vercel.com/dashboard

**Paso 2:** Click "Add New..." → "Project"

**Paso 3:** Importa tu repositorio
- Click "Import" en tu repo de GitHub
- Autoriza Vercel si es necesario

**Paso 4:** Configurar proyecto

```
Project Name: inakat
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build (auto-detectado)
Output Directory: .next (auto-detectado)
Install Command: npm install (auto-detectado)
```

**Paso 5:** NO HAGAS DEPLOY TODAVÍA
- Click "Environment Variables" primero

---

### Configurar Variables de Entorno en Vercel

**En la sección "Environment Variables":**

Agrega cada variable:

```env
# Base de datos
DATABASE_URL
Value: postgresql://postgres.xxx:[PASSWORD]@...pooler.supabase.com:5432/postgres
Environment: Production

DIRECT_URL  
Value: postgresql://postgres.xxx:[PASSWORD]@...compute.amazonaws.com:5432/postgres
Environment: Production

# Autenticación (GENERAR NUEVO, diferente a dev!)
JWT_SECRET
Value: [nuevo secret generado con: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
Environment: Production

# Blob Storage
BLOB_READ_WRITE_TOKEN
Value: vercel_blob_rw_xxxxx
Environment: Production, Preview

# Admin
ADMIN_EMAIL
Value: admin@inakat.com
Environment: Production

ADMIN_PASSWORD
Value: [contraseña segura para producción]
Environment: Production

ADMIN_NOMBRE
Value: Administrador
Environment: Production

# App URL (ACTUALIZAR después del deploy)
NEXT_PUBLIC_APP_URL
Value: https://inakat.vercel.app
Environment: Production, Preview
```

**Tips:**
- Click "Add Another" para cada variable
- Selecciona "Production" para variables de prod
- Algunas variables (BLOB, NEXT_PUBLIC) pueden ir en Preview también

---

### Ejecutar Deploy

**Paso 6:** Click "Deploy"

Vercel hará:
1. ✅ Clonar código
2. ✅ Instalar dependencias
3. ✅ Ejecutar build
4. ✅ Deploy a CDN global

**Tiempo:** 2-5 minutos

---

### Verificar Deploy

**Paso 7:** Cuando termine

Verás:
```
🎉 Deployment Ready
https://inakat-xxxxx.vercel.app
```

Click en el link y verifica:
- ✅ Home carga
- ✅ Estilos se ven bien
- ✅ No hay errores en console (F12)

---

## 🗄️ Configurar Base de Datos en Producción

### Ejecutar Migraciones

**Opción 1: Desde local con producción DB**

```bash
# Crear archivo .env.production
DATABASE_URL="[tu URL de producción]"
DIRECT_URL="[tu DIRECT URL de producción]"

# Ejecutar migraciones
DATABASE_URL=$DIRECT_URL npx prisma migrate deploy

# O en Windows:
set DATABASE_URL=[DIRECT_URL]
npx prisma migrate deploy
```

**Opción 2: Desde Vercel (Recomendado)**

1. Instala Vercel CLI:
```bash
npm i -g vercel
```

2. Login:
```bash
vercel login
```

3. Link proyecto:
```bash
vercel link
```

4. Ejecutar migraciones:
```bash
vercel env pull .env.production
npx prisma migrate deploy
```

---

### Poblar con Datos de Ejemplo (Opcional)

```bash
# Solo si quieres datos de ejemplo en producción
npx prisma db seed
```

**⚠️ Recomendación:** No usar seed en producción, crear datos manualmente

---

## 🌍 Configurar Dominio Personalizado

### Agregar Dominio

**Paso 1:** En Vercel Dashboard → Tu Proyecto

**Paso 2:** Settings → Domains

**Paso 3:** Agregar dominio
```
inakat.com
www.inakat.com
```

**Paso 4:** Configurar DNS

En tu proveedor de dominio (GoDaddy, Namecheap, etc.):

**Para dominio raíz (inakat.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Para www:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Paso 5:** Esperar propagación (2-48 horas)

---

### Actualizar NEXT_PUBLIC_APP_URL

**Paso 6:** En Vercel → Settings → Environment Variables

Actualizar:
```env
NEXT_PUBLIC_APP_URL
Old: https://inakat-xxxxx.vercel.app
New: https://inakat.com
```

**Paso 7:** Redeploy
- Deployments → tres puntos → "Redeploy"

---

## 🔄 Proceso de Deploy Continuo

### Deploy Automático

Vercel hace deploy automático cuando:

1. **Push a `main`** → Deploy a Producción
2. **Push a otra branch** → Deploy Preview
3. **Pull Request** → Deploy Preview con URL única

---

### Deploy Manual

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy a producción
vercel --prod

# Deploy preview
vercel
```

---

### Revertir Deploy

**Si algo sale mal:**

1. Deployments → Deploy anterior
2. Click en tres puntos
3. "Promote to Production"

O desde CLI:
```bash
vercel rollback
```

---

## 🔒 Seguridad Post-Deploy

### 1. Cambiar Contraseña de Admin

```bash
# Login en producción
https://tu-dominio.com/login

# Ir a perfil y cambiar contraseña
```

### 2. Habilitar Protección de Branch

En GitHub:
- Settings → Branches
- Add rule para `main`
- ☑️ Require pull request reviews
- ☑️ Require status checks

### 3. Configurar Secrets Rotation

**Cada 3-6 meses:**
- Regenerar JWT_SECRET
- Actualizar en Vercel
- Forzar logout de todos los usuarios

---

## 📊 Monitoreo

### Vercel Analytics

1. En tu proyecto → Analytics
2. Ver:
   - Requests por segundo
   - Response times
   - Error rates
   - Top pages

### Logs

```bash
# Ver logs en tiempo real
vercel logs

# Logs de producción
vercel logs --prod

# Seguir logs
vercel logs --follow
```

### Alerts

1. Project → Settings → Notifications
2. Configurar:
   - Deploy failed
   - Build failed
   - High error rate

---

## 🐛 Troubleshooting Deploy

### Build Falla

**Error:** TypeScript errors

**Solución:**
```bash
# Verificar localmente
npm run build

# Arreglar errores
# Commit y push
```

---

### Runtime Error: "Cannot connect to database"

**Solución:**

1. Verificar variables en Vercel
2. Probar conexión:
```bash
# Con tu DIRECT_URL de prod
psql "postgresql://..."
```

3. Verificar IP whitelisting en Supabase (debe ser 0.0.0.0/0)

---

### "Module not found" en producción

**Solución:**

Verificar que todas las dependencias están en `package.json`:
```bash
npm install --save [paquete-faltante]
git add package.json package-lock.json
git commit -m "Add missing dependency"
git push
```

---

### Slow Cold Starts

**Causa:** Vercel Serverless Functions en región incorrecta

**Solución:**
1. Settings → Functions
2. Cambiar region a la más cercana a usuarios

---

## 🚦 Checklist de Producción

### Pre-Deploy
- [ ] Build exitoso localmente
- [ ] Tests pasando
- [ ] Variables de entorno configuradas
- [ ] Base de datos de prod creada
- [ ] Dominio registrado (si aplica)

### Durante Deploy
- [ ] Deploy sin errores
- [ ] Migraciones ejecutadas
- [ ] Health check: `https://tu-url.com`
- [ ] Login funciona
- [ ] APIs responden

### Post-Deploy
- [ ] Contraseña admin cambiada
- [ ] Dominio configurado
- [ ] Analytics habilitado
- [ ] Alerts configuradas
- [ ] Backups de BD configurados
- [ ] Monitoreo activo

---

## 📈 Optimizaciones

### Performance

**1. Habilitar Compression**
```javascript
// next.config.js
module.exports = {
  compress: true,
}
```

**2. Optimizar Imágenes**
```typescript
// Usar Next.js Image
import Image from 'next/image'

<Image 
  src="/logo.png" 
  width={200} 
  height={50}
  alt="Logo"
/>
```

**3. Caching**
```typescript
// En API routes
export const revalidate = 3600; // 1 hour
```

---

### Costo

**Plan Gratuito Vercel:**
- ✅ 100GB bandwidth/mes
- ✅ 6,000 build minutos/mes
- ✅ Serverless functions ilimitadas
- ✅ Deploy automático

**Si excedes:**
- Considerar plan Pro ($20/mes)
- O optimizar uso

---

## 🔄 Pipeline Recomendado

```
Development → Testing → Staging → Production
     ↓            ↓         ↓           ↓
  localhost    CI/CD    Preview     Main Deploy
```

**Branches:**
```
main (producción)
├── develop (staging)
│   ├── feature/login
│   ├── feature/jobs
│   └── feature/applications
```

---

## 📞 Soporte

**Deploy issues:**
- 📧 Email: deploy@inakat.com
- 💬 Vercel Discord: https://vercel.com/discord
- 📖 Docs: https://vercel.com/docs

---

## 🎉 ¡Deploy Completo!

Tu aplicación está ahora en producción y accesible globalmente.

**Próximos pasos:**
1. Monitorear errores primeros días
2. Configurar backups
3. Planear estrategia de updates
4. Establecer proceso de hotfix

---

**Última actualización:** Enero 2025
