const recoderContainer = document.getElementById("recordContainer");
const recordBtn = document.getElementById("recordBtn");
const currentTime = document.getElementById("recordContainer__currentTime");

let time,
  seconds = 0,
  minutes = 0,
  hours = 0;
let timerOn;
let chunks;
let streamObject;
let voiceRecorder;

const handleVoiceData = event => {
  chunks.push(event.data);
  let link = document.createElement("a");
  document.body.appendChild(link);
  let blob = new Blob(chunks, { type: "audio/webm;codecs=opus" });
  link.href = URL.createObjectURL(blob);
  link.download = getFormattedTime() + ".webm";
  link.click();
};

const stopRecording = () => {
  voiceRecorder.stop();
  timerReset();
  recordBtn.removeEventListener("click", stopRecording);
  recordBtn.addEventListener("click", getVoice);
  recordBtn.innerHTML = "Start Recording";
};

const startRecording = () => {
  chunks = [];
  voiceRecorder = new MediaRecorder(streamObject);
  voiceRecorder.start();
  timerSet();
  voiceRecorder.addEventListener("dataavailable", handleVoiceData);
  recordBtn.addEventListener("click", stopRecording);
};

const timer = () => {
  if (timerOn === "on") {
    seconds++;
    if (seconds >= 60) {
      seconds = 0;
      minutes++;
      if (minutes >= 60) {
        minutes = 0;
        hours++;
      }
    }

    currentTime.innerHTML =
      (hours ? (hours > 9 ? hours : "0" + hours) : "00") +
      ":" +
      (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") +
      ":" +
      (seconds > 9 ? seconds : "0" + seconds);

    timerSet();
  } else return;
};

const timerSet = () => {
  time = setTimeout(timer, 1000);
  timerOn = "on";
};

const timerReset = () => {
  clearTimeout(time);
  currentTime.innerHTML = "00:00:00";
  seconds = 0;
  minutes = 0;
  hours = 0;
  timerOn = "off";
};

function getFormattedTime() {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth() + 1;
  const d = today.getDate();
  const h = today.getHours();
  const mi = today.getMinutes();
  const s = today.getSeconds();
  return "Record " + y + "-" + m + "-" + d + " at " + h + ":" + mi + ":" + s;
}

const getVoice = () => {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(function(stream) {
      recordBtn.innerHTML = "Stop Recording";
      streamObject = stream;
      startRecording();
    })
    .catch(function(err) {
      recordBtn.innerHTML = "☹️ Cant record";
    })
    .finally(function() {
      recordBtn.removeEventListener("click", getVoice);
    });
};

function init() {
  recordBtn.addEventListener("click", getVoice);
}

if (recoderContainer) {
  init();
}
