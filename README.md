# FoodShare Community - Server Side

This is the server-side application for the FoodShare Community platform, built with Node.js, Express, and MongoDB. It handles all business logic, database interactions, and API requests for the platform.

**Live API Base URL: [https://food-share-server-one.vercel.app/](https://food-share-server-one.vercel.app/)**

---

## Project Overview

This server provides a RESTful API to support the FoodShare client application. It is responsible for performing CRUD operations on food data and managing food requests. It connects to a MongoDB database to persist all application data.

User authentication is handled securely by leveraging the **Firebase Admin SDK**, which verifies Firebase ID tokens sent from the client to protect private endpoints.

## API Endpoints

The server exposes the following endpoints. Private routes are protected and require a valid Firebase ID token in the `Authorization: Bearer <token>` header.

| Method   | Route                | Description                                                                                              | Access  |
| :------- | :------------------- | :------------------------------------------------------------------------------------------------------- | :------ |
| `GET`    | `/`                  | Root health check route to confirm the server is running.                                                | Public  |
| `POST`   | `/add-food`          | Adds a new food item to the database.                                                                    | Public  |
| `GET`    | `/available-foods`   | Retrieves all foods with status "available". Supports query params: `?search=<term>&sort=<expireDate>`.   | Public  |
| `GET`    | `/food/:id`          | Retrieves details for a single food item by its ID.                                                      | Public  |
| `GET`    | `/featured-foods`    | Retrieves up to 6 available food items, sorted by the highest quantity.                                  | Public  |
| `GET`    | `/manage-foods`      | Retrieves all food items added by the currently logged-in user.                                          | Private |
| `PATCH`  | `/request/:id`       | Marks an existing food item as "requested" by the logged-in user and adds request metadata.              | Private |
| `GET`    | `/my-requests`       | Retrieves all food items that the currently logged-in user has requested.                                | Private |
| `PATCH`  | `/foods/:id`         | Updates the details of a specific food item owned by the user.                                           | Private |
| `DELETE` | `/foods/:id`         | Deletes a specific food item owned by the user.                                                          | Private |

## Technologies & Packages Used

-   **Core**: Node.js, Express.js
-   **Database**: MongoDB (`mongodb` driver)
-   **Authentication**: Firebase Admin SDK (`firebase-admin`)
-   **Middleware & Utilities**:
    -   CORS (`cors`)
    -   Dotenv (`dotenv`)
-   **Development**: Nodemon
-   **Hosted on**: Vercel

## Environment Variables & Setup

To run this project locally, you need to configure both a `.env` file and a Firebase service account key.

#### 1. Environment Variables (`.env` file)

Create a file named `.env` in the root of the server folder with the following variable:

##### MongoDB Connection URI from your MongoDB Atlas dashboard

```
MONGODB_URI="your-mongodb-connection-string"

```

#### 2. Firebase Admin Setup (`admin-key.json`)

This server uses a private key to communicate with Firebase services securely.

1.  Navigate to your **Firebase Project Console**.
2.  Go to **Project Settings** (click the gear icon) > **Service accounts**.
3.  Click the **"Generate new private key"** button. A confirmation popup will appear.
4.  Click **"Generate key"** to download a JSON file.
5.  Rename this downloaded file to `admin-key.json`.
6.  Place the `admin-key.json` file in the **root directory** of this server project.

> **CRITICAL**: You must add `admin-key.json` to your `.gitignore` file to prevent your private key from being exposed on GitHub.
> ##### In the .gitignore file
>
```
node_modules/
.env
*.local
.vercel
admin-key.json

```

## Getting Started

To get a local copy up and running, follow these simple steps.

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/mottasimsadi/food-share-server
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd food-share-server
    ```
3.  **Install NPM packages:**
    ```sh
    npm install
    ```
4.  **Create your `.env` file** and add your MongoDB URI.
5.  **Create your `admin-key.json` file** as described in the setup section above.
6.  **Run the development server:**
    ```sh
    nodemon index.js
    ```
The API server will be running on `http://localhost:3000`.
