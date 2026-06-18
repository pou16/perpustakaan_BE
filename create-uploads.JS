const fs = require('fs');
const path = require('path');

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
const coversDir = path.join(uploadsDir, 'covers');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Uploads directory created');
}

if (!fs.existsSync(coversDir)) {
    fs.mkdirSync(coversDir, { recursive: true });
    console.log('✅ Covers directory created');
}

// Create .gitkeep files
const gitkeepPath = path.join(uploadsDir, '.gitkeep');
if (!fs.existsSync(gitkeepPath)) {
    fs.writeFileSync(gitkeepPath, '');
    console.log('✅ .gitkeep created in uploads');
}

const gitkeepCoverPath = path.join(coversDir, '.gitkeep');
if (!fs.existsSync(gitkeepCoverPath)) {
    fs.writeFileSync(gitkeepCoverPath, '');
    console.log('✅ .gitkeep created in covers');
}

console.log('✅ Upload directories setup complete!');