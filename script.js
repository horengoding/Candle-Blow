document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  const messageDisplay = document.getElementById("messageDisplay");
  let candles = [];
  let audioContext;
  let analyser;
  let microphone;
  let mediaStream = null;
  let celebrationTriggered = false;

  const trumpetSound = new Audio("audio/confetti.mp3");
  const birthdaySong = new Audio("audio/namida-surprise-template.mp3");

  trumpetSound.volume = 0.1;
  birthdaySong.volume = 0.1;

  function updateMessage() {
    const activeCandles = candles.filter(
      (candle) => !candle.classList.contains("out")
    ).length;
    const totalCandles = candles.length;

    if (totalCandles === 0) {
      messageDisplay.textContent = "Sentuh kue untuk pasang lilin!";
      messageDisplay.className = "candle-count-display state-add";
      celebrationTriggered = false;
    } else if (activeCandles > 0) {
      messageDisplay.textContent = "Sekarang tiup lilin!";
      messageDisplay.className = "candle-count-display state-blow";
    } else {
      messageDisplay.innerHTML = "YEAYY PIBESDEEY!!🎉🎉<br>😛";
      messageDisplay.className = "candle-count-display state-celebrate";
      if (!celebrationTriggered) {
        celebrationTriggered = true;
        startCelebrationSequence();
      }
    }
  }

  function startCelebrationSequence() {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }

    trumpetSound.currentTime = 0;
    trumpetSound.play()
      .then(() => {
        trumpetSound.onended = function() {
          birthdaySong.currentTime = 0;
          birthdaySong.play().catch((err) => console.log("Audio lagu diblokir browser: ", err));
        };
      })
      .catch((err) => {
        console.log("Audio terompet diblokir/gagal: ", err);
        birthdaySong.currentTime = 0;
        birthdaySong.play().catch((e) => console.log("Audio lagu juga diblokir: ", e));
      });

    triggerPermanentConfetti();
  }

  function triggerPermanentConfetti() {
    function createConfettiPiece() {
      const confetti = document.createElement("div");
      confetti.classList.add("confetti-piece");

      const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#ffa500"];
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

      confetti.style.left = Math.random() * window.innerWidth + "px";
      confetti.style.top = "-20px";
      confetti.style.width = Math.random() * 10 + 5 + "px";
      confetti.style.height = Math.random() * 10 + 5 + "px";
      confetti.style.position = "fixed";
      confetti.style.zIndex = "9999";
      confetti.style.borderRadius = "50%";
      confetti.style.pointerEvents = "none";
      confetti.style.transition = "all " + (Math.random() * 3 + 2) + "s linear";

      document.body.appendChild(confetti);

      setTimeout(() => {
        confetti.style.top = window.innerHeight + 50 + "px";
        confetti.style.transform = "rotate(" + (Math.random() * 360) + "deg) scale(" + (Math.random() + 0.5) + ")";
        confetti.style.opacity = "0";
      }, 50);

      setTimeout(() => {
        confetti.remove();
        }, 5000);
    }

    setInterval(createConfettiPiece, 150);
  }

  function addCandle(left, top) {
    const candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = left + "px";
    candle.style.top = top + "px";

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    cake.appendChild(candle);
    candles.push(candle);
    updateMessage();
  }

  cake.addEventListener("click", function (event) {
    const rect = cake.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const top = event.clientY - rect.top;
    addCandle(left, top);
  });

  function isBlowing() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    let average = sum / bufferLength;

    return average > 40; 
  }

  function blowOutCandles() {
    if (candles.length === 0) return;

    const activeCandles = candles.filter(
      (candle) => !candle.classList.contains("out")
    ).length;

    if (activeCandles === 0) return;

    let blownOut = 0;

    if (isBlowing()) {
      candles.forEach((candle) => {
        if (!candle.classList.contains("out") && Math.random() > 0.5) {
          candle.classList.add("out");
          blownOut++;
        }
      });
    }

    if (blownOut > 0) {
      updateMessage();
    }
  }

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        mediaStream = stream;
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        setInterval(blowOutCandles, 200);
      })
      .catch(function (err) {
        console.log("Unable to access microphone: " + err);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }
});