# HOW TO USE DB LOADER

### Put the unparsed JSON file in a folder outside of BackEnd with the parseJSON.js file

### Run the file with node parseJSON.js

### Reference the output.json file in src/DatabaseLoader/loadDB.ts as the input source

### Uncomment the loadDb(); function in index.ts and start the application

With the current dataset, it'll take longer than an hour to input the entire database, so for testing adjust the for-loop in loadDB.ts
