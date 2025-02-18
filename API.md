
# Start the NestJS server:

```npm run start:dev```
Your REST API will be available on http://localhost:3000 and your Telegram bot will be running (make sure your bot token is valid).

# Testing the Telegram Bot:

Open Telegram and search for your bot (by its username).
Send /start to receive the welcome message.
Try /getbyid 12345 or /getbyphone 5551234567 (replace with actual data from your database).


# Using REST Endpoints:


# Create a patient:
POST http://localhost:3000/patients
Content-Type: application/json

{
  "openmrsId": "12345",
  "phone": "5551234567",
  "testResults": "Blood test: All normal"
}

# Update test results:
PATCH http://localhost:3000/patients/1
Content-Type: application/json

{
  "testResults": "Updated test results details"
}

# Query patient data:
GET endpoints are also provided to retrieve patient info.


# Database Setup
Initialize your Prisma schema:
```npx prisma migrate dev --name init```

(Optional) Seed your database if you add a seed script:
```npx prisma db seed```
    Start the NestJS Application:
```npm run start:dev```























Testing REST Endpoints:

User Registration:
POST http://localhost:3000/users/register
Content-Type: application/json

{
  "openmrsId": "12345",    // if you decide to include this in your DTO
  "phone": "5551234567",
  "testResults": "Blood test: Normal",
  "email": "patient@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
User Login:
POST http://localhost:3000/users/login
Content-Type: application/json

{
  "email": "patient@example.com",
  "password": "securepassword"
}
Update Test Results (triggered by lab/doctor):
PATCH http://localhost:3000/patients/1
Content-Type: application/json

{
  "testResults": "Updated: Cholesterol level high"
}
Query Patient Data (for debugging via REST):
GET http://localhost:3000/patients/by-openmrs/12345
Telegram Bot Testing
Telegram Bot Setup:

Make sure you’ve set your TELEGRAM_BOT_TOKEN in your .env file.
Launch your server so that the bot module (using Telegraf) is started along with the API.
Interacting via Telegram:

Open Telegram and search for your bot (by its username).
Send /start to get the welcome message.
Test retrieval commands:
/getbyid 12345 to see test results by OpenMRS ID.
/getbyphone 5551234567 to see test results by phone number.
Simulating Lab/Doctor Updates:

When a test result is ready, call the appropriate REST endpoint (or integrate a secure webhook) so that the patient’s record is updated in the database.
Optionally, extend your Telegram service to notify the patient immediately by sending them a message.
