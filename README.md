# UCSB Software License System Project

Project Starter Code: https://github.com/ucsb-cs156-m23/proj-happycows-m23-10am-3

<img width="1420" alt="UCSB Software Licensing Webpage Home" src="https://github.com/Edwin-Yee/Software-Licensing-System/assets/91923759/17b9210a-1b9d-43d2-8d54-730cce855133">
<img width="1420" alt="UCSB Software Licensing Webpage Database" src="https://github.com/Edwin-Yee/Software-Licensing-System/assets/91923759/ed7686c6-e281-4178-801c-f2989faf9c5c">
<img width="1420" alt="UCSB Software Licensing Webpage Form" src="https://github.com/Edwin-Yee/Software-Licensing-System/assets/91923759/0fd42fb9-65ef-4755-90e4-7c77df919b6e">

Deployments:

# Versions
* Java: 17
* node: 20.5.1 
See [docs/versions.md](docs/versions.md) for more information on upgrading versions.

# Overview of application

When complete, this application will have the following features:

* For users that are not logged in, no features are available. Users will be presented with a login request screen.
* For users that are logged in, but are not admins, limited features are available. Users will be able to request licenses on the software licenses page but will not be able to view the database table "index" page.  
* For users that are logged in as admins, they will have access to all features including the ability to request licenses on the software licenses page and view the database table "index" page. Admin users will see a button on the index page that takes them to a page where they can create a new record in the database.  That page, when the user successfully creates a record, or cancels creating a record,should navigate back to the index page.
* The Edit button, for admins, will navigate to a page where the database record can be edited. After a successful edit, the page will navigate back to the index page.
* The Delete button, for admins, will make the api call to delete the row, and then navigate back to the index page.

# Setup before running application

Before running the application for the first time,
you need to do the steps documented in [`docs/oauth.md`](docs/oauth.md).

Otherwise, when you try to login for the first time, you 
will likely see an error such as:

<img src="https://user-images.githubusercontent.com/1119017/149858436-c9baa238-a4f7-4c52-b995-0ed8bee97487.png" alt="Authorization Error; Error 401: invalid_client; The OAuth client was not found." width="400"/>

# Getting Started on localhost

* Ensure that Java and Maven are installed locally by running
```
java --version
mvn --v
```

* Step by step tutorial to install Java on Mac: https://www.youtube.com/watch?v=PQk9O03cukQ
* Step by step tutorial to install Maven on Mac: https://www.youtube.com/watch?v=QhmE2Vzxk5g

* Open *two separate terminal windows*
* Ensure that you are in the folder "Software-Licensing-System" before proceding to the next stpes.
* In the first window, start up the backend with:
  ``` 
  mvn spring-boot:run
  ```
* In the second window:
  ```
  cd frontend
  npm install  # only on first run or when dependencies change
  npm start
  ```

Then, the app should be available on <http://localhost:8080>

If it doesn't work at first, e.g. you have a blank page on  <http://localhost:8080>, give it a minute and a few page refreshes.  Sometimes it takes a moment for everything to settle in.

If you see the following on localhost, make sure that you also have the frontend code running in a separate window.

```
Failed to connect to the frontend server... On Dokku, be sure that PRODUCTION is defined.  On localhost, open a second terminal window, cd into frontend and type: npm install; npm start";
```

To exit the process, click on the terminal where spring-boot is running and press the keys "control" and "c" at the same time. Then, click on the terminal where npm is running and press the keys "control" and "c" at the same time.

# Running the npm test suite
Open a terminal window
  ```
  cd frontend
  npm test
  ```

# Getting Started on Dokku

See: [/docs/dokku.md](/docs/dokku.md)

# Accessing swagger

To access the swagger API endpoints, use:

* <http://localhost:8080/swagger-ui/index.html>

Or add `/swagger-ui/index.html` to the URL of your dokku deployment.

# To run React Storybook

* cd into frontend
* use: npm run storybook
* This should put the storybook on http://localhost:6006
* Additional stories are added under frontend/src/stories

* For documentation on React Storybook, see: https://storybook.js.org/

# SQL Database access

On localhost:
* The SQL database is an H2 database and the data is stored in a file under `target`
* Each time you do `mvn clean` the database is completely rebuilt from scratch
* You can access the database console via a special route, <http://localhost:8080/h2-console>
* For more info, see [docs/h2-database.md](/docs/h2-database.md)

On Dokku, follow instructions for Dokku databases:
* <https://ucsb-cs156.github.io/topics/dokku/postgres_database.html>
