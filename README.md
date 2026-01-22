# Dashboard Hematologico

Sistema de extraccion y visualizacion de estudios hematologicos. Procesa PDFs de laboratorio del Hospital Italiano de La Plata y presenta los datos en un dashboard interactivo.

## Estructura del proyecto

```
estudios/
├── extraer_hematologicos.py    # Script de extraccion de datos
├── pdfs_laboratorio/           # PDFs de estudios (no versionados)
├── resultados_hematologicos.json
└── hematologia-dashboard/      # Aplicacion React
```

## Requisitos

- Python 3.10+
- Node.js 20+

## Extraccion de datos

El script `extraer_hematologicos.py` procesa los PDFs y genera un archivo JSON con los datos estructurados.

### Instalacion del entorno Python

```bash
python3 -m venv venv
source venv/bin/activate
pip install pdfplumber
```

### Ejecucion

```bash
python extraer_hematologicos.py
```

El script:
1. Lee todos los PDFs en `pdfs_laboratorio/`
2. Filtra solo los estudios hematologicos del Area de Hematologia y Hemoterapia
3. Extrae los valores de serie roja, serie blanca, plaquetas y eritrosedimentacion
4. Guarda los resultados ordenados por fecha en `resultados_hematologicos.json`

### Datos extraidos

- **Serie roja**: eritrocitos, hemoglobina, hematocrito, VCM, reticulocitos
- **Serie blanca**: leucocitos, PMNs, eosinofilos, basofilos, linfocitos, monocitos
- **Otros**: plaquetas, eritrosedimentacion

## Dashboard

Aplicacion React con Vite que visualiza la evolucion de los valores hematologicos.

### Instalacion

```bash
cd hematologia-dashboard
npm install
```

### Desarrollo local

```bash
npm run dev
```

### Build de produccion

```bash
npm run build
```

Los archivos se generan en `hematologia-dashboard/dist/`.

### Caracteristicas

- Graficos interactivos (area, linea, barras, radar)
- Visualizacion por categorias (serie roja, serie blanca, otros)
- Indicadores de valores fuera de rango
- Historial cronologico de estudios
- Modo claro/oscuro

### Tecnologias

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Recharts
- Framer Motion

## Deploy

El proyecto se despliega automaticamente en GitHub Pages mediante GitHub Actions.

### Configuracion

1. En el repositorio de GitHub, ir a Settings > Pages
2. En "Build and deployment", seleccionar "GitHub Actions" como source
3. Hacer push a la rama `main`

El workflow `.github/workflows/deploy.yml` se ejecuta en cada push y despliega la aplicacion.

### URL

```
https://<usuario>.github.io/dashboard_hematologico/
```

## Actualizacion de datos

Para agregar nuevos estudios:

1. Colocar los PDFs en `pdfs_laboratorio/`
2. Ejecutar `python extraer_hematologicos.py`
3. Copiar los datos al dashboard:
   ```bash
   cp resultados_hematologicos.json hematologia-dashboard/src/data/
   ```
4. Actualizar el archivo `hematologia-dashboard/src/data/hematologicos.ts` con los nuevos datos
5. Hacer commit y push

## Notas

- Los PDFs de laboratorio no se versionan por privacidad
- Los valores de referencia en el dashboard son orientativos
- Consultar siempre con un profesional medico para interpretacion de resultados
