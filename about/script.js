let currentActivityIndex = 0;

$(document).ready(function() {
  updateStatus();
  consoleText(['Vensin', 'About Me'], 'text', ['white', 'white']);
  
  const muteButton = $("#muteButton");
  const audio = $("#myAudio")[0];

  if (muteButton.length && audio) {
      muteButton.on("click", function() {
          audio.muted = !audio.muted;
          $(this).html(audio.muted 
              ? '<i class="fas fa-volume-mute icon"></i>' 
              : '<i class="fas fa-volume-up icon"></i>'
          );
      });
  } else {
      console.error("Mute Button or Audio Element not found.");
  }

  const activityIcon = $("#activity-icon");
  const activityPopup = $("#activity-popup");

  if (activityIcon.length && activityPopup.length) {
      activityIcon.on("click", function() {
          const currentActivity = $(this).data("activity");
          if (currentActivity) {
              activityPopup.text(currentActivity);
              activityPopup.css({opacity: 0, display: 'block'});
              setTimeout(() => {
                  activityPopup.animate({opacity: 1}, 100);
              }, 100);
              setTimeout(() => {
                  activityPopup.animate({opacity: 0}, 500, () => {
                      activityPopup.css('display', 'none');
                  });
              }, 5000);
          }
      });
  } else {
      console.error("Activity icon or popup element not found");
  }

  const musicIcon = $("#music-icon");
  const songPopup = $("#song-popup");

  if (musicIcon.length && songPopup.length) {
      musicIcon.on("click", function() {
          const currentSong = $(this).data("song");
          const songLink = $(this).data("song-link");
          if (currentSong) {
              songPopup.html(`<a href="${songLink}" target="_blank" style="color: white; text-decoration: none;">${currentSong}</a>`);
              songPopup.css({opacity: 0, display: 'block'});
              setTimeout(() => {
                  songPopup.animate({opacity: 1}, 100);
              }, 100);
              setTimeout(() => {
                  songPopup.animate({opacity: 0}, 500, () => {
                      songPopup.css('display', 'none');
                  });
              }, 5000);
          }
      });
  } else {
      console.error("Music icon or song popup element not found");
  }

  const statusIcon = $("#status-icon");
  const statusPopup = $("#status-popup");

  if (statusIcon.length && statusPopup.length) {
      statusIcon.on("click", function() {
          const currentState = $(this).data("state");
          if (currentState) {
              statusPopup.text(currentState);
              statusPopup.css({opacity: 0, display: 'block'});
              setTimeout(() => {
                  statusPopup.animate({opacity: 1}, 100);
              }, 100);
              setTimeout(() => {
                  statusPopup.animate({opacity: 0}, 500, () => {
                      statusPopup.css('display', 'none');
                  });
              }, 5000);
          }
      });
  } else {
      console.error("Status icon or popup element not found");
  }
});

function consoleText(words, id, colors) {
  if (colors === undefined) colors = ['#fff'];
  var visible = true;
  var con = document.getElementById('username');
  var letterCount = 1;
  var x = 1;
  var waiting = false;
  var target = document.getElementById(id);
  target.setAttribute('style', 'color:' + colors[0]);
  
  window.setInterval(function() {
      if (letterCount === 0 && waiting === false) {
          waiting = true;
          target.innerHTML = words[0].substring(0, letterCount);
          window.setTimeout(function() {
              var usedColor = colors.shift();
              colors.push(usedColor);
              var usedWord = words.shift();
              words.push(usedWord);
              x = 1;
              target.setAttribute('style', 'color:' + colors[0]);
              letterCount += x;
              waiting = false;
          }, 1000);
      } else if (letterCount === words[0].length + 1 && waiting === false) {
          waiting = true;
          window.setTimeout(function() {
              x = -1;
              letterCount += x;
              waiting = false;
          }, 1000);
      } else if (waiting === false) {
          target.innerHTML = words[0].substring(0, letterCount);
          letterCount += x;
      }
  }, 120);
  
  window.setInterval(function() {
      if (visible === true) {
          con.className = 'underscore hidden';
          visible = false;
      } else {
          con.className = 'underscore';
          visible = true;
      }
  }, 400);
}

function removeBlur() {
  $('#blur-screen').fadeOut(300);
  const containerMain = $('#container--main');
  containerMain.removeClass('hidden').css({opacity: '1', transform: 'translateY(0)'});
  
  const audio = $("#myAudio")[0];
  audio.volume = 0.2; 
  audio.loop = true; 
  audio.play();
}

async function fetchDiscordStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/531896089096486922`);
        const data = await response.json();
  
        if (data?.data?.activities) {
            data.data.activities = data.data.activities.filter(activity => activity.name !== "Spotify");
        }
  
        return data;
    } catch (error) {
        console.error('Fehler beim Abrufen der Discord-Daten:', error);
    }
  }
async function updateStatus() {
  const discordData = await fetchDiscordStatus();
  const activityIcon = $("#activity-icon");
  const musicIcon = $("#music-icon");
  const statusIcon = $("#status-icon");
  const statusIndicator = $('#status-indicator');

  if (discordData && discordData.success) {
      const userStatus = discordData.data.discord_status;
      const isListeningToSpotify = discordData.data.listening_to_spotify;
      const activities = discordData.data.activities;
      const customStatus = discordData.data.activities.find(activity => activity.type === 4)?.state;

      statusIndicator.removeClass('status-online status-dnd status-idle status-offline').addClass(`status-${userStatus}`);

      if (isListeningToSpotify) {
          musicIcon.addClass("rotating").css('display', 'block');
          const currentSong = discordData.data.spotify.song;
          const songID = discordData.data.spotify.track_id;
          musicIcon.attr("data-song", currentSong).attr("data-song-link", `https://open.spotify.com/track/${songID}`);
      } else {
          musicIcon.removeClass("rotating").css('display', 'none');
      }

      if (customStatus) {
          statusIcon.show();
          statusIcon.attr("data-state", customStatus); 
      } else {
          statusIcon.hide(); 
      }

            const activitiesToDisplay = activities.filter(activity => activity.name !== "Spotify");

            if (activitiesToDisplay.length > 0) {
                const activity = activitiesToDisplay[currentActivityIndex];
                let activityText = '';
                let emoji = '';
                
                switch (activity.name) {
                    case "AniWorld":
                        emoji = '🍿';
                        activityText = `Anime - ${activity.details}`;
                        break;
                    case "Visual Studio Code":
                        emoji = '⌨️';
                        const filteredDetails = activity.state.replace(/💼/g, '').replace(/ᕁ/g, '').trim();
                        activityText = `Working - ${filteredDetails}`;
                        break;
                }
        
                activityIcon.css('display', 'block') 
                    .attr("data-activity", activityText) 
                    .text(emoji);
        
                currentActivityIndex = (currentActivityIndex + 1) % activitiesToDisplay.length;
                activityIcon.attr("data-index", currentActivityIndex);
            } else {
                activityIcon.css('display', 'none'); 
            }
       }
}
setInterval(updateStatus, 10000);
