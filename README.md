# Product-Feedback-Tool
Product Feedback Tool - Interview Assessment
Overview
This folder contains my solution to the Interview Assessment for implementing a feedback application with various features. The application is built using React.js and Material UI for the frontend, Node.js and Express for the backend, and SQL with sql2 library for the database. JWT authentication is utilized for secure user authentication, and bcrypt is used for password hashing. The backend incorporates routes such as sign in, sign out, getFeedbacks, postComments, getComments, and postFeedbacks, each corresponding to tables like users, auth_tokens, feedback, and comments in the SQL database.
Technical Requirements
Frontend - React.js and Material UI
User Authentication
1.	Implementation: User authentication has been implemented using JWT for token generation and validation on the backend, integrated with React.js on the frontend.
2.	User Actions:
•	Users can register, log in, and log out seamlessly.
Feedback Submission
1.	User-Friendly Form:
•	A user-friendly form has been created to facilitate the submission of feedback.
2.	Feedback Details:
•	Feedback includes a title, description, and category (e.g., bug report, feature request, improvement, etc.).
3.	Validation:
•	Implemented validation to ensure that all required fields are filled out before submitting feedback.
Feedback Listing
1.	Paginated List:
•	Feedback items are displayed in a paginated list for better user experience.
2.	Item Display:
•	Each feedback item showcases its title, category, and the user who submitted it.
Commenting System
1.	User Interaction:
•	Users can leave comments on feedback items, promoting active engagement.
2.	Comment Details:
•	Comments display the user's name, date, and content.
Backend - Node.js, Express, SQL, sql2, JWT Authentication, Joi, Bcrypt
1.	Authentication:
•	JWT authentication has been implemented for secure user authentication and token generation.
2.	Routes:
•	Backend routes include sign in, sign out, getFeedbacks, postComments, getComments, and postFeedbacks, each corresponding to the database tables.
3.	Database:
•	SQL database is used with the sql2 library for efficient query execution.
4.	Tables:
•	Tables include users, auth_tokens, feedback, and comments, each with proper schemas.
5.	Validation:
•	Utilized Joi validation for ensuring the integrity of the data received from the frontend.
6.	Password Hashing:
•	Passwords are securely hashed using the bcrypt algorithm for enhanced security.
Technologies Used
•	Frontend: React.js, Material UI
•	Backend: Node.js, Express, SQL, sql2, JWT Authentication, Joi, Bcrypt
•	Additional dependencies as specified in the project files.
Installation
1.	Navigate to the project folder: cd feedback-app
2.	Install frontend dependencies: npm install
3.	Install backend dependencies (navigate to the backend folder): cd backend && npm install
4.	Set up the .env file:
•	In the backend folder, provided a .env file :
 
Replace your_db_user, your_db_password, your_db_name, and your_jwt_secret with your actual database credentials and JWT secret.
5.	Run the SQL queries to create the required tables. SQL queries can be found in the Database Query Folder.
6.	Run the backend server: npm run dev
7.	Run the frontend application: npm start
Provided Files
1.	.env file: The .env file is crucial for configuring environmental variables for the backend.
2.	Postman Collections: The Postman collections are provided in the postman-collections folder. Import these collections into Postman for testing the API endpoints.
3.	SQL Queries:
•	SQL queries to create the required tables are available in the sql-queries folder. Execute these queries in your SQL database to set up the necessary tables.
