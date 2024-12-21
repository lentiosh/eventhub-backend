# EventHub Backend

**EventHub Backend** is the server-side component of the EventHub application, providing robust APIs for user authentication, event management, Google Calendar integration, and more. Built with modern technologies, it ensures secure and efficient handling of all backend operations required by the EventHub frontend.

## Table of Contents

- [EventHub Backend](#eventhub-backend)
  - [Table of Contents](#table-of-contents)
  - [Demo](#demo)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
  - [Environment Variables](#environment-variables)
  - [Deployment](#deployment)
    - [Steps to Deploy](#steps-to-deploy)
  - [Usage](#usage)
  - [API Endpoints](#api-endpoints)
    - [Authentication](#authentication)
    - [Events](#events)
    - [Signups](#signups)
    - [Google Calendar Integration](#google-calendar-integration)
  - [License](#license)
  - [Contact](#contact)

## Demo

[Live Demo](https://5a5aa2a6-9b07-4ae0-ad46-2f500af9ded6.eu-central-1.cloud.genez.io)

## Features

- **User Authentication:** Secure registration and login using email/password and Google OAuth.
- **Event Management:** Create, read, update, and delete events.
- **Google Calendar Integration:** Add events directly to users' Google Calendars.
- **Event Signups:** Allow users to sign up for events.
- **Role-Based Access Control:** Differentiate access levels for regular users and staff.
- **Security Enhancements:** Implemented using Helmet, CORS, and rate limiting.
- **Error Handling:** Comprehensive error handling for robust API responses.

## Technologies Used

- **Node.js:** JavaScript runtime for building the backend.
- **Express.js:** Web framework for handling routing and middleware.
- **Drizzle ORM:** Lightweight ORM for database interactions.
- **PostgreSQL:** Relational database for data storage, hosted on [Neon.tech](https://neon.tech/).
- **Passport.js:** Authentication middleware for Node.js.
- **JWT (jsonwebtoken):** For securing APIs with JSON Web Tokens.
- **bcryptjs:** For hashing user passwords.
- **Google APIs:** For integrating Google Calendar functionalities.
- **Helmet:** For securing HTTP headers.
- **CORS:** To enable Cross-Origin Resource Sharing.
- **Express-Rate-Limit:** To protect against brute-force attacks.
- **Nodemon:** For automatic server restarts during development.
- **dotenv:** For managing environment variables.
- **Genez.io:** Platform used to deploy the backend application.

## Installation

### Prerequisites

- **Node.js** (v14 or later)
- **npm**
- **PostgreSQL** database (hosted on [Neon.tech](https://neon.tech/))
- **Git**

### Steps

1. **Clone the Repository**
   ```bash
   git clone git@github.com:lentiosh/eventhub-backend.git
   cd eventhub-backend
   ```

2. **Install Dependencies**

   Using npm:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the root directory and add the following variables:
   ```env
   PORT=5000
   DATABASE_URL=postgres://user:password@localhost:5432/eventhub
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=1h
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   FRONTEND_URL=http://localhost:5173
   ```
   Replace the placeholder values with your actual configuration details.

4. **Run Database Migrations**

   Ensure that your PostgreSQL database is running and accessible via the DATABASE_URL provided.

   Using drizzle-kit:
   ```bash
    npx drizzle-kit generate
    npx drizzle-kit migrate
    npx drizzle-kit push
    npx drizzle-kit pull
    npx drizzle-kit check
    npx drizzle-kit up
    npx drizzle-kit studio
   ```

5. **Start the Development Server**

   Using npm:
   ```bash
   npm run dev
   ```
   Or using yarn:
   ```bash
   yarn dev
   ```

   The backend server should now be running at http://localhost:5000/.

## Environment Variables

Ensure you have a `.env` file with the following variables:

```env
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/eventhub
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

Replace the placeholder values with your actual configuration details.

## Deployment

The EventHub Backend is deployed using Genez.io. The PostgreSQL database is hosted on Neon.tech.

### Steps to Deploy

1. **Set Up Neon.tech Database**
   - Sign up at Neon.tech and create a new PostgreSQL database.
   - Obtain the DATABASE_URL from Neon.tech and update your .env file accordingly.

2. **Deploy to Genez.io**
   - Create an account on Genez.io if you haven't already.
   - Connect your GitHub repository to Genez.io.
   - Configure the environment variables in Genez.io's dashboard with the same values as in your local .env file.
   - Trigger a deployment from Genez.io. The platform will handle building and deploying your backend application.

3. **Configure Environment Variables on Genez.io**
   - Ensure all necessary environment variables are set in the Genez.io dashboard, matching those in your local .env file.

4. **Access Your Deployed Backend**
   - Once deployed, your backend server will be accessible via the URL provided by Genez.io.

## Usage

## API Endpoints

### Authentication

**Register User**
- URL: `/api/auth/register`
- Method: `POST`
- Body:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecureP@ssw0rd!"
  }
  ```
- Responses:
  - 201 Created: User registered successfully.
  - 400 Bad Request: Validation errors or email already exists.

**Login User**
- URL: `/api/auth/login`
- Method: `POST`
- Body:
  ```json
  {
    "email": "john@example.com",
    "password": "SecureP@ssw0rd!"
  }
  ```
- Responses:
  - 200 OK: Logged in successfully with JWT token.
  - 400 Bad Request: Invalid credentials.

**Google OAuth**
- Initiate OAuth:
  - URL: `/api/auth/google`
  - Method: `GET`
- Callback:
  - URL: `/api/auth/google/callback`
  - Method: `GET`
  - Responses: Redirects to frontend with JWT token.

### Events

**Create Event**
- URL: `/api/events`
- Method: `POST`
- Headers: `Authorization: Bearer <token>`
- Body:
  ```json
  {
    "title": "Tech Conference 2024",
    "description": "A conference about the latest in tech.",
    "date": "2024-05-20T10:00:00Z",
    "location": "Convention Center",
    "img": "https://example.com/image.png"
  }
  ```
- Responses:
  - 201 Created: Event created successfully.
  - 400 Bad Request: Validation errors.

**Get All Events**
- URL: `/api/events`
- Method: `GET`
- Responses:
  - 200 OK: Returns a list of all events.

**Get Event by ID**
- URL: `/api/events/:id`
- Method: `GET`
- Responses:
  - 200 OK: Returns the event details.
  - 404 Not Found: Event not found.

**Update Event**
- URL: `/api/events/:id`
- Method: `PUT`
- Headers: `Authorization: Bearer <token>`
- Body: (Any of the event fields to update)
  ```json
  {
    "title": "Updated Event Title"
  }
  ```
- Responses:
  - 200 OK: Event updated successfully.
  - 400 Bad Request: Validation errors.
  - 404 Not Found: Event not found.

**Delete Event**
- URL: `/api/events/:id`
- Method: `DELETE`
- Headers: `Authorization: Bearer <token>`
- Responses:
  - 200 OK: Event deleted successfully.
  - 404 Not Found: Event not found.

### Signups

**Sign Up for Event**
- URL: `/api/signups`
- Method: `POST`
- Headers: `Authorization: Bearer <token>`
- Body:
  ```json
  {
    "eventId": 1
  }
  ```
- Responses:
  - 201 Created: Successfully signed up for the event.
  - 400 Bad Request: Already signed up or validation errors.
  - 404 Not Found: Event not found.

### Google Calendar Integration

**Add Event to Google Calendar**
- URL: `/api/calendar/add/:eventId`
- Method: `POST`
- Headers: `Authorization: Bearer <token>`
- Responses:
  - 200 OK: Event added to Google Calendar with a link.
  - 400 Bad Request: Google account not linked or event issues.
  - 500 Internal Server Error: Server error.

## License

MIT

## Contact

If you have any questions or suggestions, feel free to reach out:

Email: lentiosechou@gmail.com