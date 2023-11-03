const fs = require('fs');
const path = require('path');

// Function to get a list of MP3 and WAV files in a directory
function getMusicFiles(dir) {
    return fs.readdirSync(dir)
        .filter(file => /\.(mp3|wav)$/i.test(file));
}

// Function to create the songData object based on folder contents
function createSongData(rootDir) {
    const songData = {};

    const subfolders = fs.readdirSync(rootDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    for (const folder of subfolders) {
        const albumName = folder;
        const albumDir = path.join(rootDir, folder);
        const musicFiles = getMusicFiles(albumDir);

        if (musicFiles.length > 0) {
            // Construct an array of full file paths for each song in the album
            const songPaths = musicFiles.map(song => path.join(albumDir, song));
            songData[albumName] = songPaths;
        }
    }

    return songData;
}

// Specify the root directory to start scanning for albums
const rootDirectory = 'albums';

// Create the songData object based on folder contents
const songData = createSongData(rootDirectory);

// Generate unique IDs for Play/Pause buttons
const generatedIds = {};
for (const albumName in songData) {
    const albumSongs = songData[albumName];
    generatedIds[albumName] = albumSongs.map((song, index) => {
        return `playPauseBtn_${albumName}_${index}`;
    });
}

// Update the songData with the generated IDs
for (const albumName in songData) {
    const albumSongs = songData[albumName];
    const buttonIds = generatedIds[albumName];

    albumSongs.forEach((song, index) => {
        song.buttonId = buttonIds[index];
    });
}

// Save the songData to a JSON file
const songDataFile = 'songData.json';
fs.writeFileSync(songDataFile, JSON.stringify(songData, null, 2), 'utf8');

console.log('songData has been saved to', songDataFile);
