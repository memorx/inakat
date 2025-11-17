# 🔒 Política de Seguridad - INAKAT

Lineamientos de seguridad y cómo reportar vulnerabilidades.

---

## 🛡️ Medidas de Seguridad Implementadas

### Autenticación y Autorización

**✅ JWT (JSON Web Tokens)**
- Tokens firmados con HS256
- Secret de 32+ caracteres
- Expiración de 7 días
- Almacenamiento en httpOnly cookies (recomendado para producción)

**✅ Passwords**
- Hash con bcrypt (10 rounds)
- Mínimo 8 caracteres
- Validación de complejidad
- Nunca almacenados en texto plano

**✅ Protección de Rutas**
- Middleware de Next.js
- Verificación de tokens en cada request
- Verificación de roles (admin, company, user)

---

### Base de Datos

**✅ Prisma ORM**
- Prevención de SQL injection
- Queries parametrizadas
- Validación de tipos con TypeScript

**✅ Conexiones**
- TLS/SSL habilitado
- Connection pooling de Supabase
- Credenciales en variables de entorno

**✅ Datos Sensibles**
- Passwords hasheados
- RFCs validados y únicos
- Emails validados y únicos

---

### Upload de Archivos

**✅ Validación de Archivos**
```typescript
// Tipos permitidos
const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// Tamaño máximo: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;
```

**✅ Almacenamiento Seguro**
- Vercel Blob Storage
- URLs firmadas con expiración
- No acceso público directo

---

### API Endpoints

**✅ Validación de Inputs**
- Zod schemas para validación
- Sanitización de datos
- Validación de tipos

**✅ Rate Limiting**
- Planificado para Q1 2025
- 100 requests/minuto por IP (endpoints públicos)
- 1000 requests/minuto (autenticado)

**✅ CORS**
- Configurado para dominios específicos
- Headers de seguridad

---

### Headers de Seguridad

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  }
};
```

---

## 🚨 Reportar Vulnerabilidades

### Proceso de Reporte

Si encuentras una vulnerabilidad de seguridad:

**1. NO crear issue público**
   - Las vulnerabilidades no deben ser públicas hasta ser resueltas

**2. Enviar reporte privado**
   - Email: security@inakat.com
   - Asunto: [SECURITY] Descripción breve

**3. Incluir en el reporte:**
   - Descripción detallada
   - Pasos para reproducir
   - Impacto potencial
   - Versión afectada
   - Screenshots/videos (si aplica)

**4. Tiempo de respuesta:**
   - Acuse de recibo: 24 horas
   - Evaluación inicial: 72 horas
   - Plan de acción: 1 semana
   - Fix en producción: según severidad

---

### Clasificación de Severidad

**🔴 CRÍTICA**
- Ejecución remota de código
- Inyección SQL
- Exposición de credenciales
- Bypass de autenticación

**🟠 ALTA**
- XSS (Cross-Site Scripting)
- CSRF (Cross-Site Request Forgery)
- Escalación de privilegios
- Exposición de datos sensibles

**🟡 MEDIA**
- Información sensible en logs
- Validación de inputs insuficiente
- Rate limiting ausente
- Configuración insegura

**🟢 BAJA**
- Información sobre versiones
- Problemas menores de configuración
- Mejoras generales de seguridad

---

### Programa de Recompensas

**Actualmente no hay programa formal**

En el futuro planeamos:
- Reconocimiento público (Hall of Fame)
- Recompensas monetarias para vulnerabilidades críticas

---

## 🔐 Mejores Prácticas para Desarrolladores

### Variables de Entorno

**❌ NUNCA:**
```typescript
// Hardcodear secrets
const secret = "mi-super-secreto-123";

// Commitear .env.local
git add .env.local
```

**✅ SIEMPRE:**
```typescript
// Usar variables de entorno
const secret = process.env.JWT_SECRET;

// Verificar existencia
if (!secret) {
  throw new Error('JWT_SECRET not configured');
}
```

---

### Manejo de Passwords

**❌ MAL:**
```typescript
// Almacenar en texto plano
await prisma.user.create({
  data: {
    password: plainPassword
  }
});
```

**✅ BIEN:**
```typescript
// Hash antes de guardar
import bcrypt from 'bcryptjs';

const hashedPassword = await bcrypt.hash(plainPassword, 10);

await prisma.user.create({
  data: {
    password: hashedPassword
  }
});
```

---

### Validación de Inputs

**❌ MAL:**
```typescript
// Sin validación
const { email, password } = req.body;
// Usar directamente
```

**✅ BIEN:**
```typescript
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const { email, password } = schema.parse(req.body);
```

---

### Queries a Base de Datos

**❌ MAL:**
```typescript
// String interpolation (vulnerable a SQL injection)
const query = `SELECT * FROM users WHERE email = '${email}'`;
```

**✅ BIEN:**
```typescript
// Usar Prisma ORM
const user = await prisma.user.findUnique({
  where: { email }
});
```

---

### Autenticación

**❌ MAL:**
```typescript
// Token en localStorage (vulnerable a XSS)
localStorage.setItem('token', token);

// Sin verificación de expiración
const user = jwt.decode(token);
```

**✅ BIEN:**
```typescript
// Token en httpOnly cookie
res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=Strict`);

// Verificar token
import * as jose from 'jose';

const { payload } = await jose.jwtVerify(
  token,
  new TextEncoder().encode(secret)
);
```

---

### Upload de Archivos

**❌ MAL:**
```typescript
// Sin validación
const file = req.file;
await uploadFile(file);
```

**✅ BIEN:**
```typescript
// Validar tipo y tamaño
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

if (!ALLOWED_TYPES.includes(file.type)) {
  throw new Error('File type not allowed');
}

if (file.size > MAX_SIZE) {
  throw new Error('File too large');
}

await uploadFile(file);
```

---

## 🔍 Auditorías de Seguridad

### Herramientas Recomendadas

**npm audit**
```bash
# Verificar vulnerabilidades en dependencias
npm audit

# Fix automático
npm audit fix
```

**Snyk**
```bash
# Instalar
npm install -g snyk

# Verificar
snyk test

# Monitorear
snyk monitor
```

**OWASP ZAP**
- Scanner de vulnerabilidades web
- https://www.zaproxy.org/

---

### Checklist de Seguridad

**Antes de Deploy:**
- [ ] npm audit sin vulnerabilidades críticas
- [ ] Variables de entorno configuradas
- [ ] JWT_SECRET único por ambiente
- [ ] Passwords de BD fuertes
- [ ] HTTPS habilitado en producción
- [ ] Headers de seguridad configurados
- [ ] Rate limiting habilitado
- [ ] Logs no exponen datos sensibles
- [ ] Error messages no revelan información interna
- [ ] CORS configurado correctamente

**Mensual:**
- [ ] Rotar JWT_SECRET
- [ ] Revisar logs de acceso
- [ ] Actualizar dependencias
- [ ] Backup de base de datos
- [ ] Revisar usuarios activos

**Trimestral:**
- [ ] Auditoría de código
- [ ] Penetration testing
- [ ] Revisar permisos de usuarios
- [ ] Actualizar documentación de seguridad

---

## 🚧 Vulnerabilidades Conocidas

### Versión Actual

**Ninguna vulnerabilidad conocida actualmente.**

Historial se mantendrá aquí conforme se descubran y resuelvan.

---

## 📚 Recursos de Seguridad

### Documentación
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Prisma Security](https://www.prisma.io/docs/concepts/components/prisma-client/security)

### Cursos
- [Web Security Academy](https://portswigger.net/web-security)
- [OWASP WebGoat](https://owasp.org/www-project-webgoat/)

### Comunidades
- [r/netsec](https://reddit.com/r/netsec)
- [HackerOne](https://hackerone.com)

---

## 🔄 Actualizaciones de Seguridad

### Versión 1.0.0 (Enero 2025)
- ✅ Autenticación JWT implementada
- ✅ Passwords hasheados con bcrypt
- ✅ Validación de inputs con Zod
- ✅ Upload de archivos seguro
- ✅ Protección de rutas con middleware
- ✅ Headers de seguridad configurados

### Planificado Q1 2025
- Rate limiting
- 2FA (Two-Factor Authentication)
- Logs de auditoría
- Session management mejorado
- Content Security Policy (CSP)

---

## 📧 Contacto

**Seguridad:**
- 📧 Email: security@inakat.com
- 🔐 PGP Key: [Disponible próximamente]

**Soporte General:**
- 📧 Email: soporte@inakat.com
- 💬 Discord: https://discord.gg/inakat

---

## ⚖️ Divulgación Responsable

Agradecemos a los investigadores de seguridad que reportan vulnerabilidades de manera responsable.

**Compromisos:**
- Acuse de recibo en 24 horas
- No tomar acción legal contra reportes de buena fe
- Mantener confidencialidad hasta resolución
- Reconocimiento público (con permiso)

---

**Última actualización:** Enero 2025  
**Versión:** 1.0.0
