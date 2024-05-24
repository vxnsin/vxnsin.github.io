// function([string1, string2],target id,[color1,color2])    
consoleText(['Vxnsin', 'About Me'], 'text',['lightblue','tomato']);

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
    // Get the audio element
    // Get the audio element
    var audio = document.getElementById('myAudio');
    
    audio.volume = 0.2; 

    audio.loop = true; 
    
    audio.play();
}
