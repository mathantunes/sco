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