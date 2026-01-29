# Inmobiliaria - Frontend

## Universidad Tecnológica Equinoccial

<div align="center">
<img src="https://ute.edu.ec/wp-content/uploads/2021/08/LogoUteTrans.png" alt="UTE - Escuela de Tecnologías" width="250"/>
</div>

---

## Información General

**Universidad:** Universidad Tecnológica Equinoccial  
**Escuela:** Escuela de Tecnologías  
**Carrera:** Desarrollo de Software  
**Asignatura:** Programación III  

**Tema:** Construcción Frontend Proyecto Integrador  
**Fecha:** 28/01/2026  

### Equipo de Trabajo
- Zambrano Colcha Carlos Andrés  
- Guamán Pillajo Danny Alexander  
- Macías Caiza Alex Gabriel  

**Docente:** Francisco Javier Higuera González  

---

## Instalación

### Requisitos

-   Node.js \>= 16
-   npm o yarn
-   Git
-   Navegador web
-   Backend funcionando

### Pasos

``` bash
git clone https://github.com/andreeesz17/inmobiliaria_frontend.git
cd inmobiliaria_frontend
npm install
npm run dev
```

---

## Variables de Entorno

Crear archivo .env

``` env
VITE_API_URL=http://localhost:3000
```

Producción:

``` env
VITE_API_URL=https://api-produccion.com
```

---

## Comandos

| Comando | Uso |
|---------|------|
| `npm run dev` | Desarrollo |
| `npm run build` | Producción |
| `npm run preview` | Vista previa |
| `npm run lint` | Revisar |


---

## Autenticación

El sistema usa JWT.

Authorization: Bearer \<token\>

---

## Endpoints

### Auth

POST /auth/register\
POST /auth/login

### Properties

GET /properties\
GET /properties/:id\
POST /properties

### Appointments

POST /appointments\
GET /appointments

### Users

GET /users/:id\
PUT /users/:id

---

## Credenciales

Admin\
admin@test.com\
Admin123

Usuario\
user@test.com\
User123

---

## Ejemplo

``` ts
const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
  email: "user@test.com",
  password: "User123"
 })
});

const data = await res.json();
localStorage.setItem("token", data.token);
```

---

## Estructura

```txt
inmobiliaria_frontend/
├── public/
├── src/
│   ├── api/          
│   ├── auth/         
│   ├── assets/       
│   ├── components/   
│   ├── hooks/        
│   ├── layouts/      
│   ├── pages/        
│   ├── router/       
│   ├── types/        
│   ├── utils/        
│   ├── App.tsx
│   └── main.tsx
├── .env
├── .env.production
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```
---

## Despliegue

``` bash
npm run build
```

Configurar VITE_API_URL en producción.

---

## Licencia

Proyecto académico. Uso educativo.

------------------------------------------------------------------------

Sistema de Gestión Inmobiliaria - InmoCore
