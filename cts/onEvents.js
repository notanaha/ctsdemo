// On Event Processing
const wordlength = 2;  // threshold to invoke key phrase

function onRecognizing(sender, recognitionEventArgs) {
    var result = recognitionEventArgs.result;
    statusDiv.innerHTML += `(recognizing) Reason: ${SpeechSDK.ResultReason[result.reason]}`
        + ` Text: ${result.text}\r\n`;
    // Update the hypothesis line in the phrase/result view (only have one)
    phraseDiv.innerHTML = phraseDiv.innerHTML.replace(/(.*)(^|[\r\n]+).*\[\.\.\.\][\r\n]+/, '$1$2')
        + `${result.text} [...]\r\n`;
    phraseDiv.scrollTop = phraseDiv.scrollHeight;
}

function onRecognized(sender, recognitionEventArgs) {
    var result = recognitionEventArgs.result;

    if (result.text.length > wordlength) {
        onRecognizedResult(result); 
        getKeyphrases(result.text);
    }  

    // do postprocessing
    //console.log("(transcribed) text: " + result.text);
    //console.log("(transcribed) speakerId: " + result.speakerId);
}

function onRecognizedResult(result) {
    phraseDiv.scrollTop = phraseDiv.scrollHeight;

    statusDiv.innerHTML += `(recognized)  Reason: ${SpeechSDK.ResultReason[result.reason]}`;
    phraseDiv.innerHTML = phraseDiv.innerHTML.replace(/(.*)(^|[\r\n]+).*\[\.\.\.\][\r\n]+/, '$1$2');

    switch (result.reason) {
        case SpeechSDK.ResultReason.NoMatch:
            var noMatchDetail = SpeechSDK.NoMatchDetails.fromResult(result);
            statusDiv.innerHTML += ` NoMatchReason: ${SpeechSDK.NoMatchReason[noMatchDetail.reason]}\r\n`;
            break;
        case SpeechSDK.ResultReason.Canceled:
            var cancelDetails = SpeechSDK.CancellationDetails.fromResult(result);
            statusDiv.innerHTML += ` CancellationReason: ${SpeechSDK.CancellationReason[cancelDetails.reason]}`;
                + (cancelDetails.reason === SpeechSDK.CancellationReason.Error 
                    ? `: ${cancelDetails.errorDetails}` : ``)
                + `\r\n`;
            break;
        case SpeechSDK.ResultReason.RecognizedSpeech:

            statusDiv.innerHTML += `\r\n`;

            if (useDetailedResults) {
                var detailedResultJson = JSON.parse(result.json);
                var displayText = detailedResultJson['DisplayText'];
                phraseDiv.innerHTML += `Detailed result for "${displayText}":\r\n`
                + `${JSON.stringify(detailedResultJson, null, 2)}\r\n`;
            } else if (result.text) {
                //phraseDiv.innerHTML += `${result.text}\r\n`;   // Now put the text to the result window
                phraseDiv.innerHTML += `${result.text} ${result.speakerId}\r\n`;
            }

            break;
    }
}

function onSessionStarted(sender, sessionEventArgs) {
    statusDiv.innerHTML += `(sessionStarted) SessionId: ${sessionEventArgs.sessionId}\r\n`;

    for (const thingToDisableDuringSession of thingsToDisableDuringSession) {
        thingToDisableDuringSession.disabled = true;
    }

    scenarioStartButton.disabled = true;
    scenarioStopButton.disabled = false;
}

function onSessionStopped(sender, sessionEventArgs) {
    statusDiv.innerHTML += `(sessionStopped) SessionId: ${sessionEventArgs.sessionId}\r\n`;

    for (const thingToDisableDuringSession of thingsToDisableDuringSession) {
        thingToDisableDuringSession.disabled = false;
    }

    scenarioStartButton.disabled = false;
    scenarioStopButton.disabled = true;
}

function onCanceled (sender, cancellationEventArgs) {
    window.console.log(e);

    statusDiv.innerHTML += "(cancel) Reason: " + SpeechSDK.CancellationReason[e.reason];
    if (e.reason === SpeechSDK.CancellationReason.Error) {
        statusDiv.innerHTML += ": " + e.errorDetails;
    }
    statusDiv.innerHTML += "\r\n";
}