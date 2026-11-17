<<<<<<< HEAD
# Inventory and Data Management System

A REST API built with Node.js, Express.js, MongoDB and Mongoose to manage a product catalogue.

## Setup
1. `npm install`
2. Create a `.env` file:
   ```
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/inventory_db
   ```
3. `node server.js`

## API Endpoints
| Method | URL | Purpose |
|---|---|---|
| POST | /api/products | Create product |
| GET | /api/products | List with filter, sort, pagination |
| GET | /api/products/:id | Get single product |
| PUT | /api/products/:id | Update product |
| PATCH | /api/products/:id/stock | Restock or sale |
| DELETE | /api/products/:id | Delete product |
| GET | /api/products/low-stock | Low-stock report |
| GET | /api/products/summary | Category-wise summary |

## Postman Screenshots

### Create Product (POST)
![Create](screenshots/create.png)

### Get All Products (GET)
![Get All](screenshots/get-all.png)

### Get Single Product (GET)
![Get Single](screenshots/get-single.png)

### Update Product (PUT)
![Update](screenshots/update.png)

### Stock Adjustment (PATCH)
![Stock](screenshots/stock-patch.png)

### Low-Stock Report (GET)
![Low Stock](screenshots/low-stock.png)

### Category Summary (GET)
![Summary](screenshots/summary.png)
=======
# WEB-DEVELOPMENT-ASSIGNMENT-3
>>>>>>> d5155380773e81941d3ac3390a38c2d8992f9f94
