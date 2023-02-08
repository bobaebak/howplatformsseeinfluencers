//  load the platform type
url = location.href.split("?");
url_param = url[1].split(",");
platform = url_param[0];
document.getElementById("title").innerHTML = platform;

// Sketchfab Viewer API: Start/Stop the viewer
var version = "1.9.0";
var uid = "1607e8967cb34753978a8788fe586656";

/**
 * set the iframe, client 
 */
var iframes = [];
var clients = [];
var genreCount = 3;
for (let i=0 ; i<genreCount ; i++) {
    iframeComp = "api-frame" + (i+1);

    iframe = document.getElementById(iframeComp);
    client = new window.Sketchfab(version, iframe);

    iframes.push(iframe);
    clients.push(client);
}

var error = function () {
  console.error("Sketchfab API error");
};

/**
 * analysis senction components
 */
var analysis = [];
for (let i=0 ; i<genreCount ; i++) {
    analysisComp = "analysis" + (i+1);
    tempAnalysis = document.getElementById(analysisComp);
    analysis.push(tempAnalysis);
}


/**
 * object variables
 */
var idxNodes = 0;
var myNodesByNameFromMap = {};
var rootNodeTree = {};
var allNodes = [];

var targets = [];       // platform, genre, instanceID


var resultDataCount = 2;

// function csvLoad() {
//     file = "./test.csv";
//     csv = loadTable("file", 'csv','header');
//     console.log(csv);
//     // console.log(csvList);
// }

// csvLoad();



var success = function (api) {
    api.start(function () {
        api.addEventListener("viewerready", function () {
            api.getNodeMap(function (err, nodes) {
                if (!err) {
                    for (var instanceID in nodes) {
                        var node = nodes[instanceID];
                        var name = node.name;
                        if (!name) name = "noname_" + idxNodes++;
                            myNodesByNameFromMap[name] = node;
                    }

                    // alert("first");
                    //attempt to look for a 'root' - this seems to be present for OBJ or single object models
                    console.log(myNodesByNameFromMap);
                    rootNodeTree = myNodesByNameFromMap["root"].children[0];
                    console.log(rootNodeTree);

                    idxNodes = rootNodeTree.children.length;
                    // for (let i=0 ; i<idxNodes ; i++) {
                    //     var node = {
                    //         name: rootNodeTree.children[i].name,
                    //         instanceID: rootNodeTree.children[i].instanceID,
                    //     }
                    //     allNodes.push(node);
                    // }
                    rootNodeTree.children.forEach(function (rootNode) {
                        var node = {
                            name : rootNode.name,
                            instanceID : rootNode.instanceID
                        }
                        allNodes.push(node);
                    });
                    console.log(allNodes);

                    // // load platform of genres
                    // for(let i=0 ; i<allNodes.length ; i++) {
                    //     nodeNames = allNodes[i].name.split("_");
                    //     instanceID = allNodes[i].instanceID;
                    //     if (nodeNames[0] == platform) {
                    //         api.show(instanceID)
                    //         var genre = {
                    //             name: nodeNames[1],
                    //             instanceID: instanceID
                    //         }
                    //         genres.push(genre);
                    //     } else {
                    //         api.hide(instanceID);
                    //     }
                    // }
                    // console.log(genres);
                    
                    // make select tag list
                    // var selectList = document.getElementById("genres");
                    // for (let i=0 ; i<genres.length ; i++) {
                    //     const option = document.createElement("option");
                    //     option.text = genres[i].name;
                    //     option.value = genres[i].instanceID;
                    //     selectList.appendChild(option);
                        
                    //     // default set first option
                    //     if (i!=0) {
                    //         api.hide(genres[i].instanceID);
                    //     }
                    // }

                    // // add event 
                    // selectList.addEventListener('change', (event) => {
                    //     // const targetText = event.target.text;
                    //     const targetValue = event.target.value;
                    //     for (let i=0 ; i<genres.length ; i++) {
                    //         api.hide(genres[i].instanceID);
                    //         if (genres[i].instanceID == targetValue) {
                    //             api.show(targetValue);
                    //         }
                    //     }
                            
                    // });

                    // load the platform has same genre
                    for(let i=0 ; i<allNodes.length ; i++) {
                        nodeNames = allNodes[i].name.split("_");
                        nodePlatform = nodeNames[0];
                        nodeGenre = nodeNames[1];
                        
                        instanceID = allNodes[i].instanceID;
                        api.hide(instanceID);

                        if (nodePlatform == platform) {
                            var target = {
                                platform: nodePlatform,
                                genre: nodeGenre,
                                instanceID: instanceID
                            }
                            targets.push(target);
                        }
                    }
                    console.log(targets);
                    
                    // load the first genre here
                    api.show(targets[0].instanceID);

                    document.getElementById("genre1").innerHTML = targets[0].genre;                
                    document.getElementById("info1").innerHTML = getInfo(platform, targets[0].genre);
                    
                    var resultData = selectResultData(platform, targets[0].genre);                    
                    let keys = Object.keys(resultData);
                         
                    keys.forEach(key => {
                        const div = document.createElement("div");
                        div.setAttribute("id", (key + 1 + "title"));
                        div.setAttribute("class", "simple-btn");
                        div.innerHTML = "<a>" + key + "</a>";
                        document.querySelector("#analysis1").append(div);

                        const ul = document.createElement("ul");
                        ul.setAttribute("id", (key + 1));
                        document.querySelector("#analysis1").append(ul);

                        const li = document.createElement("li");

                        if (key == "skin_tone") {
                            colorPalette = []
                            resultData[key].forEach(function (colorArr) {
                                colorPalette.push(ConvertRGBtoHex(colorArr[0], colorArr[1], colorArr[2]));
                            });
                            console.log(colorPalette);
                            colorPalette.forEach(function (rgb) {
                                li.innerHTML += "<div style='width:25%; height:50px; float:left; background: " + rgb + "'></div>";
                            });
                            document.querySelector("#"+(key + 1)).append(li);
                            
                        } else {
                            li.innerHTML = resultData[key];
                            document.querySelector("#"+(key + 1)).append(li);
                        }
                        
                    });

                }
            });
            api.getAnnotationList(function(err, annotations) {
                if (!err) {
                    console.log(annotations);
                } 
            });

            // api.createAnnotationFromScenePosition(
            //     [0.07333798335727239, -0.18115339876829498, 0.2082234645002745],    //position: position of the annotation
            //     [1.176457020786434, -0.20316473451569528,-0.20035238536821615],     //eye: position of the camera when the annotation is selected
            //     [0.6233217677311507, -0.04476113834892233, -0.09734457065516634],   //target: camera when the annotation is selected
            //     'Eye',
            //     'eye color : <h1>dd</h1>',
            //     function(err, index) {
            //         if (!err) {
            //             window.console.log('Created new annotatation', index + 1);
            //         }
            //     }
            // );

        });
        

        // api.setEnableCameraConstraints(true, function (err) {
        //     if (err) return;
        // });
    });
    
};

var success2 = function (api) {
    api.start(function () {
        api.addEventListener("viewerready", function () {
            for(let i=0 ; i<allNodes.length ; i++) {
                instanceID = allNodes[i].instanceID;
                api.hide(instanceID);
            }

            api.show(targets[1].instanceID);

            document.getElementById("genre2").innerHTML = targets[1].genre;
            document.getElementById("info2").innerHTML = getInfo(platform, targets[1].genre);

            var resultData = selectResultData(platform, targets[1].genre);                    
            let keys = Object.keys(resultData);
                    
            keys.forEach(key => {
                const div = document.createElement("div");
                div.setAttribute("id", (key + 2 + "title"));
                div.setAttribute("class", "simple-btn");
                div.innerHTML = "<a>" + key + "</a>";
                document.querySelector("#analysis2").append(div);

                const ul = document.createElement("ul");
                ul.setAttribute("id", (key + 2));
                document.querySelector("#analysis2").append(ul);

                const li = document.createElement("li");

                if (key == "skin_tone") {
                    colorPalette = []
                    resultData[key].forEach(function (colorArr) {
                        colorPalette.push(ConvertRGBtoHex(colorArr[0], colorArr[1], colorArr[2]));
                    });
                    console.log(colorPalette);
                    colorPalette.forEach(function (rgb) {
                        li.innerHTML += "<div style='width:25%; height:50px; float:left; background: " + rgb + "'></div>";
                    });
                    document.querySelector("#"+(key + 2)).append(li);
                    
                } else {
                    li.innerHTML = resultData[key];
                    document.querySelector("#"+(key + 2)).append(li);
                }

                // li.innerHTML = "<li>" + resultData[key] + "</li>";
                // document.querySelector("#"+(key + 2)).append(li);

            });
        });
    });
};

var success3 = function (api) {
    api.start(function () {
        api.addEventListener("viewerready", function () {
            for(let i=0 ; i<allNodes.length ; i++) {
                instanceID = allNodes[i].instanceID;
                api.hide(instanceID);
            }

            api.show(targets[2].instanceID);

            document.getElementById("genre3").innerHTML = targets[2].genre;
            document.getElementById("info3").innerHTML = getInfo(platform, targets[2].genre);    

            var resultData = selectResultData(platform, targets[2].genre);                    
            let keys = Object.keys(resultData);
                 
            keys.forEach(key => {
                const div = document.createElement("div");
                div.setAttribute("id", (key + 3 + "title"));
                div.setAttribute("class", "simple-btn");
                div.innerHTML = "<a>" + key + "</a>";
                document.querySelector("#analysis3").append(div);

                const ul = document.createElement("ul");
                ul.setAttribute("id", (key + 3));
                document.querySelector("#analysis3").append(ul);

                const li = document.createElement("li");
                if (key == "skin_tone") {
                    colorPalette = []
                    resultData[key].forEach(function (colorArr) {
                        colorPalette.push(ConvertRGBtoHex(colorArr[0], colorArr[1], colorArr[2]));
                    });
                    console.log(colorPalette);
                    colorPalette.forEach(function (rgb) {
                        li.innerHTML += "<div style='width:25%; height:50px; float:left; background: " + rgb + "'></div>";
                    });
                    document.querySelector("#"+(key + 3)).append(li);
                    
                } else {
                    li.innerHTML = resultData[key];
                    document.querySelector("#"+(key + 3)).append(li);
                }

            });

        });
    });
};

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function initViwer() {
    clients[0].init(uid, {
        success: success,
        error: error,
        autostart: 1,
        preload: 1,
        transparent: 1,
        // camera: 100,
        
        scrollwhell: 0,
        ui_stop: 0,     // top of right x button remove  
        ui_controls: 0, // panel remove
        ui_fullscreen: 0,
        ui_general_controls: 0,
        ui_help: 0,
        ui_hint: 0,
        ui_infos: 0,
        ui_inspector:0, 
        ui_settings: 0,
        ui_start: 0,
        ui_vr: 0,
        ui_ar: 0,
        ui_ar_help:0, 
        ui_ar_qrcode:0,

        orbit_constraint_yaw_left : 80,
        orbit_constraint_yaw_right : 2,
        orbit_constraint_pitch_up : 10,
        orbit_constraint_pitch_down : 90
         


    })

    await sleep(6000); // 3초대기

    clients[1].init(uid, {
        success: success2,
        error: error,
        autostart: 1,
        preload: 1,
        transparent: 1,
        ui_stop: 0,
        ui_infos: 0,
        ui_controls: 0, // panel remove
    })

    await sleep(3000); // 3초대기

    clients[2].init(uid, {
        success: success3,
        error: error,
        autostart: 1,
        preload: 1,
        transparent: 1,
        ui_stop: 0,
        ui_infos: 0,
        ui_controls: 0, // panel remove
    })
}

initViwer();

