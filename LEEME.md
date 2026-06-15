# Integra Soluciones Empresariales — Guía del Proyecto Web

## Estructura de archivos

```
integra-web/
│
├── index.html          ← Página principal (contenido y estructura)
│
├── css/
│   └── estilos.css     ← Todos los estilos visuales (colores, fuentes, espaciados)
│
├── js/
│   └── main.js         ← Funciones interactivas (slider, formulario…)
│
└── img/                ← Carpeta para tus imágenes propias
    ├── slide-1.jpg     ← Imagen del slider 1
    ├── slide-2.jpg     ← Imagen del slider 2
    ├── slide-3.jpg     ← Imagen del slider 3
    ├── slide-4.jpg     ← Imagen del slider 4
    └── equipo.jpg      ← Foto de la sección "Quiénes somos"
```

---

## ¿Cómo editar cada parte?

### 🎨 Cambiar colores
Abre `css/estilos.css` y ve a la sección **"1. VARIABLES"** (línea ~20).  
Cambia el valor de la variable que quieras, por ejemplo:

```css
--color-primario: #82840f;   /* Verde oliva actual → cámbialo por tu color */
```

---

### 🖼 Cambiar imágenes del slider
1. Copia tus fotos a la carpeta `img/` con los nombres `slide-1.jpg`, `slide-2.jpg`, etc.
2. En `css/estilos.css`, busca **"IMÁGENES DEL SLIDER"** (sección 5) y ajusta si usas otros nombres.

---

### 📝 Cambiar textos del slider
Abre `index.html` y busca los comentarios `<!-- Slide 1 -->`, `<!-- Slide 2 -->`, etc.  
Modifica el texto dentro del `<h2>` de cada slide.

---

### 👥 Añadir personas al equipo
Copia un bloque completo de `<div class="team-card">...</div>` y pega uno nuevo justo después.  
Cambia las iniciales, nombre, cargo y email.  
Para usar foto real, reemplaza:
```html
<div class="team-photo tp-1">MM</div>
```
por:
```html
<img src="img/nombre-persona.jpg" alt="Nombre" class="team-photo" style="object-fit:cover;width:100%;">
```

---

### 📰 Añadir noticias
Copia un bloque `<div class="news-card">...</div>` y pégalo dentro del `.news-grid`.  
Si quieres que una noticia sea destacada (más grande), añade la clase `featured` al div.  
Para imagen real en la tarjeta, reemplaza el `style="background:..."` por:
```html
<div class="nc-img">
  <img src="img/noticia.jpg" alt="Título" style="width:100%;height:100%;object-fit:cover;">
</div>
```

---

### 📞 Cambiar datos de contacto
En `index.html`, busca el comentario `<!-- CONTACTO -->` y edita los valores de teléfono, email, dirección y horario directamente en el texto.

El número del botón de WhatsApp también está en el `href` del elemento `.wa-btn`:
```html
<a href="https://api.whatsapp.com/send?phone=34XXXXXXXXX" ...>
```

---

### 🔗 Activar el formulario de contacto
El formulario envía datos con el botón, pero necesitas conectarlo a un backend.  
Abre `js/main.js` y descomenta la **sección 3**, luego añade tu lógica de envío (fetch a tu API, EmailJS, Formspree, etc.).

---

### ➕ Añadir una nueva sección
1. Crea un nuevo bloque `<section class="mi-seccion" id="mi-id">` en `index.html`
2. Añade un enlace en el menú `<li><a href="#mi-id">Mi Sección</a></li>`
3. Escribe los estilos al final de `css/estilos.css`

---

## Abrir en el navegador
Abre el archivo `index.html` directamente en tu navegador (doble clic).  
Si necesitas un servidor local, ejecuta en la carpeta del proyecto:
```bash
# Con Python (suele estar instalado)
python -m http.server 8000
# Luego visita: http://localhost:8000
```
