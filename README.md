# Web Checkout

Build a small self-service checkout web app for a snack bar. Picture the setting: a customer walks
up to a tablet mounted at the counter, browses the menu, builds an order, pays, and walks away.
No cashier, just them and the screen. A client app talking to a web API.
That's the whole spec. We've kept it deliberately short. The interesting decisions are yours to make,
and how you make them is most of what we're evaluating.

## How It Was Built

I treated the API as the source of truth and kept the client focused on the kiosk experience.
The server owns the orders, validates products against the store menu, calculates totals, and persists the
order lifecycle and payment record in SQLite.
The client uses a small session provider to request actions and replace its local view with the API response. The server always replies with a new Order so the client can easily re-render it.

I defined the shared domain contracts before building the API and UI, then used the pnpm workspace to keep
both sides aligned. I kept the implementation intentionally small: in-memory device and menu data, a
file-backed SQLite database, synchronous payment simulation, and no authentication or migration framework.

## Running the app

* Make sure you have [pnpm](https://pnpm.io/installation#prerequisites) installed.

From root, install dependencies with `pnpm i`.

From root, `pnpm dev` launches both client and api. (see root package.json)

* Server on http://localhost:3000
* Client on http://localhost:5173
    * Use a deviceId query parameter to switch between devices (e.g. /?deviceId=device1 or device2, each wired to a different store/menu)
* SQLite db file on /api/data/snack-bar.db (automatically created with the required tables)

## Assumptions

* The snack bar does not sell any items that need to be prepared and have wait time. The customer can just grab the snacks from a shelf and go.
* The client does not support offline capabilities. It acts as a thin layer for the session only. All data is mutated and persisted by the API only.
* Responsive components but mainly optimized for "tablet" dimensions (e.g. iPad Mini)
* The system can synchronously wait for the user - terminal interaction and continue with the checkout once it receives a response from the payment system.

## Out of scope deliberately

* Concurrent update issues: The database (SQLite) used in this PoC does not support row-level locking to enforce one-at-a-time updates to ensure Order updates are not executed in parallel. Other solutions could be considered such as distributed lock or optimistic version check
* Authentication - the applications communicate locally and the client only provides an ID to the API. There is no further verification
* Publishing transactions for reconciliation by another system
* Database migrations
* Automated testing
* API input validation (e.g Zod could be used)
* Automatic reset of session started but never finished
* Inventory tracking
* Taxes, discounts, promotions
* Multi-currency
* Multi-language support
* Refunds and credit operations (from the terminal)
* Receipts

## Use of AI

I used AI for a few things in the project as a tool to speed up development:

* After I defined the domain types, AI generated the necessary tables and SQL commands. Fine tuning was still needed.
* After I sketched it, AI wrote the api specs nicely formatted. Same for the client specs.
* Dummy data generation for menus.
* Logo for the snack bar.

## Project structure

### Workspace

* pnpm workspace for sharing types between client and api

### Client

* React app
* Vite
* Tailwind
* Typescript

### Api

* Express
* Typescript
* Sqlite

## API Routes

The checkout API is device-centric. A device is registered to a store and may have at most one active checkout session at a time.

Orders cannot be manipulated directly by their ID. All order mutations are performed through the device's currently open order. This prevents a client from modifying another order simply by knowing or guessing its ID.

### What I discarded

I initially modeled order mutations as resource-based APIs, passing an `orderId` to each endpoint. I
replaced that with device-owned APIs: the device identifies its registered store, and the API resolves
the device's single open order. This better matches the kiosk workflow and avoids allowing a client to
modify an arbitrary order from the order ID.

### `POST /sessions`

Starts a new checkout session for a device.

**Query parameters**

* `deviceId` — required

**Behaviour**

1. Validate that the device is registered to a store. If not, return `400 Bad Request`.
2. Check whether the device has an existing open session.
3. If an open session exists, abandon it.
4. Create a new open order for the device.
5. Return the new order and the store menu.

**Response**

```json
{
  "order": {},
  "menu": {}
}
```

---

### `POST /order/items`

Adds an item to the device's currently open order.

**Query parameters**

* `deviceId` — required

**Request**

```json
{
  "productId": "drink1",
  "quantity": 1
}
```

**Behaviour**

1. Validate the device.
2. Resolve the currently open order for the device.
3. If no open order exists, return `404 Not Found`.
4. Add the item to the order, or increment its existing quantity.
5. Persist and return the updated order.

**Response**

```json
{
  "order": {}
}
```

---

### `PUT /order/items/{itemId}`

Updates the quantity of an item in the device's currently open order.

**Query parameters**

* `deviceId` — required

**Request**

```json
{
  "quantity": 3
}
```

A quantity of `0` removes the item.

**Behaviour**

1. Validate the device.
2. Resolve the currently open order for the device.
3. If no open order exists, return `404 Not Found`.
4. Update the item quantity.
5. Persist and return the updated order.

The `itemId` identifies an item within the device's current order; it does not provide access to arbitrary orders.

**Response**

```json
{
  "order": {}
}
```

---

### `POST /checkout`

Completes payment for the device's currently open order.

**Query parameters**

* `deviceId` — required

**Behaviour**

1. Validate the device and its associated store.
2. Resolve the currently open order for the device.
3. Validate that the order contains at least one item.
4. Simulate payment processing.
5. Generate a transaction ID.
6. Mark the order as paid and persist the transaction ID.
7. Return the paid order.

**Response**

```json
{
  "order": {}
}
```

After successful checkout, the order can no longer be modified through the device endpoints.

---

## Order lifecycle

```text
                 ┌──────────────┐
                 │     OPEN     │
                 └──────┬───────┘
                        │
             ┌──────────┴──────────┐
             │                     │
          checkout              new session
             │                     │
             ▼                     ▼
          PAID                ABANDONED
```

A device can have only one open order at a time.

#### Device/order ownership

The API always resolves the active order through the device:

```text
deviceId
   │
   ▼
registered device
   │
   ▼
active session
   │
   ▼
open order
```

The client does not choose which order to modify. `orderId` is therefore not accepted on order mutation endpoints.

This provides an additional authorization boundary: knowing an order ID alone is insufficient to modify it.


## Frontend Flow

The self-checkout client is designed as a simple, touch-first kiosk experience.

### Idle

When the application loads, it starts in an **idle** state and displays a prominent **“Start shopping”** action.

### Start Session

When the customer taps to start:

1. The client calls the API to create a new checkout session for the device.
2. Once the session and **menu** are returned, the client transitions to the ordering screen.

### Ordering

The ordering screen is split into two areas:

* **Menu:** displayed vertically on the left, grouped by category.
* **Order:** displayed on the right and initially empty.

The bottom of the order area displays the current total and a **“Proceed to payment”** button. The button remains disabled while the order is empty.

The customer can select a category to display its available products. When a product is selected:

1. The client sends a request to add the product to the current order.
2. The API returns the updated order.
3. The client replaces its local order state with the returned order.
4. The updated order and total are rendered.
5. The **“Proceed to payment”** button becomes enabled.

Each order item provides controls to increase or decrease its quantity. Quantity changes are sent to the API through the order-item update endpoint, and the returned order becomes the new client state.

* In case a customer abandons a session before completing the payment, the **Reset** button can clear the local state and start a new session.

### Checkout

When the customer taps **“Proceed to payment”**:

1. The client calls the checkout API.
2. A payment overlay is displayed instructing the customer to **continue on the payment terminal**.
3. The client waits for the checkout response while keeping the payment overlay visible.

#### Successful payment

Once the API confirms payment:

* The overlay is replaced by a success message.
* The customer sees confirmation that the order was successfully paid.
* After 10 seconds, the application returns to the idle screen for the next customer.

#### Failed payment

If the checkout fails:

* The overlay displays an error message.
* The customer can either **try again** or **cancel**.
* Retrying initiates the checkout flow again.
* Cancelling returns the customer to the ordering screen without completing the order.
