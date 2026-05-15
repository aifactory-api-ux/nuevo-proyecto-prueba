# MASTER DEVELOPMENT PLAN

> Fuente de verdad única. Los nombres de clases, fields, rutas y variables
> definidos en §1 son los ÚNICOS válidos — el coder no puede inventar nombres.

> ⚠️ **ORDEN DE IMPLEMENTACIÓN GLOBAL — NO NEGOCIABLE:**
> 1. Implementa **TODOS** los ítems marcados 🔴 TEST (de todos los waves) antes de escribir cualquier ítem 🟢 PROD.
> 2. Una vez escritos todos los tests, implementa los ítems 🟢 PROD.
> 3. Si no hay ítems 🔴 TEST, implementa los 🟢 PROD directamente.
> Razón: el código de producción debe ser escrito sabiendo qué contratos deben satisfacer los tests.

---

# §1 Contratos Globales

## §1.1 Especificación Técnica — Stack, Modelos, Estructura, Env Vars

# SPEC.md

## 1. TECHNOLOGY STACK

- **Frontend**
  - React 18.2.0
  - Vite 4.4.9
  - Tailwind CSS 3.3.3
  - Recharts 2.7.2
  - TypeScript 5.2.2
  - Node.js 20.x

- **Backend**
  - FastAPI 0.103.2
  - Python 3.11.x
  - SQLAlchemy 2.0.21
  - Pydantic 2.4.2
  - SQLite 3.x

- **Infrastructure**
  - Docker 24.x
  - docker-compose 2.21.x

## 2. DATA CONTRACTS

### Python (Pydantic models)

```python
# backend/app/models.py

from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class DispatchBase(BaseModel):
    plant: str
    distribution_center: str
    product: str
    quantity: int
    dispatched_at: datetime

class DispatchCreate(DispatchBase):
    pass

class Dispatch(DispatchBase):
    id: int

    class Config:
        orm_mode = True

class DispatchList(BaseModel):
    dispatches: List[Dispatch]

class DispatchStats(BaseModel):
    plant: str
    total_quantity: int
    dispatch_count: int

class DispatchStatsList(BaseModel):
    stats: List[DispatchStats]
```

### TypeScript (Frontend interfaces)

```typescript
// frontend/src/types/dispatch.ts

export interface Dispatch {
  id: number;
  plant: string;
  distribution_center: string;
  product: string;
  quantity: number;
  dispatched_at: string; // ISO 8601
}

export interface DispatchCreate {
  plant: string;
  distribution_center: string;
  product: string;
  quantity: number;
  dispatched_at: string; // ISO 8601
}

export interface DispatchList {
  dispatches: Dispatch[];
}

export interface DispatchStats {
  plant: string;
  total_quantity: number;
  dispatch_count: number;
}

export interface DispatchStatsList {
  stats: DispatchStats[];
}
```

## 3. API ENDPOINTS

### 1. Create a Dispatch

- **Method:** POST
- **Path:** `/api/dispatches/`
- **Request Body:** `DispatchCreate`
- **Response:** `Dispatch`

```json
// Request body example
{
  "plant": "Planta Norte",
  "distribution_center": "CD Monterrey",
  "product": "Producto A",
  "quantity": 120,
  "dispatched_at": "2024-06-10T14:30:00Z"
}
```

```json
// Response example
{
  "id": 1,
  "plant": "Planta Norte",
  "distribution_center": "CD Monterrey",
  "product": "Producto A",
  "quantity": 120,
  "dispatched_at": "2024-06-10T14:30:00Z"
}
```

---

### 2. List All Dispatches

- **Method:** GET
- **Path:** `/api/dispatches/`
- **Response:** `DispatchList`

```json
{
  "dispatches": [
    {
      "id": 1,
      "plant": "Planta Norte",
      "distribution_center": "CD Monterrey",
      "product": "Producto A",
      "quantity": 120,
      "dispatched_at": "2024-06-10T14:30:00Z"
    },
    {
      "id": 2,
      "plant": "Planta Sur",
      "distribution_center": "CD Guadalajara",
      "product": "Producto B",
      "quantity": 80,
      "dispatched_at": "2024-06-11T09:00:00Z"
    }
  ]
}
```

---

### 3. Get Dispatch Statistics by Plant

- **Method:** GET
- **Path:** `/api/dispatches/stats/plant`
- **Response:** `DispatchStatsList`

```json
{
  "stats": [
    {
      "plant": "Planta Norte",
      "total_quantity": 120,
      "dispatch_count": 1
    },
    {
      "plant": "Planta Sur",
      "total_quantity": 80,
      "dispatch_count": 1
    }
  ]
}
```

---

### 4. Delete a Dispatch

- **Method:** DELETE
- **Path:** `/api/dispatches/{dispatch_id}`
- **Response:** `{ "ok": true }`

---

### 5. Get Single Dispatch

- **Method:** GET
- **Path:** `/api/dispatches/{dispatch_id}`
- **Response:** `Dispatch`

---

## 4. FILE STRUCTURE

### PORT TABLE

| Service   | Listening Port | Path              |
|-----------|---------------|-------------------|
| backend   | 23001         | backend/          |

### FILE TREE

```
.
├── docker-compose.yml                # Orchestrates backend, frontend, and database containers
├── .env.example                     # Template for environment variables
├── .gitignore                       # Git ignore rules
├── README.md                        # Project documentation
├── run.sh                           # Root-level startup script
├── backend/
│   ├── Dockerfile                   # Backend service Dockerfile (EXPOSE 23001)
│   ├── app/
│   │   ├── __init__.py              # Package marker
│   │   ├── main.py                  # FastAPI app entrypoint
│   │   ├── models.py                # Pydantic models and SQLAlchemy ORM models
│   │   ├── database.py              # SQLAlchemy engine/session setup
│   │   ├── crud.py                  # CRUD operations for dispatches
│   │   ├── api.py                   # API route definitions
│   │   ├── deps.py                  # Dependency overrides (DB session, etc.)
│   │   └── tests/
│   │       ├── __init__.py
│   │       └── test_api.py          # API endpoint tests
│   └── start.sh                     # Backend startup script
├── frontend/
│   ├── Dockerfile                   # Frontend service Dockerfile (EXPOSE 23002)
│   ├── vite.config.ts               # Vite configuration
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   ├── postcss.config.js            # PostCSS configuration
│   ├── tsconfig.json                # TypeScript configuration
│   ├── public/
│   │   └── index.html               # HTML entry point (loads /src/main.tsx)
│   ├── src/
│   │   ├── main.tsx                 # React app entry point
│   │   ├── App.tsx                  # Root React component
│   │   ├── api/
│   │   │   └── dispatch.ts          # API client for dispatch endpoints
│   │   ├── components/
│   │   │   ├── DispatchList.tsx     # Table/list of dispatches
│   │   │   ├── DispatchForm.tsx     # Form to create a dispatch
│   │   │   ├── DispatchStatsChart.tsx # Recharts visualization of stats
│   │   │   └── LoadingSpinner.tsx   # Loading indicator
│   │   ├── hooks/
│   │   │   └── useDispatches.ts     # React hook for dispatch state
│   │   ├── types/
│   │   │   └── dispatch.ts          # TypeScript interfaces for dispatches
│   │   ├── styles/
│   │   │   ├── tokens.ts            # Design tokens (colors, spacing, etc.)
│   │   │   └── index.css            # Tailwind base styles
│   │   └── utils/
│   │       └── formatDate.ts        # Date formatting utility
│   └── start.sh                     # Frontend startup script
```

## 5. ENVIRONMENT VARIABLES

| Name                | Type   | Description                                         | Example Value                |
|---------------------|--------|-----------------------------------------------------|------------------------------|
| BACKEND_HOST        | str    | Hostname for backend FastAPI server                 | 0.0.0.0                     |
| BACKEND_PORT        | int    | Port for backend FastAPI server                     | 23001                       |
| DATABASE_URL        | str    | SQLAlchemy DB URL                                   | sqlite:///./app.db          |
| FRONTEND_HOST       | str    | Hostname for frontend Vite dev server               | 0.0.0.0                     |
| FRONTEND_PORT       | int    | Port for frontend Vite dev server                   | 23002                       |
| VITE_API_URL        | str    | API base URL for frontend (Vite env var)            | http://localhost:23001/api  |
| TZ                  | str    | Timezone for containers                             | America/Mexico_City         |

## 6. IMPORT CONTRACTS

### Backend

- `from app.models import Dispatch, DispatchCreate, DispatchList, DispatchStats, DispatchStatsList`
- `from app.crud import create_dispatch, get_dispatches, get_dispatch_by_id, delete_dispatch, get_dispatch_stats_by_plant`
- `from app.database import get_db, Base, engine, SessionLocal`
- `from app.api import router as api_router`
- `from app.deps import get_db_session`

### Frontend

- `import { Dispatch, DispatchCreate, DispatchList, DispatchStats, DispatchStatsList } from '../types/dispatch'`
- `import { useDispatches } from '../hooks/useDispatches'`
- `import { tokens } from '../styles/tokens'`
- `import { formatDate } from '../utils/formatDate'`
- `import { createDispatch, fetchDispatches, deleteDispatch, fetchDispatchStats } from '../api/dispatch'`
- `import DispatchList from '../components/DispatchList'`
- `import DispatchForm from '../components/DispatchForm'`
- `import DispatchStatsChart from '../components/DispatchStatsChart'`
- `import LoadingSpinner from '../components/LoadingSpinner'`

## 7. FRONTEND STATE & COMPONENT CONTRACTS

### Shared State Primitives

#### React hook: useDispatches

```typescript
useDispatches() → {
  dispatches: Dispatch[];
  stats: DispatchStats[];
  loading: boolean;
  error: string | null;
  createDispatch: (data: DispatchCreate) => Promise<void>;
  deleteDispatch: (id: number) => Promise<void>;
  fetchStats: () => Promise<void>;
  deletingId: number | null;
}
```

### Reusable Components

#### DispatchList

```typescript
DispatchList props: {
  dispatches: Dispatch[];
  onDelete: (id: number) => void;
  deletingId: number | null;
}
```

#### DispatchForm

```typescript
DispatchForm props: {
  onSubmit: (data: DispatchCreate) => void;
  loading: boolean;
}
```

#### DispatchStatsChart

```typescript
DispatchStatsChart props: {
  stats: DispatchStats[];
}
```

#### LoadingSpinner

```typescript
LoadingSpinner props: {
  size?: number;
  className?: string;
}
```

## 8. FILE EXTENSION CONVENTION

- All frontend files use `.tsx` (TypeScript React).
- The project is TypeScript-based (no JavaScript files).
- Entry point: `/src/main.tsx` (as referenced in `public/index.html`).

## 9. DESIGN TOKENS

```typescript
// frontend/src/styles/tokens.ts

export const tokens = {
  colors: {
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#f59e42',
    background: '#f8fafc',
    surface: '#ffffff',
    error: '#ef4444',
    success: '#22c55e',
    warning: '#facc15',
    text: '#1e293b',
    muted: '#94a3b8'
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    fontSizeBase: '1rem',
    fontWeightRegular: 400,
    fontWeightBold: 700,
    lineHeightBase: 1.5
  },
  spacing: {
    0: '0px',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    6: '1.5rem',
    8: '2rem',
    12: '3rem',
    16: '4rem'
  },
  borderRadius: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(16, 24, 40, 0.05)',
    md: '0 4px 6px -1px rgba(16, 24, 40, 0.07)',
    lg: '0 10px 15px -3px rgba(16, 24, 40, 0.10)'
  }
};
```

## §1.2 Contrato API (OpenAPI 3.1)
> Ref obligatoria para tests de endpoints: usa los paths, schemas y status codes exactos de aquí.

```yaml
openapi: 3.1.0
info:
  title: Dispatch API
  version: '1.0.0'
paths:
  /api/dispatches/:
    post:
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/DispatchCreate'
      responses:
        '200':
          description: Successful Response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Dispatch'
    get:
      responses:
        '200':
          description: Successful Response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DispatchList'
  /api/dispatches/stats/plant:
    get:
      responses:
        '200':
          description: Successful Response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DispatchStatsList'
  /api/dispatches/{dispatch_id}:
    get:
      parameters:
        - name: dispatch_id
          in: path
          required: true
          schema:
            type: integer
    delete:
      parameters:
        - name: dispatch_id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Successful Response
          content:
            application/json:
              schema:
                type: object
                properties:
                  ok:
                    type: boolean
                required:
                  - ok
    get:
      parameters:
        - name: dispatch_id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Successful Response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Dispatch'
components:
  schemas:
    DispatchBase:
      type: object
      properties:
        plant:
          type: string
        distribution_center:
          type: string
        product:
          type: string
        quantity:
          type: integer
        dispatched_at:
          type: string
          format: date-time
      required:
        - plant
        - distribution_center
        - product
        - quantity
        - dispatched_at
    DispatchCreate:
      allOf:
        - $ref: '#/components/schemas/DispatchBase'
    Dispatch:
      allOf:
        - $ref: '#/components/schemas/DispatchBase'
        - type: object
          properties:
            id:
              type: integer
          required:
            - id
    DispatchList:
      type: object
      properties:
        dispatches:
          type: array
          items:
            $ref: '#/components/schemas/Dispatch'
      required:
        - dispatches
    DispatchStats:
      type: object
      properties:
        plant:
          type: string
        total_quantity:
          type: integer
        dispatch_count:
          type: integer
      required:
        - plant
        - total_quantity
        - dispatch_count
    DispatchStatsList:
      type: object
      properties:
        stats:
          type: array
          items:
            $ref: '#/components/schemas/DispatchStats'
      required:
        - stats
```

---

# §2 Plan de Implementación

> **REGLA TDD OBLIGATORIA**
> 1. Escribe el ítem 🔴 TEST completo antes de tocar el ítem 🟢 PROD.
> 2. Corre los tests: deben fallar (RED). Si pasan sin código de producción, el test está mal.
> 3. Escribe el código de producción mínimo para que pasen (GREEN).
> 4. Si los tests fallan después del paso 3, corrige SOLO producción — nunca los tests.

## Wave 2

### 🟢 PROD — Design Tokens Implementation
> Implement all design tokens as per UI/UX contract for use across the app.
**Archivos:**
  - `frontend/src/styles/tokens.ts`


### 🟢 PROD — Dashboard Principal Page
> Implement the `Dashboard Principal` page, assembling all sections per Figma frame.
**Archivos:**
  - `frontend/src/pages/DashboardPrincipal.tsx`


## Wave 3

### 🟢 PROD — Header Component
> Implement the `Header` component as per Figma and contract.
**Archivos:**
  - `frontend/src/components/ui/Header.tsx`


### 🟢 PROD — FilterBar Component
> Implement the `FilterBar` component with two dropdowns for Planta and Estado.
**Archivos:**
  - `frontend/src/components/ui/FilterBar.tsx`


### 🟢 PROD — KpiCard Component
> Implement the `KpiCard` component for KPI display with semantic backgrounds and skeleton loading.
**Archivos:**
  - `frontend/src/components/ui/KpiCard.tsx`


### 🟢 PROD — TrendChart Component
> Implement the `TrendChart` component using Recharts for monthly trend.
**Archivos:**
  - `frontend/src/components/ui/TrendChart.tsx`


### 🟢 PROD — PlantChart Component
> Implement the `PlantChart` component using Recharts for plant volume.
**Archivos:**
  - `frontend/src/components/ui/PlantChart.tsx`


### 🟢 PROD — OrdersTable Component
> Implement the `OrdersTable` component with pagination, colored badges, and responsive scroll.
**Archivos:**
  - `frontend/src/components/ui/OrdersTable.tsx`


### 🟢 PROD — OrderForm Component
> Implement the `OrderForm` component for creating dispatches with validation.
**Archivos:**
  - `frontend/src/components/ui/OrderForm.tsx`


### 🟢 PROD — Toast Component
> Implement the `Toast` component for temporary notifications.
**Archivos:**
  - `frontend/src/components/ui/Toast.tsx`


### 🟢 PROD — ErrorBanner Component
> Implement the `ErrorBanner` component for global API errors.
**Archivos:**
  - `frontend/src/components/ui/ErrorBanner.tsx`


### 🟢 PROD — PrimaryButton Component
> Implement the `PrimaryButton` component for primary actions.
**Archivos:**
  - `frontend/src/components/ui/PrimaryButton.tsx`


### 🟢 PROD — Card Component
> Implement the `Card` component for consistent card UI.
**Archivos:**
  - `frontend/src/components/ui/Card.tsx`


### 🟢 PROD — API Hooks and Services
> Implement all API hooks (`useDispatches`, `useCreateDispatch`, `useDispatchStats`, etc.) for data fetching/mutation.
**Archivos:**
  - `frontend/src/hooks/useDispatches.ts`  
  - `frontend/src/hooks/useCreateDispatch.ts`  
  - `frontend/src/hooks/useDispatchStats.ts`  
  - `frontend/src/hooks/useDeleteDispatch.ts`  
  - `frontend/src/hooks/useSingleDispatch.ts`


---

# §3 Reglas de Infraestructura (obligatorias)

## §3.1 Dockerfiles y docker-compose.yml — OBLIGATORIOS
⚠️ **Estos archivos son MANDATORIOS independientemente del plan de ítems. OpenCode DEBE crearlos.**

**Para cada servicio del proyecto (backend, frontend, workers):**
- Crea `<servicio>/Dockerfile` con `WORKDIR /app` (NUNCA rutas absolutas con UUID)
- El `docker build` debe funcionar en cualquier máquina sin modificaciones
- Multi-stage build si aplica (builder + runner para minimizar imagen final)

**docker-compose.yml en la raíz del proyecto (SIEMPRE crear o actualizar):**
- Un servicio por cada componente del sistema (backend, frontend, db, redis, etc.)
- `build: context: ./<servicio>` apuntando al directorio con su Dockerfile
- Puertos del host: SIEMPRE en el rango **21000–65000** (§3.3)
- Variables de entorno via `env_file` o `environment:` (nunca hardcodeadas)
- Dependencias entre servicios via `depends_on`
- Volumen para la base de datos si aplica

## §3.2 Base de Datos — Auto-Init Obligatorio
Si el proyecto usa base de datos relacional (PostgreSQL, MySQL, SQLite, MariaDB, etc.),
el backend DEBE ejecutar esta secuencia automáticamente al arrancar el contenedor:

1. **Esperar a que la DB esté lista** — retry loop o wait-for-it, nunca asumir que está disponible
2. **Correr migraciones** — `alembic upgrade head` / `prisma migrate deploy` / `knex migrate:latest` / etc.
3. **Seed de datos de ejemplo** — solo si la tabla principal está vacía (idempotente, nunca duplica al reiniciar)
   - Insertar **3–5 registros realistas** por entidad principal
   - El seed usa los mismos modelos/schemas del proyecto — nunca SQL crudo hardcodeado
   - Patrón Python: `if db.query(Model).count() == 0: db.add_all([...]); db.commit()`
   - Patrón Node: `const count = await prisma.model.count(); if (count === 0) { await prisma.model.createMany({...}) }`

Resultado: después de `./run.sh` la app tiene datos de ejemplo listos, sin pasos manuales.

## §3.3 Puertos de Servicio
- Rango obligatorio para **todos** los puertos del host en docker-compose.yml: **21000–65000**.
- Aplica a TODOS los servicios: backends, frontends Y bases de datos / infraestructura.
- El puerto interno del contenedor se mantiene en el default de la tecnología:
  | Tecnología | Puerto interno | Ejemplo host mapping |
  |-----------|---------------|----------------------|
  | PostgreSQL | 5432 | `'25432:5432'` |
  | MySQL      | 3306 | `'23306:3306'` |
  | Redis      | 6379 | `'26379:6379'` |
  | MongoDB    | 27017 | `'37017:27017'` |
  | Backend API | (PORT TABLE §1.1) | `'23001:23001'` |
- NUNCA exponer 3000, 5000, 5432, 6379, 8000, 8080, 8443 en el lado del host.
- El Tech Lead remapeará automáticamente cualquier puerto fuera del rango 21000–65000.

## §3.4 Frontend con Vite / React / Vue
- `index.html` en la RAÍZ del proyecto (mismo nivel que `package.json` y `vite.config.js`)
- NUNCA solo en `public/` — Vite requiere el entry point en la raíz
- Entry point: `<script type='module' src='/src/main.jsx'></script>`

## §3.5 Variables de Entorno
- Vite: `import.meta.env.VITE_NOMBRE` con fallback → `|| 'http://localhost:PUERTO'` (PUERTO del PORT TABLE §1.1)
- Nunca hardcodear URLs, tokens ni secrets en código fuente

## §3.6 Criterios de Finalización
- Todos los archivos listados en §2 deben existir en disco
- Código completo y funcional — sin TODOs ni stubs
- Tests corriendo y pasando antes del commit final
- `git add -A && git commit -m 'feat: implement project'`