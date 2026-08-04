# ⚙️ GearUp - Camera & Event Gear Rental Platform (Backend API)

**GearUp** is a robust, secure, and scalable RESTful API backend designed for a multi-role gear rental platform. It enables customers to rent high-end photography, video, and event equipment, allows equipment providers to manage their rental inventory, and gives administrators complete oversight of operations and transactions.

---

## 🔗 Live Links & Deployment

* **Backend Live API:** [https://your-backend.vercel.app](https://your-backend.vercel.app)
* **Postman Collection:** [Postman Collection](https://www.postman.com/tanviralaminhossain-9455647/workspace/gear-items-all-api/collection/56971360-619dbf70-ce6a-4cd0-840e-4bcd545d5b2e?action=share&creator=56971360)
---
## 🌟 Key Features

* **Multi-Role Access Control (RBAC):** Distinct permissions and protected routes for `Customer`, `Provider`, and `Admin`.
* **SSLCommerz Payment Gateway:** Complete integration supporting sandbox/live sessions, instant callback handling (`val_id`), and validation.
* **ACID Database Transactions:** Financial state and order status synchronization using Prisma `$transaction` for zero data inconsistency.
* **Zod Input Validation:** Strict runtime type safety and body payload validation for all API requests.
* **Global Error Handling:** Centralized error management returning standard JSON response structures with explicit HTTP status codes.
* **JWT Authentication:** Secure token-based authentication and route authorization middlewares.

---

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Language:** TypeScript
* **Database:** PostgreSQL
* **ORM:** Prisma ORM
* **Validation:** Zod
* **Payment Integration:** SSLCommerz (`sslcommerz-lts`)
* **Deployment:** Vercel (Serverless Functions)

---

## 📁 Project Architecture

The project follows a modular and scalable structure for clean code organization: