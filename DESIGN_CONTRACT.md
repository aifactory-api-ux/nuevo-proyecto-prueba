# Frontend Development Plan

## ⚠️ FRONTEND-ONLY PHASE
The **backend is already fully implemented and tested**.
Your ONLY task is to implement the frontend based on the approved UI/UX design contract.
- DO NOT modify any backend files (Python, Go, Node.js service files)
- DO NOT recreate backend logic, routes, or models
- ONLY create frontend files: pages, components, hooks, styles, config

## 🔗 API INTEGRATION — READ BEFORE IMPLEMENTING ANY PAGE
The backend exposes REST endpoints defined in `api_contract.yaml` (available in the workspace).
**ALL data must come from the backend API — no mock data, no hardcoded arrays, no placeholder values.**

### Required setup
1. Create `frontend/.env.example` with `NEXT_PUBLIC_API_URL=http://localhost:8000`
   (use `VITE_API_URL` if the stack is Vite/React without Next.js).
2. Create `frontend/src/lib/api.ts` (or `frontend/src/services/api.ts`) as the HTTP base client:
   - Reads the base URL from the environment variable
   - Attaches `Authorization: Bearer <token>` if the user is authenticated
   - Throws on HTTP 4xx/5xx so callers can handle errors
3. For **each endpoint group** in `api_contract.yaml`: create one hook file under
   `frontend/src/hooks/use<Resource>.ts` (e.g., `useProducts.ts`, `useOrders.ts`, `useAuth.ts`).
4. Pages and components **must call these hooks** — never call `fetch`/`axios` directly from JSX.

### Authentication
- If the contract has `/auth/login` or `/token` endpoints: store the JWT in `localStorage` or
  an httpOnly cookie and send it as `Authorization: Bearer <token>` on every protected request.
- Implement a React context or Zustand store for the auth state (user, token, isAuthenticated).

### Error handling
- Every data-fetching hook must expose a loading state and an error state.
- Pages must render a visible error message when an API call fails — no silent catches.

### API Contract summary (from api_contract.yaml)
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

## Visual Direction
Dashboard profesional y claro para logística industrial, con énfasis en legibilidad de datos, uso de colores semánticos para estados, y soporte de modo oscuro/claro. Diseño limpio, espaciado generoso, tipografía sans-serif moderna.

## Figma Source
File: https://www.figma.com/design/TMWnGuSf1eYtI5cIN52vCk

## Design Tokens
```json
{
  "colors": {
    "primary": "#6366F1",
    "primaryLight": "#A5B4FC",
    "secondary": "#1E293B",
    "background": "#0F172A",
    "surface": "#1E293B",
    "textPrimary": "#F1F5F9",
    "textSecondary": "#94A3B8",
    "border": "#334155",
    "success": "#22C55E",
    "warning": "#F59E0B",
    "error": "#EF4444",
    "info": "#3B82F6",
    "darkBackground": "#0F172A",
    "darkSurface": "#1E293B",
    "darkTextPrimary": "#F1F5F9",
    "darkTextSecondary": "#94A3B8",
    "darkBorder": "#334155"
  },
  "typography": {
    "fontFamily": "'Inter', 'Segoe UI', sans-serif",
    "headings": {
      "h1": "bold 28px/36px",
      "h2": "bold 22px/30px",
      "h3": "semibold 18px/26px"
    },
    "body": "regular 15px/22px",
    "small": "regular 13px/18px",
    "kpiValue": "bold 32px/40px",
    "kpiLabel": "medium 13px/18px"
  },
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "20px",
    "lg": "28px",
    "xl": "40px",
    "xxl": "48px"
  },
  "radii": {
    "sm": "6px",
    "md": "10px",
    "lg": "16px",
    "full": "9999px"
  },
  "shadows": {
    "card": "0 4px 12px rgba(0,0,0,0.08)",
    "elevated": "0 8px 24px rgba(0,0,0,0.12)"
  },
  "iconImageStyle": "Lucide icons, outline style, 20px default size",
  "motionInteraction": "Transiciones suaves de 200-300ms para hover, focus, y cambio de tema. Skeleton loading para KPIs y gr\u00e1ficos."
}
```

## Base Components (use exact names from Figma)
- **Header**: Barra superior con logo/nombre 'DistroViz', subtítulo, y botón de toggle tema oscuro/claro (icono sol/luna).
- **FilterBar**: Dos selectores desplegables: Planta (con opción 'Todas') y Estado (con opción 'Todos'). Al cambiar, recarga datos.
- **KpiCard**: Tarjeta con icono, valor numérico grande, etiqueta, y fondo de color semántico. Incluye estado de carga (skeleton).
- **TrendChart**: Gráfico de líneas (Recharts) mostrando tendencia mensual de unidades despachadas. Tooltip con valor exacto.
- **PlantChart**: Gráfico de barras (Recharts) mostrando volumen por planta. Colores distintivos por planta. Tooltip.
- **OrdersTable**: Tabla paginada (10 filas) con columnas: Planta, Centro Destino, Cantidad, Estado (badge de color), Fecha Despacho, Fecha Entrega. Filas alternadas. Badge: verde=delivered, azul=in_transit, amarillo=pending, rojo=cancelled. Delivery_date NULL muestra '—'.
- **OrderForm**: Formulario para crear orden: selects dinámicos para planta y centro, input numérico para cantidad, select para estado, date pickers para fechas. Validación local con bordes rojos y mensajes de error. Botón de envío.
- **Toast**: Notificación temporal (5s) para éxito o error. Aparece en esquina superior derecha. Incluye icono y mensaje.
- **ErrorBanner**: Banner de error global cuando la API no responde. Incluye mensaje y botón de reintento.
- **PrimaryButton**: Botón principal con color primary, hover oscuro, padding 10px 20px, border radius md.
- **Card**: Contenedor con fondo surface, borde sutil, sombra card, padding md, border radius md.

## Figma Frames — Pages to Implement
- **Dashboard Principal**: Vista única del dashboard con todas las secciones apiladas verticalmente: Header, FilterBar, KPI Cards (grid 4 columnas), TrendChart y PlantChart (grid 2 columnas), OrdersTable, OrderForm (al final o en modal).

## Implementation Items

### Item 12: Design Tokens Implementation
**Goal:** Implement all design tokens as per UI/UX contract for use across the app.
**Wave:** 2
**Files:**
  - `frontend/src/styles/tokens.ts` (create): Centralizes color, typography, spacing, radii, shadows, and motion tokens.
**Dependencies:** None
**Validation:** All tokens from the contract are present and match Figma; imported tokens render correct values in Storybook or a test component.

### Item 13: Header Component
**Goal:** Implement the `Header` component as per Figma and contract.
**Wave:** 3
**Files:**
  - `frontend/src/components/ui/Header.tsx` (create): Renders logo/name, subtitle, and theme toggle button.
**Dependencies:** Item 12
**Validation:** Header matches Figma, theme toggle switches dark/light mode, logo and subtitle visible, Lucide icons used.

### Item 14: FilterBar Component
**Goal:** Implement the `FilterBar` component with two dropdowns for Planta and Estado.
**Wave:** 3
**Files:**
  - `frontend/src/components/ui/FilterBar.tsx` (create): Renders two selects, triggers data reload on change, responsive stacking.
**Dependencies:** Item 12
**Validation:** Dropdowns match Figma, options include 'Todas'/'Todos', triggers callback on change, responsive layout verified.

### Item 15: KpiCard Component
**Goal:** Implement the `KpiCard` component for KPI display with semantic backgrounds and skeleton loading.
**Wave:** 3
**Files:**
  - `frontend/src/components/ui/KpiCard.tsx` (create): Renders icon, value, label, semantic background, skeleton state.
**Dependencies:** Item 12
**Validation:** Card matches Figma, correct color per status, skeleton visible during loading, typography and spacing per tokens.

### Item 16: TrendChart Component
**Goal:** Implement the `TrendChart` component using Recharts for monthly trend.
**Wave:** 3
**Files:**
  - `frontend/src/components/ui/TrendChart.tsx` (create): Renders line chart, tooltip with exact value, skeleton loading.
**Dependencies:** Item 12
**Validation:** Chart matches Figma, tooltip shows correct value, skeleton on loading, responsive behavior verified.

### Item 17: PlantChart Component
**Goal:** Implement the `PlantChart` component using Recharts for plant volume.
**Wave:** 3
**Files:**
  - `frontend/src/components/ui/PlantChart.tsx` (create): Renders bar chart, plant colors, tooltip, skeleton loading.
**Dependencies:** Item 12
**Validation:** Chart matches Figma, colors distinct per plant, tooltip correct, skeleton on loading, responsive verified.

### Item 18: OrdersTable Component
**Goal:** Implement the `OrdersTable` component with pagination, colored badges, and responsive scroll.
**Wave:** 3
**Files:**
  - `frontend/src/components/ui/OrdersTable.tsx` (create): Renders paginated table, badge per status, alternate rows, scroll on mobile.
**Dependencies:** Item 12
**Validation:** Table matches Figma, badges colored per status, pagination works, scroll on mobile, delivery_date NULL shows '—'.

### Item 19: OrderForm Component
**Goal:** Implement the `OrderForm` component for creating dispatches with validation.
**Wave:** 3
**Files:**
  - `frontend/src/components/ui/OrderForm.tsx` (create): Renders dynamic selects, numeric input, status select, date pickers, validation, submit button.
**Dependencies:** Item 12
**Validation:** Form matches Figma, validation errors shown, selects dynamic, submit triggers callback, error states styled.

### Item 20: Toast Component
**Goal:** Implement the `Toast` component for temporary notifications.
**Wave:** 3
**Files:**
  - `frontend/src/components/ui/Toast.tsx` (create): Renders notification with icon, message, auto-dismiss after 5s, top-right position.
**Dependencies:** Item 12
**Validation:** Toast matches Figma, appears/disappears as specified, correct icon/message, multiple toasts stack.

### Item 21: ErrorBanner Component
**Goal:** Implement the `ErrorBanner` component for global API errors.
**Wave:** 3
**Files:**
  - `frontend/src/components/ui/ErrorBanner.tsx` (create): Renders error message and retry button.
**Dependencies:** Item 12
**Validation:** Banner matches Figma, visible on API error, retry button triggers callback, dismisses on success.

### Item 22: PrimaryButton Component
**Goal:** Implement the `PrimaryButton` component for primary actions.
**Wave:** 3
**Files:**
  - `frontend/src/components/ui/PrimaryButton.tsx` (create): Renders button with primary color, hover, padding, border radius.
**Dependencies:** Item 12
**Validation:** Button matches Figma, hover/focus transitions, correct padding/radius, accessible.

### Item 23: Card Component
**Goal:** Implement the `Card` component for consistent card UI.
**Wave:** 3
**Files:**
  - `frontend/src/components/ui/Card.tsx` (create): Renders container with shadow, padding, border radius.
**Dependencies:** Item 12
**Validation:** Card matches Figma, correct shadow, spacing, radius, used as wrapper in other components.

### Item 24: API Hooks and Services
**Goal:** Implement all API hooks (`useDispatches`, `useCreateDispatch`, `useDispatchStats`, etc.) for data fetching/mutation.
**Wave:** 3
**Files:**
  - `frontend/src/hooks/useDispatches.ts` (create): Fetches/paginates dispatches.
  - `frontend/src/hooks/useCreateDispatch.ts` (create): Creates dispatch.
  - `frontend/src/hooks/useDispatchStats.ts` (create): Fetches plant stats.
  - `frontend/src/hooks/useDeleteDispatch.ts` (create): Deletes dispatch.
  - `frontend/src/hooks/useSingleDispatch.ts` (create): Fetches single dispatch.
**Dependencies:** Item 12
**Validation:** Hooks return correct data, handle loading/error states, integrate with ErrorBanner/Toast, tested with mock API.

### Item 25: Dashboard Principal Page
**Goal:** Implement the `Dashboard Principal` page, assembling all sections per Figma frame.
**Wave:** 2
**Files:**
  - `frontend/src/pages/DashboardPrincipal.tsx` (create): Composes Header, FilterBar, KPI Cards (grid), TrendChart, PlantChart, OrdersTable, OrderForm/modal, ErrorBanner, Toast.
**Dependencies:** Items 13–24
**Validation:** Page matches Figma layout and responsiveness, all sections functional, data loads via hooks, theme toggle works, filters update data, OrderForm creates dispatch, toasts/errors shown as needed.
