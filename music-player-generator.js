const fs = require('fs');
const path = require('path');

// Function to get a list of MP3 and WAV files in a directory
function getMusicFiles(dir) {
    return fs.readdirSync(dir)
        .filter(file => /\.(mp3|wav)$/i.test(file));
}

// Function to create an HTML music player for a specific album
function createMusicPlayer(albumName, songList) {
    const cleanedAlbumName = albumName.replace(/^\d+\s*/, '');

    const template = `
        <div class="music-player">
            <h2>${cleanedAlbumName}</h2>
            <div class="song-list">
                ${songList.map((song, index) => {
                    const songNameWithoutExtension = path.parse(song).name; // Remove .mp3 extension
                    return `
                        <li data-song-index="${index}" data-album="${albumName}" onclick="playSong('${albumName}', ${index})">${songNameWithoutExtension}</li>
                    `;
                }).join('')}
            </div>
        </div>
    `;

    return template;
}

// Function to remove the existing music-players div and insert a new one in the HTML file
function replaceMusicPlayersInHTML(html, targetClass) {
    const htmlFile = fs.readFileSync('music.html', 'utf8');

    // Replace the existing <div class="music-players"> element with the new one
    const updatedHTML = htmlFile.replace(/<div class="music-players">[\s\S]*<\/div>/, `<div class="${targetClass}">${html}</div>`);

    fs.writeFileSync('music.html', updatedHTML, 'utf8');
}

/// Function to scan a directory and create music players for subfolders
function createMusicPlayers(rootDir, targetClass) {
    const subfolders = fs.readdirSync(rootDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    const musicPlayers = [];

    for (const folder of subfolders) {
        const albumName = folder;
        const albumDir = path.join(rootDir, folder);
        const musicFiles = getMusicFiles(albumDir);

        if (musicFiles.length > 0) {
            const musicPlayerHtml = createMusicPlayer(albumName, musicFiles);
            musicPlayers.push(musicPlayerHtml);
        }
    }

    // Join the generated music players and insert them into the HTML file
    replaceMusicPlayersInHTML(musicPlayers.join(''), targetClass);
}

// Specify the root directory to start scanning for albums and the target class
const rootDirectory = 'albums';
const targetClass = 'music-players';
createMusicPlayers(rootDirectory, targetClass);
