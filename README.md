# Jira (mini) — Boards & Tickets

Aplicación tipo Jira simplificada con dos entidades: **boards** y **tickets**.
Backend en Node.js + TypeScript + Express + PostgreSQL (Supabase). Frontend en
Next.js (React) + TypeScript.

## Modelo de datos

La base de datos tiene dos tablas, creadas en `server/src/db/db.ts`:

### `boards`

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `UUID` (PK, default `gen_random_uuid()`) | Identificador del tablero |
| `name` | `TEXT` | Nombre del tablero |

### `tickets`

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `UUID` (PK, default `gen_random_uuid()`) | Identificador del ticket |
| `content` | `TEXT` | Descripción / contenido del ticket |
| `board_id` | `UUID` (FK → `boards.id`, `ON DELETE CASCADE`) | Tablero al que pertenece el ticket |
| `status` | `TEXT` (default `'TODO'`) | Estado del ticket: `TODO`, `IN_PROGRESS` o `DONE` |

### Relación

Un **board** tiene muchos **tickets** (1 → N) a través de `tickets.board_id`.
Si un board se elimina, sus tickets se eliminan en cascada (`ON DELETE CASCADE`).
Un ticket siempre pertenece a exactamente un board.

## Server (`server/src/features`)

El servidor sigue una arquitectura por capas (`router → controller → service → repository`)
en una sola feature, `boards`, que concentra las funciones de **boards** y
**tickets** (están relacionadas 1→N, así que viven juntas).

### Feature `boards`

Ubicada en `server/src/features/boards/`. Expone:

- `POST /api/boards` — crear un board (`name`).
- `GET /api/boards` — listar todos los boards.
- `GET /api/boards/:id` — obtener un board por id.
- `DELETE /api/boards/:id` — eliminar un board (y sus tickets, en cascada).
- `POST /api/boards/:boardId/tickets` — crear un ticket dentro de un board (`content`).
- `GET /api/boards/:boardId/tickets` — listar los tickets de un board.
- `PATCH /api/boards/:boardId/tickets/:id` — actualizar el `status` de un ticket.

`boards.types.ts` concentra las interfaces en camelCase de ambas entidades
(`Board`, `CreateBoardDTO`, `Ticket`, `CreateTicketDTO`,
`UpdateTicketStatusDTO`, `TicketStatus`). El servicio valida que el board (o
el ticket) exista antes de operar, lanzando `404` (`Boom.notFound`) cuando no
es así.

## Client (`client/`)

### Pantallas

**1. Lista de boards (`app/page.tsx`)**
Pantalla inicial. Muestra un formulario para crear un board
(`CreateBoardForm`) y la lista de boards existentes (`BoardsList`), cada uno
con un link hacia su detalle y un botón para eliminarlo.

**2. Detalle de board (`app/boards/[id]/page.tsx`)**
Muestra el nombre del board, un formulario para crear tickets
(`CreateTicketForm`) y el tablero de tickets (`TicketBoard`) con **3
columnas**: `TO-DO`, `IN-PROGRESS` y `DONE`. Cada ticket se renderiza como una
`TicketCard` con un selector para cambiar su estado, lo que dispara el
`PATCH /api/boards/:boardId/tickets/:id`.

### Contexts

**`BoardsContext` (`context/BoardsContext.tsx`)**
Maneja el estado de la lista de boards: la carga inicial (`GET /boards`), y
las operaciones `createBoard` y `deleteBoard`, que llaman al backend y
actualizan el estado local de la lista. Lo consume la pantalla de lista de
boards.

**`BoardContext` (`context/BoardContext.tsx`)**
Maneja el estado de un board específico y sus tickets: la carga inicial del
board y sus tickets (`GET /boards/:id` + `GET /boards/:id/tickets`), y las
operaciones `createTicket`, `updateTicketStatus` y `deleteBoard`. Lo consume
la pantalla de detalle de board.

Ninguno de los dos contexts implementa aún tiempo real: cada cliente solo ve
los cambios que él mismo provoca, hasta que recarga la página.

## Ejercicios del parcial

Cada punto vale **2.5** sobre la nota del parcial. Si se completan **los 3**,
se gana un **0.3 adicional sobre la nota final del parcial**.

### 1. Tiempo real al crear un board (2.5)

Implementar una conexión WebSocket entre el server y el client para que,
cuando un cliente cree un board, ese nuevo board se refleje automáticamente
en todos los demás clientes conectados (sin recargar la página), actualizando
la lista de boards.

### 2. Tiempo real al crear un ticket (2.5)

Implementar que, cuando se cree un ticket dentro de un board (vía
`POST /api/boards/:boardId/tickets`), ese ticket se refleje automáticamente
en todos los demás clientes que estén viendo ese mismo board, apareciendo en
la columna `TO-DO` sin recargar la página.

### 3. Tiempo real al actualizar el status de un ticket (2.5)

Implementar que, cuando se actualice el `status` de un ticket (vía
`PATCH /api/boards/:boardId/tickets/:id`), ese cambio se refleje automáticamente en todos los
demás clientes que estén viendo ese mismo board, moviendo la `TicketCard` a la
columna correspondiente sin recargar la página.

## Pistas

Van a necesitar dos funciones de broadcast en el server (por ejemplo, en
`boards.service.ts`), que llamen a Supabase Realtime vía
`supabase.channel(...).httpSend(event, payload)` y limpien el canal al
terminar. La idea es tener un canal global para la lista de boards y un
canal por board para lo que pasa dentro de un board específico:

```ts
const broadcastToBoards = async (event: string, payload: object) => {
  // canal: 'boards' — eventos para la pantalla de lista (ej: 'board-created')
};

const broadcastToBoard = async (boardId: string, event: string, payload: object) => {
  // canal: `boards:${boardId}` — eventos para la pantalla de detalle de ESE board
  // (ej: 'ticket-updated', 'board-deleted')
};
```

Llámenlas desde los services existentes, después de escribir en la base de
datos (no antes). En el client, usen `supabase.channel(name)` con
`.on('broadcast', { event }, ...)` y `.subscribe()` para escuchar esos mismos
eventos desde `BoardsContext` (canal `'boards'`) y `BoardContext` (canal
`` `boards:${boardId}` ``).
