## Parse to Firebase migration tool

### Description
A simple webapp used to migrate Parse tables to new nodes in a Firebase database.

### Setup
1. From the directory run: `yarn install`.
2. Copy `config_example.json` to `config.json` and configure with environmental variables 
3. From the directory run: `yarn run pack && yarn run server`.
4. The application is now running from `localhost:8080`

### App Instructions
1. Navigate to `localhost:8080`.
2. Login as Firebase user with permission to write to the root node.
3. Simulate to fetch tables from Parse.
4. Migrate to fetch and push. 


