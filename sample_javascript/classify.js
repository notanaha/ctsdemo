// The following variables are referencing to keyphrases.js
// const langCode = "ja";
// const languageKey = '<-- language-key -->>';
// const languageEndpoint = 'https://<-- language-endpoint -->/';
let category;
let confidenceScore;

function getTopic(text) {

    let payload = {
        "displayName": "Classifying documents",
        "analysisInput": {
          "documents": [
            {
              "id": "1",
              "language": langCode,
              "text": text
            }
          ]
        },
        "tasks": [
          {
            "kind": "CustomSingleLabelClassification",
            "taskName": "Single Classification Label",
            "parameters": {
              "projectName": "topic1",
              "deploymentName": "topic1"
            }
          }
        ]
    }
    let operation_location

    axios({
        method: 'POST',
        url: `${languageEndpoint}/language/analyze-text/jobs?api-version=2022-05-01`,
        headers: {'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': languageKey},
        data: payload,
        responseType: 'json',
    }).then(response => {        

        operation_location = response.headers['operation-location'];
        getCategory(operation_location)

        }
    )
};

async function getCategory(url) {
    let i=0 //debugging purpose
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    let status = "notStarted";

    for (let j = 0; j < 10; j++) {
        console.log('debugging status: ', status)  //debugging purpose 

        axios({
            method: 'GET',
            url: url,
            headers: {'Content-Type': 'application/json', 'Ocp-Apim-Subscription-Key': languageKey},
            responseType: 'json',
            }).then( response => {

                status = response.data.status
                console.log('status: ', status);
                if ( status == "succeeded" ){
                    category = response.data.tasks.items[0].results.documents[0].class[0].category;
                    confidenceScore = response.data.tasks.items[0].results.documents[0].class[0].confidenceScore;
                    console.log('category: ', category);
                    console.log('confidenceScore: ', confidenceScore);
                    console.log('i', i) //debugging purpose
                    i++ //debugging purpose
                }
              }
            )
        if (status == "succeeded"){
            break;        // don't have to wait if the status is "succeeded"
        }
        console.log('sleep: ', "sleep 200ms");
        await sleep(200); // place "sleep" here, otherwise redundant loop may take place

    } //end of for loop

    if (confidenceScore > 0.85) {
        writeTopic(category);
    }
};

function writeTopic(category) {
    //ClassDiv.innerHTML = `この方は ${category} の話をされていますが、お調べしましょうか？`;
    ClassDiv.scrollTop = ClassDiv.scrollHeight;
    
    switch (category) {
      case "medical":
          ClassDiv.innerHTML += `このお客さまはヘルスケアの話をされていますが、お調べしましょうか?\r\n`;
          break;
      case "sports":
          ClassDiv.innerHTML += `この方はスポーツに関心がおありのようですが、何かお手伝いしましょうか?\r\n`;
          break;
      case "legal":
          ClassDiv.innerHTML += `この方は法律相談を希望されていますが、関係文書を探しましょうか?\r\n`;
          break;
      case "other":
        ClassDiv.innerHTML += `AI Assistant is here\r\n`;
        break;
    }
}