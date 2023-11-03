/*       let spinnerWrapper = document.querySelector(".spinner-wrapper");
      window.addEventListener("load", function () {
        // spinnerWrapper.style display = 'none';
        spinnerWrapper.parentElement.removeChild(spinnerWrapper);
      }); */

// Define variables and functions
let currentSongIndex = -1;
let isPlaying = false;
let isShuffleOn = false;
const audio = new Audio();
let activeAlbumId = null;
const songData = {};
const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");

previousBtn.addEventListener("click", () => {
  const activeAlbumId = getActiveAlbumId();
  if (activeAlbumId) {
    playPreviousSong(activeAlbumId, currentSongIndex);
  }
});

nextBtn.addEventListener("click", () => {
  const activeAlbumId = getActiveAlbumId();
  if (activeAlbumId) {
    playNextSong(activeAlbumId, currentSongIndex);
  }
});

function setActiveAlbum(albumId) {
  activeAlbumId = albumId;
}

function getActiveAlbumId() {
  return activeAlbumId;
}

function pauseSong() {
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
  }
}

function updateCurrentlyPlayingSongText(songName) {
  const currentSongText = document.getElementById("currentSongText");
  if (currentSongText) {
    currentSongText.textContent = "Currently Playing: " + songName;
  }
}

function playSong(albumName, songIndex) {
    const songList = songData[albumName];
  
    if (!songList || songIndex < 0 || songIndex >= songList.length) {
      console.error("Invalid albumName or songIndex");
      return;
    }
  
    const audioFile = songList[songIndex];
  
    if (!audioFile) {
      console.error("Audio file not found for the selected song.");
      return;
    }
  
    const audioFileNormalized = audioFile.replace(/\\/g, "/");
    const songName = audioFileNormalized.split('/').pop().split('.')[0];
    const albumNameWithoutNumber = albumName.replace(/^\d+\s/, '');

    audio.src = audioFileNormalized;
    audio.play().catch((error) => {
      console.error("Error playing the song:", error);
    });
  
    updateCurrentlyPlayingSongText(`${albumNameWithoutNumber}: ${songName}`);
  
    currentSongIndex = songIndex;
    isPlaying = true;
  
    setActiveAlbum(albumName); // Set the active album dynamically
  
    audio.addEventListener("ended", () => {
      playNextSong(albumName, songIndex);
    });
  }

  function playPause() {
    if (audio) {
      if (isPlaying) {
        pauseSong();
        togglePlayPauseIcon(false); // Pass false to indicate the song is paused
      } else {
        audio.play().catch((error) => {
          console.error("Error playing the song:", error);
        });
        isPlaying = true;
        togglePlayPauseIcon(true); // Pass true to indicate the song is playing
      }
    }
  }

  const songHistory = [];

  function playNextSong(albumName, songIndex) {
    const songList = songData[albumName];
    
    if (isShuffleOn) {
      // If shuffling is enabled, prioritize recent songs in history
      if (songHistory.length > 0) {
        const recentSongIndex = songHistory.pop();
        playSong(albumName, recentSongIndex);
      } else {
        // If no recent songs in history, shuffle randomly
        const randomIndex = getRandomIndex(songList.length);
        playSong(albumName, randomIndex);
      }
    } else {
      // If shuffling is not enabled, play the next song in order
      const isLastSong = songIndex === songList.length - 1;
  
      if (isLastSong) {
        const albums = Array.from(document.querySelectorAll(".music-player h2"));
        const currentIndex = albums.findIndex((album) => album.textContent === albumName);
        if (currentIndex >= 0 && currentIndex < albums.length - 1) {
          const nextAlbum = albums[currentIndex + 1];
          const nextAlbumName = nextAlbum.textContent;
          playSong(nextAlbumName, 0);
        }
      } else {
        // Play the next song in the current album
        const nextSongIndex = songIndex + 1;
        playSong(albumName, nextSongIndex);
      }
    }
  }
  
  function playPreviousSong(albumName, songIndex) {
    const songList = songData[albumName];
    
    if (isShuffleOn) {
      // If shuffling is enabled, prioritize recent songs in history
      if (songHistory.length > 0) {
        const recentSongIndex = songHistory.pop();
        playSong(albumName, recentSongIndex);
      } else {
        // If no recent songs in history, shuffle randomly
        const randomIndex = getRandomIndex(songList.length);
        playSong(albumName, randomIndex);
      }
    } else {
      // If shuffling is not enabled, play the previous song in order
      const isFirstSong = songIndex === 0;
  
      if (isFirstSong) {
        const albums = Array.from(document.querySelectorAll(".music-player h2"));
        const currentIndex = albums.findIndex((album) => album.textContent === albumName);
        if (currentIndex > 0) {
          const prevAlbum = albums[currentIndex - 1];
          const prevAlbumName = prevAlbum.textContent;
          const prevAlbumSongs = songData[prevAlbumName];
          const prevSongIndex = prevAlbumSongs ? prevAlbumSongs.length - 1 : 0;
          playSong(prevAlbumName, prevSongIndex);
        }
      } else {
        // Play the previous song in the current album
        const previousSongIndex = songIndex - 1;
        playSong(albumName, previousSongIndex);
      }
    }
  }

  function togglePlayPauseIcon(isPlaying) {
    const playPauseBtn = document.getElementById("playPauseBtn");
    if (playPauseBtn) {
      if (isPlaying) {
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
      } else {
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      }
    }
  }
const shuffleStatus = document.getElementById("shuffleStatus");

function toggleShuffle() {
  isShuffleOn = !isShuffleOn;
  console.log("Shuffle: " + isShuffleOn);

  const shuffleBtn = document.getElementById("shuffleBtn");
  shuffleBtn.classList.toggle("active");

  if (isShuffleOn) {
    shuffleStatus.textContent = "Shuffle On"; // Display text when shuffle is on
  } else {
    shuffleStatus.textContent = ""; // Clear the text when shuffle is off
  }
}

function getRandomIndex(range) {
  return Math.floor(Math.random() * range);
}

// Initialize the song lists for each music player
const musicPlayers = document.querySelectorAll(".music-player");
musicPlayers.forEach((musicPlayer) => {
  const albumId = musicPlayer.querySelector("h2").textContent;
  const songItems = musicPlayer.querySelectorAll(".song-list li");
  songItems.forEach((songItem, index) => {
    const albumName = songItem.getAttribute("data-album");
    const songIndex = index;
    songItem.addEventListener("click", () => {
      playSong(albumName, songIndex);
      currentSongIndex = songIndex;
      setActiveAlbum(albumName);
      togglePlayPauseIcon();
    });
  });
});

// Add event listeners to the control buttons
const controlBtns = document.querySelectorAll(".control-btn");
controlBtns.forEach((button) => {
  button.addEventListener("click", handleButtonClick);
});

function handleButtonClick(event) {
  const button = event.target;
  const albumId = button.getAttribute("data-album");
  switch (button.id) {
    case "previousBtn":
      playPreviousSong(albumId, currentSongIndex);
      break;
    case "playPauseBtn":
      playPause();
      break;
    case "nextBtn":
      playNextSong(albumId, currentSongIndex);
      break;
    case "shuffleBtn":
      toggleShuffle();
      break;
  }
}

// Fetch song data
fetch("songData.json")
  .then((response) => response.json())
  .then((data) => {
    Object.assign(songData, data);
    console.log("Fetched song data:", songData);
  })
  .catch((error) => {
    console.error("Error fetching song data:", error);
  });