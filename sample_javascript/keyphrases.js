const langCode = "ja";
const languageKey = '<-- language-key -->';
const languageEndpoint = 'https://<-- language endpoint -->/';
let keyArr = [];      // Key Phrase

function getKeyphrases(text) {

    let payload = {
        "kind": "KeyPhraseExtraction",
        "parameters": {
            "modelVersion": "latest"
        },
        "analysisInput":{
            "documents":[
                { id: "1", language: langCode, text: text}
            ]
        }
    };

    axios({
        method: 'POST',
        url: `${languageEndpoint}/language/:analyze-text?api-version=2022-05-15-preview`,
        headers: {'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': languageKey},
        data: payload,
        responseType: 'json',
    }).then(response => {
        let keyPhrases = [];

        //if (!response.data.documents[0]){ return false; }
        // Text Analytics
        // keyPhrases = response.data.documents[0].keyPhrases.filter(word => word.length > 1);
        // CS for Language 
        keyPhrases = response.data.results.documents[0].keyPhrases.filter(word => word.length > 1);

        keyArr = keyArr.concat(keyPhrases)
        let set = new Set(keyArr);
        keyArr = [...set];

        KeyphraseDiv.innerHTML = `${keyArr.join(',')},`  //\r\n`;
        //console.log('keyPhrases: ', results);
        })
};