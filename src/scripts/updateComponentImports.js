// This script updates all components that are still importing the static data files
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..', '..');

// Files to update
async function findFilesToUpdate() {
  const siteContentImports = await glob('src/**/*.{js,jsx,ts,tsx}', {
    cwd: rootDir,
    ignore: ['**/node_modules/**', '**/scripts/**']
  });

  const filesToCheck = await Promise.all(
    siteContentImports.map(async (file) => {
      const filePath = path.join(rootDir, file);
      const content = await fs.readFile(filePath, 'utf8');
      
      const hasSiteContentImport = content.includes("import siteContent from '@/app/_data/siteContent'") || 
                                  content.includes("import siteContent from \"@/app/_data/siteContent\"");
      
      const hasTechelonsDataImport = content.includes("import") && 
                                    content.includes("from '@/app/_data/techelonsData'") || 
                                    content.includes("from \"@/app/_data/techelonsData\"");
      
      if (hasSiteContentImport || hasTechelonsDataImport) {
        return {
          path: filePath,
          hasSiteContentImport,
          hasTechelonsDataImport
        };
      }
      
      return null;
    })
  );

  return filesToCheck.filter(Boolean);
}

// Update files
async function updateFiles(files) {
  for (const file of files) {
    try {
      console.log(`Updating file: ${file.path}`);
      let content = await fs.readFile(file.path, 'utf8');
      
      // Replace site content import
      if (file.hasSiteContentImport) {
        // Check if the file already imports from utils
        if (content.includes("import { fetchSiteContent }")) {
          content = content.replace(
            /import siteContent from ['"]@\/app\/_data\/siteContent['"];?/g,
            ''
          );
        } else {
          content = content.replace(
            /import siteContent from ['"]@\/app\/_data\/siteContent['"];?/g,
            "import { fetchSiteContent } from '@/lib/utils';"
          );
        }
        
        // Add a note for manual review
        content = `// NOTE: This file was automatically updated to use fetchSiteContent instead of importing siteContent directly.
// Please review and update the component to use the async fetchSiteContent function.
${content}`;
      }
      
      // Replace techelons data import
      if (file.hasTechelonsDataImport) {
        // Check if the file already imports from utils
        if (content.includes("import { fetchTechelonsData }")) {
          content = content.replace(
            /import .*? from ['"]@\/app\/_data\/techelonsData['"];?/g,
            ''
          );
        } else {
          content = content.replace(
            /import (.*?) from ['"]@\/app\/_data\/techelonsData['"];?/g,
            "import { fetchTechelonsData } from '@/lib/utils'; // NOTE: You need to update this component to use the async fetchTechelonsData function"
          );
        }
        
        // Add a note for manual review
        content = `// NOTE: This file was automatically updated to use fetchTechelonsData instead of importing from techelonsData directly.
// Please review and update the component to use the async fetchTechelonsData function.
${content}`;
      }
      
      await fs.writeFile(file.path, content, 'utf8');
      console.log(`Updated: ${file.path}`);
    } catch (error) {
      console.error(`Error updating file ${file.path}:`, error);
    }
  }
}

// Main function
async function main() {
  try {
    console.log('Finding files to update...');
    const files = await findFilesToUpdate();
    console.log(`Found ${files.length} files to update`);
    
    if (files.length > 0) {
      console.log('Updating files...');
      await updateFiles(files);
      console.log('Files updated successfully');
      
      // Print list of updated files for manual review
      console.log('\nThe following files were updated and need manual review:');
      files.forEach(file => {
        console.log(`- ${path.relative(rootDir, file.path)}`);
      });
    } else {
      console.log('No files to update');
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
main(); 