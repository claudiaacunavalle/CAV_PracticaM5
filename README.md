# 🌐 Aplicación Web Interactiva — Dashboard de Datos

  
La aplicación permite explorar un conjunto de datos mediante filtros y gráficos interactivos, con un diseño limpio, responsivo y accesible.


##  Objetivo del Proyecto

El propósito de esta aplicación es demostrar la integración de las tres capas esenciales del desarrollo web moderno:

1. **HTML5** — estructura semántica y accesible.
2. **CSS3** — diseño responsivo, moderno y atractivo.
3. **JavaScript** — interactividad y visualización dinámica de datos con Chart.js.

---

## Estructura del Proyecto
📂 proyecto-dashboard
├── index.html → Estructura principal (HTML semántico)
├── styles.css → Diseño visual y estilos responsivos
├── script.js → Lógica e interactividad con Chart.js
├── data.csv → Conjunto de datos utilizado
└── README.md → Documentación del proyecto


## 📊 Descripción de la Aplicación

La aplicación muestra un **gráfico de barras interactivo** con datos provenientes del archivo `sales.csv`, que contiene 4 columnas:
- `month` → Mes o período
- `category` → Categoría de los productos 
- `value` → cantidad de productos vendidos 

El usuario puede:
- **Filtrar por categoría** desde un menú desplegable.
- **Observar valores detallados** al hacer clic en una barra.
- **Abrir un modal accesible** con información adicional del punto seleccionado.
- **Restablecer los filtros** fácilmente con un botón dedicado.

## ⚙️ Instrucciones de Ejecución

### 🧠 Opción 1 — Abrir con servidor local (recomendado)
Para evitar errores de lectura del archivo `sales.csv`, ejecuta el proyecto con un servidor local.

#### Si tienes Python 3 instalado:
```bash
cd proyecto-dashboard
python -m http.server 8000
