# Invoicing - web
Here i recreate my "Invoicing" app that i made in C#, in a web variant.
# Features
- Consists of 5 tabs
    - "New Invoice" - this tab serves 3 purposes - it can add a new invoice to the database, open up a preview of how the invoice would look like and open up a print dialog from which the user can decide if he wants to print the invoice or save it as a pdf.
    - "Invoices" - this tab consists of 2 tables, the first one shows all the invoices in the database. When a user clicks on a cell the second table is filled in with the selected invoice's details.
    - "Products" - in this tab the user can add a new product to the database.
    - "Customers" - here the user can add a new customer to the database.
    - "Firms" - here the user can a new firm to the database.
# Quickstart
- When you download the project there are a couple things you need to do in order to get it working.
    1. Upload the project's contents to your web server, if you wish to explore the project locally you can use [xampp](https://www.apachefriends.org/index.html) (that's what I used when developing the project).
    2. Import the "db.sql" schema to a MySQL database.
    3. Rename the "connection-example.ini" file to "connection.ini". This file contains the credentials you need in order to access and use your database.
    4. Fill in all the fields in the "connection.ini" file.
