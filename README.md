# JunQi

Web-based realtime JunQi chess platform.

## Installation guide
MySQL or other equavalent database softerware is required to run the server. The following command shows a quick way to create a MySQL database with default values defined in `configs/database.js`. ** Please at least change the username and password when setting up the database. **

```mysql
CREATE junqi_server;
USE junqi_server;
CREATE TABLE users(
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE USER 'junqi_user'@'localhost' IDENTIFIED BY 'user_password';
GRANT ALL PRIVILEGES ON junqi_server.* TO 'junqi_user'@'localhost';
FLUSH PRIVILEGES;
```

After setting up the database, clone and cd into the repository

```
git clone https://github.com/jimzhouzzy/JunQi.git
cd JunQi
```

Then install node dependencies

```
node install
```

Finally start the server

```
node app
```

You can now visit `localhost:8424` on your browser, and the client app should be functioning.
