import express from "express";
import { createDatabase } from './database.js';
import { DeviceService } from "./device/device-service.js";
import { MenuService } from "./menu/menu-service.js";
import { addItemToOrder, computeTotalPrice, replaceItemInOrder, type OpenOrder, type Order, type OrderItem } from "contracts/order";
import { OrderService } from "./order/order-service.js";
import { CheckoutService } from "./checkout/checkout-service.js";

const PORT = process.env.PORT || 3000;

const app = express();
const database = createDatabase();
const deviceService = new DeviceService();
const menuService = new MenuService();
const orderService = new OrderService(database);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

app.get('/status', (_req, res) => {
  const result = database.prepare('SELECT 1 AS ok').get() as { ok: number };

  res.json({ ok: result.ok === 1, database: 'connected' });
});

app.post('/sessions', async (req, res) => {
  const deviceId = req.query.deviceId as string | null;
  if (!deviceId) {
    return res.status(400).json({ error: 'deviceId is required' });
  }

  const storeId = await deviceService.getStoreId(deviceId);
  if (!storeId) {
    return res.status(400).json({ error: 'device is not registered' });
  }

  await orderService.abandonOrderForDevice(deviceId);

  const order = await orderService.createOrder(deviceId, storeId);

  return res.status(201).json({
    order: order,
    menu: await menuService.getMenu(storeId),
  });
});

app.post('/orders/:orderId/items', async (req, res) => {
  const deviceId = req.query.deviceId as string | null;
  if (!deviceId) {
    return res.status(400).json({ error: 'deviceId is required' });
  }

  const storeId = await deviceService.getStoreId(deviceId);
  if (!storeId) {
    return res.status(400).json({ error: 'device is not registered' });
  }

  const order = await orderService.getOpenOrderForDevice(deviceId);
  if (!order) {
    return res.status(404).json({ error: 'open order not found' });
  }

  const product = await menuService.getProductById(storeId, req.body.productId);

  if (!product) {
    return res.status(404).json({ error: 'product not found' });
  }

  const orderToUpdate = computeTotalPrice(addItemToOrder(order, {
    id: `item-${crypto.randomUUID()}`,
    product: product,
    quantity: req.body.quantity,
  }));

  const updatedOrder = await orderService.updateOrder(order.id, orderToUpdate);
  return res.json({ order: updatedOrder });
});

app.put('/orders/:orderId/items/:itemId', async (req, res) => {
  const deviceId = req.query.deviceId as string | null;
  if (!deviceId) {
    return res.status(400).json({ error: 'deviceId is required' });
  }

  const order = await orderService.getOpenOrderForDevice(deviceId);
  if (!order) {
    return res.status(404).json({ error: 'open order not found' });
  }

  const item = order.items.find(i => i.id === req.params.itemId);
  if (!item) {
    return res.status(404).json({ error: 'item not found in order' });
  }

  const orderToUpdate = computeTotalPrice(replaceItemInOrder(order, {
    ...item,
    quantity: req.body.quantity,
  }));

  const updatedOrder = await orderService.updateOrder(order.id, orderToUpdate);
  return res.json({ order: updatedOrder });
});

app.post('/orders/:orderId/checkout', async (req, res) => {
  const deviceId = req.query.deviceId as string | null;
  if (!deviceId) {
    return res.status(400).json({ error: 'deviceId is required' });
  }

  const order = await orderService.getOpenOrderForDevice(deviceId);
  if (!order) {
    return res.status(404).json({ error: 'open order not found' });
  }

  const checkoutService = new CheckoutService();
  const payment = await checkoutService.Checkout(order);

  if (payment.kind === "failure") {
    return res.status(400).json({ error: payment.reason });
  }

  const paidOrder = await orderService.markOrderAsPaid(order, payment);

  return res.json({ order: paidOrder });
});

const server = app.listen(PORT, () =>
  console.log(`API listening on port ${PORT}`));

function shutdown() {
  server.close(() => {
    database.close();
    process.exit(0);
  });
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
