# PostgrepProjectFSCourse
# Project Name: **Visited Countries Tracker**

## Description:
This project is a web application built using **Node.js** and **Express.js** to allow users to track countries they have visited. The app uses **PostgreSQL** as its database, stores user information, and keeps a record of the countries each user has visited. The user can add, remove, or clear their list of visited countries, and the app provides a color-coded interface for each user.

## Features:
- **Track Visited Countries**: Add and view countries that a user has visited.
- **User Management**: Add, remove, or switch between users with specific name and color preferences.
- **Country Search**: Search for countries by name using PostgreSQL's `LIKE` functionality.
- **Data Persistence**: User and country data are persisted in a PostgreSQL database.
- **Error Handling**: Handles duplicate entries and invalid inputs, providing feedback to the user.
- **Express Server**: Serves pages and handles requests.

## Installation:
1. Clone this repository to your local machine:
    ```bash
    git clone <repository-url>
    ```
   
2. Navigate into the project directory:
    ```bash
    cd visited-countries-tracker
    ```

3. Install the required dependencies:
    ```bash
    npm install
    ```

4. Set up the PostgreSQL database:
    - Ensure PostgreSQL is installed and running on your machine.
    - Create a database named `world`:
      ```sql
      CREATE DATABASE world;
      ```
    - Create the necessary tables for users and visited countries:
      ```sql
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        color VARCHAR(50)
      );

      CREATE TABLE visited_countries (
        id SERIAL PRIMARY KEY,
        country_code VARCHAR(3),
        user_id INTEGER REFERENCES users(id),
        CONSTRAINT unique_visited_country UNIQUE (country_code, user_id)
      );

      CREATE TABLE countries (
        country_code VARCHAR(3) PRIMARY KEY,
        country_name VARCHAR(100)
      );
      ```
    import to the visited countries the countries csv.

5. Set up the PostgreSQL connection in the code:
    Modify the PostgreSQL credentials in `index.js`:
    ```js
    const db = new pg.Client({
      user: "postgres",
      host: "localhost",
      database: "world",
      password: "your_password",
      port: 5433,
    });
    ```

6. Start the server:
    ```bash
    node index
    ```

7. Open your browser and go to:
    ```
    http://localhost:3000
    ```

## Usage:
### Home Page:
- The home page shows a list of users and their visited countries.
- The countries will be color-coded based on the user's preferred color.
  
### Adding a Country:
- Enter the name of a country and submit it.
- If the country is valid and not already added, it will be added to the user's visited countries list.
  
### Removing a User:
- The current user can be removed from the system, along with their visited countries.
  
### Clearing Visited Countries:
- The current user's list of visited countries can be cleared without deleting the user.

## File Structure:
- `index.js`: Main server and application logic.
- `views/`: EJS templates for rendering the user interface.
- `public/`: Static files such as stylesheets.


## Technologies Used:
- **Node.js**: Backend JavaScript runtime.
- **Express.js**: Framework for building web applications.
- **PostgreSQL**: Relational database used to store users and visited countries.
- **EJS**: Templating engine to render dynamic content on the front end.
- **body-parser**: Middleware to handle form submissions.

## Error Handling:
- **Country Already Exists**: If the user tries to add a country that already exists in their list, they will be prompted with an error message.
- **Invalid Country Name**: If the country does not exist in the database, the user will receive an error message.
- **Empty Inputs**: The app checks for empty input fields and provides feedback if any required fields are missing.

## Contributing:
Feel free to fork this repository and make improvements. Pull requests are welcome!

## License:
This project is open-source under the MIT License.