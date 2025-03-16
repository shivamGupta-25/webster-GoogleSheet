# MongoDB Data Migration Guide

This guide explains how to copy your MongoDB database structure and data from this project to a new project.

## Option 1: Using MongoDB Compass (Recommended)

MongoDB Compass is a graphical user interface for MongoDB that makes it easy to export and import data.

### Step 1: Export Data from Current Database

1. Download and install [MongoDB Compass](https://www.mongodb.com/products/compass) if you don't have it already.

2. Open MongoDB Compass and connect to your current database using the connection string from your `.env` file.

3. Navigate to your database in the left sidebar.

4. For each collection you want to export:
   - Click on the collection name
   - Click the "Export Collection" button (looks like a download icon)
   - Choose "JSON" as the export format
   - Select a location to save the file
   - Click "Export"

5. Repeat for all collections: `SiteContent`, `TechelonsData`, `TechelonsRegistration`, `WorkshopRegistration`, and `FileUpload`.

### Step 2: Set Up Your New Project

1. Copy the following files to your new project:
   - All model files from `src/models/`
   - The MongoDB connection file `src/lib/mongodb.js`

2. Make sure your new project has the same dependencies installed:
   ```bash
   npm install mongoose dotenv
   ```

3. Create a `.env` file in your new project with the `MONGODB_URI` for your new database.

### Step 3: Import Data to New Database

1. Open MongoDB Compass and connect to your new database using the connection string from your new project's `.env` file.

2. For each collection you want to import:
   - Click on the database name in the left sidebar
   - Click "Create Collection" if the collection doesn't exist yet
   - Enter the collection name (e.g., `SiteContent`) and click "Create"
   - Click on the collection name
   - Click the "Add Data" button and select "Import File"
   - Choose the JSON file you exported earlier
   - Click "Import"

3. Repeat for all collections.

## Option 2: Using mongodump and mongorestore (For Advanced Users)

If you have the MongoDB Database Tools installed, you can use the command-line tools.

### Step 1: Install MongoDB Database Tools

Download and install the [MongoDB Database Tools](https://www.mongodb.com/try/download/database-tools) for your operating system.

### Step 2: Export Data Using mongodump

```bash
mongodump --uri="YOUR_MONGODB_URI" --out=./mongodb-backup
```

Replace `YOUR_MONGODB_URI` with your MongoDB connection string from the `.env` file.

### Step 3: Import Data Using mongorestore

In your new project:

```bash
mongorestore --uri="YOUR_NEW_MONGODB_URI" --dir=./mongodb-backup
```

Replace `YOUR_NEW_MONGODB_URI` with your new MongoDB connection string.

## Notes

- Make sure your new project has the same MongoDB schema structure as the original project.
- If you've made schema changes in your new project, you may need to modify the exported data before importing.
- For large databases, the export/import process may take some time to complete.
- The `FileUpload` collection contains binary data, which MongoDB Compass handles correctly during export/import. 