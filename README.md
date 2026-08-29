# Web Checkout

Build a small self-service checkout web app for a snack bar. Picture the setting: a customer walks
up to a tablet mounted at the counter, browses the menu, builds an order, pays, and walks away.
No cashier, just them and the screen. A client app talking to a web API.
That's the whole spec. We've kept it deliberately short. The interesting decisions are yours to make,
and how you make them is most of what we're evaluating.

## Assumptions

* The snack bar does not sell any items that need to be prepared and have wait time. The customer can just grab the snacks from a shelf and go.

## Out of scope deliberately

* Authentication - the applications communicate locally and the client only provides an ID to the API. There is no further verification
* Publishing transactions for reconciliation by another system
* Database migrations

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

## Running the app

From root, `pnpm dev` launches both client and api

## API Routes

The API is designed around a self-service checkout session associated with a physical device. The device identifies the store and the currently active order.

### `POST /sessions`

Starts a new checkout session for a device.

**Query parameters**

* `deviceId` — required

**Behaviour**

1. Validate that the device is registered to a store. If not, return `400 Bad Request`.
2. Check whether the device has an existing open session.
3. If an open session exists, abandon it.
4. Create a new open session with an empty order.
5. Return the newly created order and the store menu.

**Response**

```json
{
  "order": {},
  "menu": {}
}
```

---

### `POST /orders/{orderId}/items`

Adds an item to the current order.

**Query parameters**

* `deviceId` — required

**Request**

```json
{
  "productId": "coke",
  "quantity": 1
}
```

**Behaviour**

1. Validate the device.
2. Load the open order associated with the device.
3. If the item already exists, increment its quantity.
4. Otherwise, add it to the order.
5. Persist the updated order.

**Response**

```json
{
  "order": {}
}
```

---

### `PUT /orders/{orderId}/items/{itemId}`

Sets the quantity of an existing order item.

**Query parameters**

* `deviceId` — required

**Request**

```json
{
  "quantity": 3
}
```

A quantity of `0` removes the item from the order.

**Response**

```json
{
  "order": {}
}
```

---

### `POST /orders/{orderId}/checkout`

Completes payment for an open order.

**Query parameters**

* `deviceId` — required

**Behaviour**

1. Validate the device and associated store.
2. Validate that the order belongs to the device and is open.
3. Simulate payment processing.
4. Generate a transaction ID after a short delay.
5. Mark the order as paid and persist the transaction ID.
6. Return the paid order.

**Response**

```json
{
  "order": {}
}
```

The returned order has a `paid` status and contains the generated transaction ID.

---

## Order lifecycle

```text
OPEN
 │
 ├── add/update items
 │
 ▼
OPEN
 │
 ├── checkout
 │
 ▼
PAID
```

An abandoned session results in its order being marked as `ABANDONED`.

```text
OPEN ──► ABANDONED
```

## Frontend Flow

The self-checkout client is designed as a simple, touch-first kiosk experience.

### Idle

When the application loads, it starts in an **idle** state and displays a prominent **“Tap to start”** action.

### Start Session

When the customer taps to start:

1. The client calls the API to create a new checkout session for the device.
2. Once the session and initial menu are returned, the client transitions to the ordering screen.

### Ordering

The ordering screen is split into two areas:

* **Menu:** displayed vertically on the left, grouped by category.
* **Order:** displayed on the right and initially empty.

The bottom of the order area displays the current total and a **“Proceed to pay”** button. The button remains disabled while the order is empty.

The customer can select a category to display its available products. When a product is selected:

1. The client sends a request to add the product to the current order.
2. The API returns the updated order.
3. The client replaces its local order state with the returned order.
4. The updated order and total are rendered.
5. The **“Proceed to pay”** button becomes enabled.

Each order item provides controls to increase or decrease its quantity. Quantity changes are sent to the API through the order-item update endpoint, and the returned order becomes the new client state.

### Checkout

When the customer taps **“Proceed to pay”**:

1. The client calls the checkout API.
2. A payment overlay is displayed instructing the customer to **continue on the payment terminal**.
3. The client waits for the checkout response while keeping the payment overlay visible.

#### Successful payment

Once the API confirms payment:

* The overlay is replaced by a success message.
* The customer sees confirmation that the order was successfully paid.
* After 5 seconds, the application returns to the idle screen for the next customer.

#### Failed payment

If the checkout fails:

* The overlay displays an error message.
* The customer can either **try again** or **cancel**.
* Retrying initiates the checkout flow again.
* Cancelling returns the customer to the ordering screen without completing the order.
