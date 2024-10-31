// function([string1, string2],target id,[color1,color2])    
window.addEventListener('load', updateStatus);
consoleText(['Vensin', 'About Me'], 'text',['white','white']);

function consoleText(words, id, colors) {
  if (colors === undefined) colors = ['#fff'];
  var visible = true;
  var con = document.getElementById('username');
  var letterCount = 1;
  var x = 1;
  var waiting = false;
  var target = document.getElementById(id)
  target.setAttribute('style', 'color:' + colors[0])
  window.setInterval(function() {

    if (letterCount === 0 && waiting === false) {
      waiting = true;
      target.innerHTML = words[0].substring(0, letterCount)
      window.setTimeout(function() {
        var usedColor = colors.shift();
        colors.push(usedColor);
        var usedWord = words.shift();
        words.push(usedWord);
        x = 1;
        target.setAttribute('style', 'color:' + colors[0])
        letterCount += x;
        waiting = false;
      }, 1000)
    } else if (letterCount === words[0].length + 1 && waiting === false) {
      waiting = true;
      window.setTimeout(function() {
        x = -1;
        letterCount += x;
        waiting = false;
      }, 1000)
    } else if (waiting === false) {
      target.innerHTML = words[0].substring(0, letterCount)
      letterCount += x;
    }
  }, 120)
  window.setInterval(function() {
    if (visible === true) {
      con.className = 'underscore hidden'
      visible = false;

    } else {
      con.className = 'underscore'

      visible = true;
    }
  }, 400)
}
function removeBlur() {
    var blurScreen = document.getElementById('blur-screen');
    blurScreen.style.display = 'none';
    var containerMain = document.getElementById('container--main');
    containerMain.classList.remove('hidden');
    containerMain.style.opacity = '1';
    containerMain.style.transform = 'translateY(0)';
    var audio = document.getElementById('myAudio');
    
    audio.volume = 0.2; 

    audio.loop = true; 
    
    audio.play();
}

async function fetchDiscordStatus() {
  try {
      const response = await fetch(`https://api.lanyard.rest/v1/users/531896089096486922`);
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Fehler beim Abrufen der Discord-Daten:', error);
  }
}

async function updateStatus() {
  const discordData = await fetchDiscordStatus();

  if (discordData && discordData.success) {
      const userStatus = discordData.data.discord_status; 
      const customStatus = discordData.data.activities.find(activity => activity.type === 4)?.state; 
      const isListeningToSpotify = discordData.data.listening_to_spotify; 
      const currentSong = isListeningToSpotify ? discordData.data.spotify.song : null; 
      const currentSongID = isListeningToSpotify ? discordData.data.spotify.track_id : null;  

      const statusIndicator = document.getElementById('status-indicator');
      const musicIcon = document.getElementById('music-icon');
      const statusIcon = document.getElementById('status-icon');

      // Update den Status-Indicator
      statusIndicator.classList.remove('status-online', 'status-dnd', 'status-idle', 'status-offline'); 

      if (userStatus === "online") {
          statusIndicator.classList.add('status-online');
      } else if (userStatus === "dnd") { 
          statusIndicator.classList.add('status-dnd'); 
      } else if (userStatus === "idle") { 
          statusIndicator.classList.add('status-idle'); 
      } else {
          statusIndicator.classList.add('status-offline'); 
      }

    
        if (isListeningToSpotify) {
          musicIcon.classList.add("rotating");
          musicIcon.style.display = 'block'; 
          musicIcon.setAttribute("data-song", currentSong);
          musicIcon.setAttribute("data-song", currentSong);
          const songLink = currentSongID ? `https://open.spotify.com/track/${currentSongID}` : null;
          
          if (songLink) {
              musicIcon.setAttribute("data-song-link", songLink); 
          }
      } else {
          musicIcon.classList.remove("rotating");
          musicIcon.style.display = 'none'; 
      }

      if (customStatus) {
          statusIcon.style.display = 'block'; 
          statusIcon.setAttribute("data-state", customStatus);
      } else {
          statusIcon.style.display = 'none'; 
      }
  }
}

document.getElementById("music-icon").addEventListener("click", () => {
  const musicIcon = document.getElementById("music-icon");
  const songPopup = document.getElementById("song-popup");
  const currentSong = musicIcon.getAttribute("data-song");
  const songLink = musicIcon.getAttribute("data-song-link");

  if (currentSong) {
    songPopup.innerHTML = `<a href="${songLink}" target="_blank" style="color: white; text-decoration: none;">${currentSong}</a>`;
      songPopup.style.opacity = 0; 
      songPopup.style.display = 'block'; 
      
      setTimeout(() => {
        songPopup.style.opacity = 1; 
    }, 100); 


      setTimeout(() => {
          songPopup.style.opacity = 0; 
          setTimeout(() => {
              songPopup.style.display = 'none'; 
          }, 500); 
      }, 5000); 
  }
});
document.getElementById("status-icon").addEventListener("click", () => {
  const statusIcon = document.getElementById("status-icon");
  const statusPopup = document.getElementById("status-popup");
  const currentState = statusIcon.getAttribute("data-state");

  if (currentState) {
      statusPopup.innerText = `${currentState}`;
      statusPopup.style.opacity = 0; 
      statusPopup.style.display = 'block'; 
      
      setTimeout(() => {
        statusPopup.style.opacity = 1; 
    }, 100);

      setTimeout(() => {
          statusPopup.style.opacity = 0; 
          setTimeout(() => {
              statusPopup.style.display = 'none'; 
          }, 500); 
      }, 5000); 
  }
});

setInterval(updateStatus, 10000);