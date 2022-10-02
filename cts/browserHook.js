var phraseDiv, statusDiv, KeyphraseDiv;
var thingsToDisableDuringSession;
var SpeechSDK;
var scenarioStartButton, scenarioStopButton;
var startButtonText = "transcription"
let filepath, input   // wav file

function resetUiForScenarioStart() {
    phraseDiv.innerHTML = "";
    KeyphraseDiv.innerHTML = "";
    statusDiv.innerHTML = "";
    useDetailedResults = "";
    keyArr = []; 
}

document.addEventListener("DOMContentLoaded", function () {
    
    input = document.getElementById('file');  // wav file
    input.addEventListener('change', () => {
        for(file of input.files){
            filepath = file;
        }
    });

    scenarioStartButton = document.getElementById('scenarioStartButton');
    scenarioStopButton = document.getElementById('scenarioStopButton');

    phraseDiv = document.getElementById("phraseDiv");
    KeyphraseDiv = document.getElementById("KeyphraseDiv");
    statusDiv = document.getElementById("statusDiv");

    thingsToDisableDuringSession = [
    ];

    scenarioStartButton.innerHTML = startButtonText;
    scenarioStopButton.innerHTML = `STOP ${startButtonText}`;

    scenarioStartButton.addEventListener("click", function () {
        doContinuousRecognition();
    });

    scenarioStopButton.addEventListener("click", function() {
        transcriber.close();
        transcriber = undefined;
    });

    Initialize(async function (speechSdk) {
        SpeechSDK = speechSdk;
    });
});
