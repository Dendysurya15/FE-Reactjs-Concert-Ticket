# FE ReactJS Web Concert Booking System

This project uses one of the Javascript libraries, ReactJS. This application has two roles, namely Admin and User. The function is of course to add and update the list of the latest concerts that will come. As for the User, booking simply logs into the system and orders concert tickets. This web is not integrated with any payment system.

This application has the following features.

- Authentication with Token
- Adding a new user with Register
- Booking concert tickets with the role “User”
- Can see the history per user of tickets that have been booked
- Create and update data from users with the role “Admin”

## Installation

There are several stages of installation for this project as follows

1. Run the following command to run the service from react js. The web can already be used to make ticket bookings

```bash
npm run dev
```

## Usage of Web Concert Booking System

### Admin Role

1. Register new users and make edits to one of the u's directly through the mysql database in phpmyadmin, by changing the role to "Admin".

2. Log in as the "Admin" role to add a new concert creation at the following link.

```bash
http://localhost:5173/dashboard/concerts/create
```

3. If there is an error, you can edit the concert at the following link by clicking the edit button

```bash
http://localhost:5173/dashboard/concerts
```

4. Admin can see the history of someone who booked a ticket by pressing the history menu

```bash
http://localhost:5173/dashboard/bookings
```
