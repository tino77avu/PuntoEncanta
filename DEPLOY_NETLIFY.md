# Despliegue en Netlify

Este proyecto incluye una **versión estática** del sitio para desplegar en [Netlify](https://www.netlify.com) (sin servidor Java).

## Estructura

- **Carpeta de publicación:** `netlify/`
  - HTML: `index.html`, `polos.html`, `bordado.html`, `como-pedir.html`, `portafolio.html`, `faq.html`, `cotizar.html`, `gracias.html`
  - Estilos: `css/style.css`
  - Scripts: `js/main.js`
  - Imágenes: `images/` (debes añadir `Logo.png` e `Inicio.png`)
- **Configuración:** `netlify.toml` en la raíz del repo (publish = `netlify`)
- **Rutas amigables:** `netlify/_redirects` (ej. `/polos` → `polos.html`)

## Pasos para desplegar

1. **Sube el repo a GitHub** (si aún no está).
2. **Entra en [app.netlify.com](https://app.netlify.com)** → Add new site → Import an existing project.
3. **Conecta el repositorio** (GitHub) y selecciona el repo de PuntoEncanta.
4. **Configuración de build en Netlify:**
   - **Build command:** vacío (no hay build).
   - **Publish directory:** `netlify`
   - Deja el resto por defecto y haz **Deploy**.

Tras el despliegue, Netlify te dará una URL tipo `https://nombre-random.netlify.app`.

## Formulario de cotización (Netlify Forms)

El formulario de **Cotizar** usa **Netlify Forms**:

- Al enviar, los datos se guardan en el panel de Netlify (Form submissions).
- Tras enviar, el usuario es redirigido a `/gracias`.
- Para ver los envíos: en tu sitio en Netlify → **Forms** → formulario `cotizacion`.

**WhatsApp:** En todas las páginas el botón flotante de WhatsApp usa el número `51999999999`. Para cambiarlo:

- Busca y reemplaza `https://wa.me/51999999999` en los HTML dentro de `netlify/` por tu número (código país + número, sin +). Ejemplo: `https://wa.me/521234567890`.

## Imágenes

Antes de desplegar, asegúrate de tener en `netlify/images/`:

- `Logo.png` – logo del sitio.
- `Inicio.png` – imagen de fondo del hero.

Si ya los tienes en `src/main/resources/static/images/`, cópialos a `netlify/images/`.

## Dominio propio

En Netlify: Site settings → Domain management → Add custom domain. Sigue los pasos para verificar el dominio.

---

**Resumen:** El sitio en Netlify es estático (HTML/CSS/JS). El backend Spring Boot (Render, etc.) se puede seguir usando por separado si lo necesitas; esta versión estática no lo utiliza.
