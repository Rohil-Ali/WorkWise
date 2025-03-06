Please read to set up the project properly

When you clone the project to your local device it will not run because it is missing the .env file and vendor folder and a few extra dependencies. this is becasue github doesnt let me save them files and folders here due to security as they contain server information and passwords etc. 

So you need to create the .env file and vendor folder yourself.

Follow these steps:


FOR THE .ENV FILE:


first create a file in the project called .env then copy and paste the content in .env.example to .env.
Then on line 23 where it says DB_CONNECTION replace that section with this:

DB_CONNECTION=mysql

DB_HOST=127.0.0.1

DB_PORT=3306

DB_DATABASE=workwise_db

DB_USERNAME=workwise

DB_PASSWORD=pass

THEN RUN THE COMMAND - php artisan key:generate




FOR THE VENDOR FOLDER:


just run the command - composer install



OTHER DEPENDICIES:

run these commands:

npm install

npm run build

npm run dev - this should start vite (run react)



AND DONE EVERYTHING SHOULD JUST BE RUNNING. 
