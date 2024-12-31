const axios = require('axios');
const fs = require('fs');
const path = require('path');
const initData = require('./data.js'); // Import your data file

// Function to download an image from a URL
async function downloadImage(url, filename) {
    try {
        console.log(`Downloading image: ${url}`);
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream', // To handle binary data
        });

        // Define the path to save the image
        const outputPath = path.resolve(__dirname, 'downloads', filename);
        const writer = fs.createWriteStream(outputPath);

        // Pipe the response data to the file
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                console.log(`Downloaded and saved: ${outputPath}`);
                resolve();
            });
            writer.on('error', (err) => {
                console.error(`Error saving the image: ${err}`);
                reject(err);
            });
        });
    } catch (error) {
        console.error(`Error downloading the image from ${url}:`, error.message);
    }
}

// Function to download all images from initData.data
async function downloadAllImages(data) {
    for (const item of data) {
        const title = item.title || "Untitled";
        const url = item.image?.url;
        if (url) {
            const filename = `${title.replace(/\s+/g, '_')}.jpg`; // Create a filename based on the title
            await downloadImage(url, filename);
        } else {
            console.warn(`No URL found for listing: ${title}`);
        }
    }
    console.log('All images processed!');
}

// Ensure the downloads folder exists
if (!fs.existsSync('./downloads')) {
    fs.mkdirSync('./downloads');
}

// Start downloading
downloadAllImages(initData.data);
