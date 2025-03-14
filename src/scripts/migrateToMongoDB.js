// This script migrates data from static JS files to MongoDB
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

// Load environment variables
dotenv.config();

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import models
import SiteContent from '../models/SiteContent.js';
import TechelonsData from '../models/TechelonsData.js';

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable');
  process.exit(1);
}

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

// Read site content data
async function readSiteContentData() {
  try {
    const filePath = path.join(__dirname, '..', 'app', '_data', 'siteContent.js');
    const fileContent = await fs.readFile(filePath, 'utf8');
    
    // Extract the JSON object from the file
    const jsonStr = fileContent.substring(
      fileContent.indexOf('const siteContent = ') + 'const siteContent = '.length,
      fileContent.lastIndexOf('export default')
    ).trim();
    
    // Remove the semicolon at the end if it exists
    const cleanJsonStr = jsonStr.endsWith(';') ? jsonStr.slice(0, -1) : jsonStr;
    
    // Parse the JSON
    return JSON.parse(cleanJsonStr);
  } catch (error) {
    console.error('Error reading site content data:', error);
    return null;
  }
}

// Read Techelons data
async function readTechelonsData() {
  try {
    const filePath = path.join(__dirname, '..', 'app', '_data', 'techelonsData.js');
    const fileContent = await fs.readFile(filePath, 'utf8');
    
    // Extract the different parts of the file
    const festInfoMatch = fileContent.match(/const festInfo = ([\s\S]*?);/);
    const eventCategoriesMatch = fileContent.match(/const eventCategories = ([\s\S]*?);/);
    const registrationStatusMatch = fileContent.match(/const registrationStatus = ([\s\S]*?);/);
    const festDaysMatch = fileContent.match(/const festDays = ([\s\S]*?);/);
    const eventImagesMatch = fileContent.match(/const EVENT_IMAGES = ([\s\S]*?);/);
    const whatsappGroupsMatch = fileContent.match(/const whatsappGroups = ([\s\S]*?);/);
    const eventsMatch = fileContent.match(/const events = ([\s\S]*?);/);
    const uiContentMatch = fileContent.match(/const uiContent = ([\s\S]*?);/);
    
    // Parse the JSON for each part
    const festInfo = festInfoMatch ? JSON.parse(festInfoMatch[1]) : {};
    const eventCategories = eventCategoriesMatch ? JSON.parse(eventCategoriesMatch[1]) : {};
    const registrationStatus = registrationStatusMatch ? JSON.parse(registrationStatusMatch[1]) : {};
    const festDays = festDaysMatch ? JSON.parse(festDaysMatch[1]) : {};
    const eventImages = eventImagesMatch ? JSON.parse(eventImagesMatch[1]) : {};
    const whatsappGroups = whatsappGroupsMatch ? JSON.parse(whatsappGroupsMatch[1]) : {};
    const events = eventsMatch ? JSON.parse(eventsMatch[1]) : [];
    const uiContent = uiContentMatch ? JSON.parse(uiContentMatch[1]) : null;
    
    return {
      festInfo,
      eventCategories,
      registrationStatus,
      festDays,
      eventImages,
      whatsappGroups,
      events,
      uiContent
    };
  } catch (error) {
    console.error('Error reading Techelons data:', error);
    return null;
  }
}

// Flush existing data and migrate site content to MongoDB
async function migrateSiteContent(data) {
  try {
    // Delete all existing documents
    console.log('Deleting existing site content...');
    await SiteContent.deleteMany({});
    
    // Create new document
    console.log('Creating new site content in MongoDB...');
    await SiteContent.create(data);
    
    console.log('Site content migration completed successfully');
  } catch (error) {
    console.error('Error migrating site content:', error);
  }
}

// Flush existing data and migrate Techelons data to MongoDB
async function migrateTechelonsData(data) {
  try {
    // Delete all existing documents
    console.log('Deleting existing Techelons data...');
    await TechelonsData.deleteMany({});
    
    // Create new document
    console.log('Creating new Techelons data in MongoDB...');
    await TechelonsData.create(data);
    
    console.log('Techelons data migration completed successfully');
  } catch (error) {
    console.error('Error migrating Techelons data:', error);
  }
}

// Main migration function
async function migrateData() {
  try {
    // Connect to MongoDB
    await connectToMongoDB();
    
    // Read and migrate site content
    const siteContentData = await readSiteContentData();
    if (siteContentData) {
      await migrateSiteContent(siteContentData);
    }
    
    // Read and migrate Techelons data
    const techelonsData = await readTechelonsData();
    if (techelonsData) {
      await migrateTechelonsData(techelonsData);
    }
    
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

// Run the migration
migrateData(); 