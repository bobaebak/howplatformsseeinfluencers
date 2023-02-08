url = location.href.split("?");
platform = url[1].split(",")[0];
document.getElementById("platform").innerHTML = platform;

var jsonData = {};

// load the platform and its description 
async function loadJsonData() {
    await fetch('analysis.json')
        .then((response) => response.json())
        .then((data) => {
            jsonData = data;
            console.log(jsonData);

            setJsonData();

    });
}

loadJsonData();


function setJsonData() {

    // set the platform information
    document.getElementById("platform_info").innerHTML = jsonData.rendering_platform_info[platform];

    // let genres = Object.keys(description[platform]);
    let genres = Object.keys(jsonData.rendering_platform_genre[platform]);
    console.log("platform : "+ platform+ ", " + genres);

    // set the div area
    genres.forEach(function (genre, idx) {

        // set the model
        const model = document.querySelector('#viewer'+(idx+1));
        const modelName = "./glb/" + platform + "_" + genre + ".glb";
        model.setAttribute('src', modelName);
        
        document.getElementById("genre" + (idx+1)).innerHTML = genre;
        document.getElementById("info" + (idx+1)).innerHTML = jsonData.rendering_platform_genre[platform][genre];

        // set the detail area
        let details = jsonData.resultData[platform][genre];
        console.log(details);

        let keys = Object.keys(details);
        keys.forEach(key => {
            const div = document.createElement("div");
            div.setAttribute("id", (key + (idx+1) + "title"));
            div.setAttribute("class", "simple-btn");
            div.innerHTML = "<a>" + key + "</a>";
            document.querySelector("#analysis"+(idx+1)).append(div);

            const ul = document.createElement("ul");
            ul.setAttribute("id", (key + (idx+1)));
            document.querySelector("#analysis"+(idx+1)).append(ul);

            var li = document.createElement("li");
            // li.innerHTML = details[key];
            // document.querySelector("#"+(key + (idx+1))).append(li);

            if (key == "skintone") {
                details[key].forEach(function (colorArr) {
                    li.innerHTML += "<div style='width:25%; height:50px; float:left; background: rgb(" + colorArr[0] + ","+ colorArr[1] + "," + colorArr[2] + ")'></div>";
                });
                document.querySelector("#"+(key + (idx+1))).append(li);
                
            } else {
                li.innerHTML = details[key];
                document.querySelector("#"+(key + (idx+1))).append(li);
            }

        });

    });

    // set the prev button, after button
    prevButton = document.getElementById("prevButton");
    prevButton.addEventListener("click", function() {
        newUrl = url[0] + "?";
        const platforms = jsonData.platform;
        let idx = 0;
        platforms.forEach(function(value, i) {
            if (value == platform) {
                idx = i;
            }
        });
        
        if(idx == 0 ) {
            newUrl += platforms[8];
        } else {
            newUrl += platforms[idx-1];
        }

        location.href = newUrl;
    });

    // set the prev button, after button
    nextButton = document.getElementById("nextButton");
    nextButton.addEventListener("click", function() {
        newUrl = url[0] + "?";
        const platforms = jsonData.platform;
        let idx = 0;
        platforms.forEach(function(value, i) {
            if (value == platform) {
                idx = i;
            }
        });
        
        if(idx == 8 ) {
            newUrl += platforms[0];
        } else {
            newUrl += platforms[idx+1];
        }

        location.href = newUrl;
    });


}