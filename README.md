# Vista previa de banners — estructura tipo Rori

Réplica **estática** de la estructura visual de `rori.com` hecha con HTML y CSS propios,
pensada solo para probar banners nuevos antes de publicarlos. **No** es el código de la web
original (esa web es una SPA de React): aquí no hay React, ni su CSS, ni su JavaScript.

## Cómo abrirlo

Doble clic en `index.html` (funciona sin servidor) o:

```powershell
python -m http.server 8123
# luego abre http://localhost:8123/
```

## Cómo cambiar un banner

Tienes tres formas:

1. **Desde la página:** botón **“Editar banners”** (abajo a la derecha) → *Elegir imagen* en el
   slot que quieras. Se aplica al instante y respeta el recorte real.
2. **Arrastrando:** arrastra una imagen desde el explorador y suéltala encima del banner.
3. **Permanente:** sobrescribe el archivo correspondiente en `banners/` manteniendo el nombre.

Pulsa **G** (o marca *Mostrar guías y medidas*) para ver el encuadre y las medidas de cada slot.

## Slots y medidas

| Slot | Archivo por defecto | Medida origen | Proporción en pantalla |
| --- | --- | --- | --- |
| Carrusel · banner 1 | `banners/03A-hero-desktop.png` | 1920×768 | 2.5:1 |
| Carrusel · banner 2 | `banners/02-hero-desktop.png` | 1920×768 | 2.5:1 |
| Promocional 1 · banner 1 | `banners/rori-medio-A.png` | 1920×462 | 4.156:1 |
| Promocional 1 · banner 2 | `banners/rori-medio-B.png` | 1920×462 | 4.156:1 |
| Colección caballero | `banners/04-coleccion-hombre.png` | 704×527 | 1.39:1 |
| Colección dama | `banners/05-coleccion-mujer.png` | 704×527 | 1.39:1 |
| Promocional final · banner 1 | `banners/06-promo-final.png` | 1920×462 | 4.156:1 |
| Promocional final · banner 2 | `banners/07-promo-final.png` | 1920×462 | 4.156:1 |

Hay tres carruseles de **UIkit 3** (`uk-slideshow`): el hero con proporción `5:2` y dos
promocionales con proporción `1920:462` (intermedio y final). Cada `<li>` de
`uk-slideshow-items` es un banner. Para añadir otro: copia un `<li>`, cambia su `src` y su
`data-banner` (usa un nombre de slot único) y añade el slot correspondiente en el panel del
editor.

Recomendación: exporta los banners del hero a **1920×768** y todos los promocionales a
**1920×462** (4.156:1) si quieres que no se recorte nada. Los banners de colección funcionan
bien a **1400×1010** (1.39:1).

## Estructura

```
web/
├─ index.html         Página (header, hero, productos, promos, colecciones, footer)
├─ css/styles.css     Estilos y responsive
├─ js/app.js          Editor de banners (cambio en caliente + drag & drop + guías)
├─ banners/           Imágenes de banner sustituibles
└─ assets/            Logo y fotos de producto de relleno
```

## Notas

- Las imágenes de banner y producto son las públicas actuales del sitio, usadas como referencia
  visual. Sustitúyelas por las tuyas.
- El header es `sticky` y el contenido arranca 15 px debajo (igual que el original).
- La rejilla de producto pasa de 5 columnas en escritorio a 4 (≤1199 px), 3 (≤1023 px) y
  2 (≤767 px). «Última Colección» usa 4, 2 y 2 columnas en esos mismos rangos. Las tarjetas
  ajustan padding, tipografía y separación con `clamp()`.
- Las tarjetas de producto usan fotos de relleno: el objetivo del proyecto son los banners.
- `banners/05-coleccion-hombre.png` y `banners/mapa.png` están disponibles como alternativas,
  pero la página no las usa por defecto.
- Si vas a publicar esta maqueta, necesitas autorización sobre la marca, los textos y las imágenes.
