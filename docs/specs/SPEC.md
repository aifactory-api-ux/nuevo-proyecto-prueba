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