# 🎧 AntiSpotify

AntiSpotify es una aplicación web construida con **React + Vite** y un servidor **Node.js/Express**, que permite autenticarse con **Spotify** mediante OAuth y, tras iniciar sesión, mostrar un **reproductor personalizado** con la música actual del usuario.

---

## 🚀 Características principales

- 🔐 Inicio de sesión seguro con **Spotify OAuth 2.0**
- 🎵 Visualización del **reproductor** una vez autenticado
- ⚙️ Backend con **Express** para manejar la autenticación y redirección
- ⚡ Frontend moderno con **React 19 + Vite 7**
- 🌍 Manejo de variables de entorno mediante `.env`
- 🧩 Arquitectura limpia y modular (`Login`, `Player`, `App`)


## ⚙️ Instalación y configuración

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/tuusuario/antispotify.git
cd antispotify
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Crear archivo `.env`

Crea un archivo `.env` en la raíz del proyecto con los siguientes valores:

```env
CLIENT_ID=tu_client_id_de_spotify
CLIENT_SECRET=tu_client_secret_de_spotify
REDIRECT_URI=http://localhost:5173
PORT=5000
```

> 🟡 Puedes obtener tu `CLIENT_ID` y `CLIENT_SECRET` en el [Panel de desarrolladores de Spotify](https://developer.spotify.com/dashboard/).

---

## ▶️ Ejecución del proyecto

### 🔧 Iniciar servidor backend
```bash
node server.js
```

### 💻 Iniciar entorno de desarrollo (frontend)
```bash
npm run dev
```

Abre el navegador en [http://localhost:5173](http://localhost:5173)

---

## 🔑 Flujo de autenticación

1. El usuario abre la app y pulsa **"Iniciar sesión con Spotify"**.  
2. Se redirige a la página de autorización de Spotify.  
3. Tras aprobar, Spotify devuelve un **access_token** al frontend.  
4. El frontend almacena el token en `localStorage` y muestra el componente **Player**.  
5. Desde allí, se pueden hacer peticiones al API de Spotify para obtener la canción actual, controlar reproducción, etc.

---

## 📦 Scripts disponibles

| Comando | Descripción |
|----------|--------------|
| `npm run dev` | Inicia el entorno de desarrollo con Vite |
| `npm run build` | Genera la versión optimizada para producción |
| `npm run preview` | Previsualiza el build localmente |
| `npm run lint` | Analiza el código con ESLint |

---

## 🧠 Tecnologías utilizadas

- **Frontend:** React 19 + Vite 7  
- **Backend:** Node.js + Express  
- **Estilos:** CSS / Tailwind (opcional)  
- **Autenticación:** Spotify OAuth 2.0  
- **Herramientas:** ESLint, dotenv, node-fetch

---

🌐 Proyecto creado con fines educativos y experimentales.

---

## ⚠️ Licencia

Este proyecto se distribuye bajo la licencia **MIT**.  
No está afiliado oficialmente a Spotify AB.
