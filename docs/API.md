# 🔌 Documentación de API - INAKAT

API REST de INAKAT construida con Next.js API Routes.

**Base URL:** `http://localhost:3000/api` (desarrollo)

---

## 🔐 Autenticación

La mayoría de endpoints requieren autenticación JWT.

### Headers Requeridos

```http
Authorization: Bearer <token>
Content-Type: application/json
```

### Obtener Token

Ver endpoint [POST /api/auth/login](#post-apiauthlogin)

---

## 📚 Endpoints

### Autenticación

#### POST /api/auth/login

Iniciar sesión y obtener token JWT.

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@inakat.com",
  "password": "AdminInakat2024!"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@inakat.com",
    "nombre": "Administrador",
    "role": "admin"
  }
}
```

**Response 401:**
```json
{
  "success": false,
  "error": "Credenciales inválidas"
}
```

---

### Vacantes (Jobs)

#### GET /api/jobs

Listar vacantes activas con filtros opcionales.

**Query Parameters:**
- `status` (string, optional): Estado de la vacante (default: "active")
- `search` (string, optional): Buscar en título, empresa o descripción
- `location` (string, optional): Filtrar por ubicación
- `jobType` (string, optional): Filtrar por tipo de trabajo

**Request:**
```http
GET /api/jobs?status=active&location=Monterrey&jobType=Tiempo%20Completo
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Desarrollador Full Stack",
      "company": "TechSolutions México",
      "location": "Monterrey, Nuevo León",
      "salary": "$35,000 - $50,000 / mes",
      "jobType": "Tiempo Completo",
      "isRemote": true,
      "companyRating": 4.5,
      "description": "Estamos buscando...",
      "requirements": "3+ años de experiencia...",
      "status": "active",
      "createdAt": "2025-01-15T10:00:00.000Z",
      "updatedAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

#### GET /api/jobs/[id]

Obtener detalles de una vacante específica.

**Request:**
```http
GET /api/jobs/1
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Desarrollador Full Stack",
    "company": "TechSolutions México",
    "location": "Monterrey, Nuevo León",
    "salary": "$35,000 - $50,000 / mes",
    "jobType": "Tiempo Completo",
    "isRemote": true,
    "companyRating": 4.5,
    "description": "Estamos buscando...",
    "requirements": "3+ años de experiencia...",
    "status": "active",
    "createdAt": "2025-01-15T10:00:00.000Z"
  }
}
```

**Response 404:**
```json
{
  "success": false,
  "error": "Job not found"
}
```

---

#### POST /api/jobs

Crear nueva vacante.

**🔒 Requiere autenticación**

**Request:**
```http
POST /api/jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Ingeniero DevOps",
  "company": "Tech Corp",
  "location": "Ciudad de México",
  "salary": "$45,000 - $65,000 / mes",
  "jobType": "Tiempo Completo",
  "isRemote": false,
  "description": "Únete a nuestro equipo...",
  "requirements": "4+ años en roles DevOps...",
  "companyRating": 4.7,
  "expiresAt": "2025-03-15T00:00:00.000Z"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Vacante creada exitosamente",
  "data": {
    "id": 19,
    "title": "Ingeniero DevOps",
    ...
  }
}
```

**Response 400:**
```json
{
  "success": false,
  "error": "Faltan campos requeridos: title, company, location, salary, jobType, description"
}
```

---

#### PATCH /api/jobs/[id]

Actualizar una vacante existente.

**🔒 Requiere autenticación**

**Request:**
```http
PATCH /api/jobs/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "closed",
  "salary": "$50,000 - $70,000 / mes"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Job updated successfully",
  "data": {
    "id": 1,
    "status": "closed",
    "salary": "$50,000 - $70,000 / mes",
    ...
  }
}
```

---

#### DELETE /api/jobs/[id]

Eliminar una vacante.

**🔒 Requiere autenticación**

**Request:**
```http
DELETE /api/jobs/1
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```

---

### Aplicaciones (Applications)

#### GET /api/applications

Listar aplicaciones con filtros opcionales.

**🔒 Requiere autenticación**

**Query Parameters:**
- `jobId` (number, optional): Filtrar por vacante
- `status` (string, optional): Filtrar por estado
- `candidateEmail` (string, optional): Filtrar por email

**Request:**
```http
GET /api/applications?status=pending&jobId=1
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "jobId": 1,
      "candidateName": "María González Hernández",
      "candidateEmail": "maria.gonzalez@email.com",
      "candidatePhone": "81 2345 6789",
      "cvUrl": "https://blob.vercel-storage.com/cv-123.pdf",
      "coverLetter": "Estimado equipo...",
      "status": "pending",
      "notes": null,
      "createdAt": "2025-01-16T08:30:00.000Z",
      "job": {
        "id": 1,
        "title": "Desarrollador Full Stack",
        "company": "TechSolutions México",
        "location": "Monterrey, Nuevo León",
        "salary": "$35,000 - $50,000 / mes"
      }
    }
  ],
  "count": 1
}
```

---

#### GET /api/applications/[id]

Obtener detalles de una aplicación específica.

**🔒 Requiere autenticación**

**Request:**
```http
GET /api/applications/1
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "candidateName": "María González Hernández",
    "candidateEmail": "maria.gonzalez@email.com",
    "candidatePhone": "81 2345 6789",
    "cvUrl": "https://blob.vercel-storage.com/cv-123.pdf",
    "coverLetter": "Estimado equipo...",
    "status": "pending",
    "notes": null,
    "createdAt": "2025-01-16T08:30:00.000Z",
    "job": {
      "id": 1,
      "title": "Desarrollador Full Stack",
      "company": "TechSolutions México"
    }
  }
}
```

---

#### POST /api/applications

Crear nueva aplicación a vacante.

**Request:**
```http
POST /api/applications
Content-Type: application/json

{
  "jobId": 1,
  "candidateName": "Juan Pérez García",
  "candidateEmail": "juan.perez@email.com",
  "candidatePhone": "81 1234 5678",
  "cvUrl": "https://blob.vercel-storage.com/cv-456.pdf",
  "coverLetter": "Me dirijo a ustedes..."
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Aplicación enviada exitosamente",
  "data": {
    "id": 13,
    "candidateName": "Juan Pérez García",
    "status": "pending",
    ...
  }
}
```

**Response 400 (Duplicado):**
```json
{
  "success": false,
  "error": "Ya has aplicado a esta vacante anteriormente"
}
```

**Response 400 (Vacante inactiva):**
```json
{
  "success": false,
  "error": "Esta vacante ya no está activa"
}
```

---

#### PATCH /api/applications/[id]

Actualizar estado de aplicación.

**🔒 Requiere autenticación**

**Request:**
```http
PATCH /api/applications/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "interviewed",
  "notes": "Candidato prometedor, agendar segunda entrevista"
}
```

**Estados válidos:**
- `pending` - Pendiente
- `reviewing` - En Revisión
- `interviewed` - Entrevistado
- `accepted` - Aceptado
- `rejected` - Rechazado

**Response 200:**
```json
{
  "success": true,
  "message": "Application updated successfully",
  "data": {
    "id": 1,
    "status": "interviewed",
    "notes": "Candidato prometedor...",
    "reviewedAt": "2025-01-16T15:30:00.000Z"
  }
}
```

---

#### DELETE /api/applications/[id]

Eliminar aplicación.

**🔒 Requiere autenticación**

**Request:**
```http
DELETE /api/applications/1
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "success": true,
  "message": "Application deleted successfully"
}
```

---

### Empresas (Companies)

#### POST /api/companies

Registrar solicitud de empresa.

**Request:**
```http
POST /api/companies
Content-Type: application/json

{
  "nombre": "Juan",
  "apellidoPaterno": "Pérez",
  "apellidoMaterno": "García",
  "nombreEmpresa": "Tech Solutions SA de CV",
  "correoEmpresa": "contacto@techsolutions.mx",
  "sitioWeb": "https://techsolutions.mx",
  "razonSocial": "Tech Solutions SA de CV",
  "rfc": "TSO123456ABC",
  "direccionEmpresa": "Av. Constitución 123, Monterrey, NL",
  "identificacionUrl": "https://blob.vercel-storage.com/id-123.pdf",
  "documentosConstitucionUrl": "https://blob.vercel-storage.com/const-123.pdf"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Solicitud enviada exitosamente. Te notificaremos cuando sea revisada.",
  "data": {
    "id": 5,
    "status": "pending",
    ...
  }
}
```

**Response 400:**
```json
{
  "success": false,
  "error": "El RFC ya está registrado"
}
```

---

#### GET /api/companies/requests

Listar solicitudes de empresas (Admin).

**🔒 Requiere autenticación de Admin**

**Query Parameters:**
- `status` (string, optional): pending, approved, rejected

**Request:**
```http
GET /api/companies/requests?status=pending
Authorization: Bearer <admin_token>
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombreEmpresa": "Tech Solutions SA de CV",
      "correoEmpresa": "contacto@techsolutions.mx",
      "rfc": "TSO123456ABC",
      "status": "pending",
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ]
}
```

---

#### PATCH /api/companies/requests/[id]

Aprobar o rechazar solicitud (Admin).

**🔒 Requiere autenticación de Admin**

**Request (Aprobar):**
```http
PATCH /api/companies/requests/1
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "action": "approve"
}
```

**Request (Rechazar):**
```http
PATCH /api/companies/requests/1
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "action": "reject",
  "rejectionReason": "Documentos incompletos"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Solicitud aprobada. Se ha creado la cuenta de la empresa.",
  "user": {
    "id": 5,
    "email": "contacto@techsolutions.mx",
    "role": "company"
  }
}
```

---

### Upload de Archivos

#### POST /api/upload

Subir archivo a Vercel Blob Storage.

**Request:**
```http
POST /api/upload
Content-Type: multipart/form-data

file: [binary data]
```

**Formatos aceptados:**
- PDF: `.pdf`
- Imágenes: `.jpg`, `.jpeg`, `.png`
- Documentos: `.doc`, `.docx`

**Tamaño máximo:** 5MB

**Response 200:**
```json
{
  "success": true,
  "url": "https://blob.vercel-storage.com/file-abc123.pdf"
}
```

**Response 400:**
```json
{
  "success": false,
  "error": "Archivo muy grande. Máximo 5MB"
}
```

---

## 🔒 Códigos de Estado

| Código | Significado |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado exitosamente |
| 400 | Bad Request - Error en los datos enviados |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - No autorizado (sin permisos) |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

---

## 📝 Ejemplos con cURL

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@inakat.com","password":"AdminInakat2024!"}'
```

### Listar Vacantes
```bash
curl http://localhost:3000/api/jobs?status=active
```

### Crear Vacante
```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Backend Developer",
    "company": "Tech Corp",
    "location": "CDMX",
    "salary": "$40,000 / mes",
    "jobType": "Tiempo Completo",
    "description": "Buscamos...",
    "requirements": "3+ años..."
  }'
```

### Aplicar a Vacante
```bash
curl -X POST http://localhost:3000/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": 1,
    "candidateName": "Ana López",
    "candidateEmail": "ana@email.com",
    "coverLetter": "Me interesa..."
  }'
```

---

## 🧪 Testing con Postman

1. Importa la colección: [INAKAT.postman_collection.json](./postman/INAKAT.postman_collection.json)
2. Configura el environment con `BASE_URL` y `TOKEN`
3. Ejecuta los tests

---

## 📚 Rate Limiting

Actualmente no hay rate limiting implementado.

**Planificado para Q1 2025:**
- 100 requests/minuto por IP para endpoints públicos
- 1000 requests/minuto para usuarios autenticados

---

## 🐛 Manejo de Errores

Todos los errores siguen este formato:

```json
{
  "success": false,
  "error": "Mensaje descriptivo del error"
}
```

---

## 📞 Soporte

¿Problemas con la API?

- 📧 Email: api@inakat.com
- 📖 Docs: https://docs.inakat.com/api
- 💬 Discord: https://discord.gg/inakat

---

**Última actualización:** Enero 2025
