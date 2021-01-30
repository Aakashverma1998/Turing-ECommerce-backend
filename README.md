# Turing-ECommerce-backend
In this project, I have made a backend of an e-commerce website using Express framework of NodeJS.I have also used JWT-authentication token to verify the if the customer is valid or not. We have already given the mysql-database in which there are different tables and their data. We've to write different queries for different endpoints to make them working.

Swagger link:(https://backendapi.turing.com/docs/#/)

There is a tshirtshop.sql file already present in the database/ folder. You have to import this file to an empty database. For this, make a new database first, and navigate to the database/ directory and then write the following commands: Import the schema using For checking the data, log into your user, You would be asked for your password. Now, you can use database with all its tables' data.

Export Schema of DB $ mysqldump -u root -p --no-data e_commerce > schema.sql

Import Schema mysql -u <user_name> -p <database_name> < tshirtshop.sql

To use this ecommerce backend You have to Install some important tools using command line : $ sudo apt-get install git $ sudo apt-get install nodejs Clone this app using the command:

$ git clone https://github.com/Aakashverma1998/E-Comerce_backend Steps to use this backend are or to run the Project are ):- $ cd e-commerce_backend/ $ npm init or $ sudo npm install (to install all the dependencies)

Note:- before running the project change sample.env to .env file in the root directory of the project and update the required variables.

$ npm start (:- to run the server. The server will run with auto reloading using nodemon. :-) Note: Check Import Schema section under Important Commands to see how to import the tshirtshop.sql file into your DB.

Run server with Auto Reload:- $ npm start (:- This needs to be run from the root of the project.

Make sure to restart the server after adding the product,customer because the product features loads all the products and customer in memory to load the customer or product. If you don't restart the server, then it will keep on products or customers from the old database memory. You can always kill your running port by writing, $ sudo killall -9 node (:- on the terminal. Now, you need to install postman, that helps you to develop APIs and getting responses from it, by writing the following commands on your terminal.
