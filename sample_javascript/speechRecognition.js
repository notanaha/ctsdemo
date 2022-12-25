const speech_key = "<-- speech-key -->";
const regionOptions = "<-- region -->";
const languageOptions = "ja-JP";
//const languageOptions = "en-US";

function doContinuousRecognition() {
    resetUiForScenarioStart();

    if (filepath) {
        var audioConfig = SpeechSDK.AudioConfig.fromWavFileInput(filepath);
    } else {
        var audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    }

    var speechConfig = SpeechSDK.SpeechConfig.fromSubscription(speech_key, regionOptions);
    speechConfig.setProperty("<----- CTS Private Preview Key ----->", "true");
    speechConfig.setProperty("ConversationTranscriptionInRoomAndOnline", "true");
    speechConfig.setProperty("DifferentiateGuestSpeakers", "true");
    speechConfig.setProperty("TranscriptionService_SingleChannel", "true");
    speechConfig.outputFormat = SpeechSDK.OutputFormat.Simple;
    speechConfig.speechRecognitionLanguage = languageOptions;

    if (!speechConfig) return;

    var conversation = SpeechSDK.Conversation.createConversationAsync(speechConfig, "myConversation");
    transcriber = new SpeechSDK.ConversationTranscriber(audioConfig);  // Global variable

    // attach the transcriber to the conversation
    transcriber.joinConversationAsync(conversation,
        function () {

            transcriber.transcribing = onRecognizing;
            transcriber.transcribed = onRecognized;
            transcriber.canceled = onCanceled;
            transcriber.sessionStarted = onSessionStarted;
            transcriber.sessionStopped = onSessionStopped;

            // begin conversation transcription
            transcriber.startTranscribingAsync(
                function () { },
                function (err) {
                    console.trace("err - starting transcription: " + err);
                }
            );
        },
    );
}