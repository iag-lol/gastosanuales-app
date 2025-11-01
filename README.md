# Gastos Inteligentes

Aplicación web moderna para el control de deudas y gastos mensuales, optimizada para escritorio y móvil. Permite registrar compromisos, definir fechas de pago (fin de mes, quincena o día fijo), recibir alertas ante atrasos y analizar el avance con paneles e informes inteligentes. La interfaz está pensada como una experiencia tipo app móvil con menú inferior y versión de escritorio con barra lateral.

## Características principales

- **Panel inteligente** con resumen de montos totales, proyección mensual/quincenal, pagos próximos y alertas de riesgo.
- **Gestor de deudas** con filtros avanzados, etiquetas, seguimiento de cuotas, estados (_pendiente, pagada, postergada, atrasada, archivada_).
- **Reportes dinámicos** con gráficas de distribución por categoría, tendencias de pago y tablas exportables.
- **Alertas en el dispositivo** a través de notificaciones locales y recordatorios configurables desde Supabase.
- **Experiencia responsive**: barra lateral en escritorio y navegación inferior estilo app móvil.
- **Integración con Supabase** usando tablas con prefijo `gastosanuales_` para deudas, pagos y recordatorios.
- **Moneda única**: todos los montos se gestionan en pesos chilenos (CLP) sin decimales.

## Requisitos

- Node.js 18 o superior.
- Proyecto de Supabase (Free/Pro) con las tablas descritas abajo.

## Instalación

```bash
npm install
```

## Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con las credenciales públicas de Supabase:

```bash
VITE_SUPABASE_URL="https://TU-PROYECTO.supabase.co"
VITE_SUPABASE_ANON_KEY="tu-clave-anon"
```

> Nota: el código incluye de forma predeterminada la conexión al proyecto Supabase `tcmtxvuucjttngcazgff`. Puedes usarlo tal cual o reemplazarlo creando tu propio proyecto y definiendo estas variables.

## Scripts disponibles

- `npm run dev`: levanta el entorno de desarrollo (Vite) en `http://localhost:5173`.
- `npm run build`: genera la versión de producción.
- `npm run preview`: sirve la build generada.
- `npm run lint`: ejecuta ESLint sobre el código fuente.

## Esquema recomendado en Supabase

Ejecuta el contenido de [`supabase/schema.sql`](supabase/schema.sql) en tu proyecto de Supabase para crear las tablas y función necesarias:

- `gastosanuales_deudas`: almacena la definición de cada deuda.
- `gastosanuales_pagos`: registra pagos programados y ejecutados.
- `gastosanuales_recordatorios`: schedulers para alertas.
- Función `gastosanuales_increment_instalment(debt_identifier uuid)` para aumentar cuotas pagadas al registrar un pago.

### Columnas clave

**`gastosanuales_deudas`**

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `name` | text | Nombre descriptivo de la deuda |
| `amount` | numeric(12,0) | Importe total en pesos chilenos (sin decimales) |
| `currency` | text | Siempre `CLP` |
| `frequency` | text | `monthly`, `biweekly` o `custom` |
| `due_day_type` | text | `end_of_month`, `quincena`, `custom` |
| `custom_due_day` | integer | Día específico (1-31) cuando aplica |
| `alert_threshold_days` | integer | Días de anticipación para emitir alerta |
| `status` | text | `pending`, `paid`, `overdue`, `postponed`, `archived` |
| `autopay` | boolean | Indica si hay cargo automático |

**`gastosanuales_pagos`**

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `debt_id` | uuid (FK) | Relación con `gastosanuales_deudas` |
| `amount` | numeric(12,0) | Monto programado (CLP) |
| `scheduled_for` | date | Fecha programada del pago |
| `paid_at` | timestamptz | Fecha/hora real del pago |
| `status` | text | `scheduled`, `paid`, `postponed`, `skipped` |

**`gastosanuales_recordatorios`**

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `debt_id` | uuid (FK) | Referencia a la deuda |
| `fire_at` | timestamptz | Momento del recordatorio |
| `kind` | text | `upcoming`, `overdue`, `postponed`, `summary` |

## Flujo general de datos

1. El usuario registra deudas desde la vista "Deudas". Cada registro crea un documento en `gastosanuales_deudas`.
2. Los pagos programados se consultan en `gastosanuales_pagos` y alimentan el widget de próximos pagos.
3. Al marcar una deuda como pagada o postergada, se invoca Supabase y React Query actualiza los dashboards en vivo.
4. Los reportes consumen las mismas tablas para construir gráficos, proyecciones y tablas resumen.

## Estilos y diseño

- Paleta clara con acentos en azul (`#3c5fff`).
- Tailwind CSS para utilidades; componentes personalizados con clases y `class-variance-authority`.
- Efectos de vidrio/fondo translúcido y sombras suaves para sensación premium.

## Próximos pasos sugeridos

- Implementar notificaciones push reales utilizando Supabase Edge Functions.
- Agregar autenticación ligera (por ejemplo Magic Link) cuando se requiera multiusuario.
- Crear automatizaciones en Supabase para generar registros en `gastosanuales_pagos` según la frecuencia configurada.
- Sincronizar calendario (Google Calendar / iCal) para recibir recordatorios externos.

---

Este proyecto está listo para ejecutarse en tu PC y móvil (utiliza _responsive design_). Ejecuta `npm run dev`, configura las variables de entorno y comienza a gestionar tus gastos mensuales de forma inteligente.
