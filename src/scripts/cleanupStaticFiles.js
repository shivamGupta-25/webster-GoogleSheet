// This script deletes the static data files that are no longer needed
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Files to delete
const filesToDelete = [
  path.join(__dirname, '..', 'app', '_data', 'siteContent.js'),
  path.join(__dirname, '..', 'app', '_data', 'techelonsData.js')
];

// Delete files
async function deleteFiles() {
  try {
    console.log('Deleting static data files...');
    
    for (const file of filesToDelete) {
      try {
        await fs.access(file);
        await fs.unlink(file);
        console.log(`Deleted: ${file}`);
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log(`File not found: ${file}`);
        } else {
          console.error(`Error deleting file ${file}:`, error);
        }
      }
    }
    
    console.log('Cleanup completed successfully');
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
}

// Run the cleanup
deleteFiles(); 