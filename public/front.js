let temp;
let videoList = [];

async function init() {
    await readCSV()
        .then(result => loadVideoLists());
}

// readCSV reads CSV file that contains information for streaming video (e.g.,
// title, CID, and thumbnail)
async function readCSV() {
    const csvFile = './video-list.csv';

    return new Promise(resolve => {
        d3.csv(csvFile, function(data) {
            for (var i=0; i<data.length; i++) {
                videoList.push(data[i]);
            }
            resolve('Successfully read CSV file');
        });
    })
}

// loadVideoLists loads video lists from the CSV file, and shows the lists
// on the web page
async function loadVideoLists() {
    for (var videoIndex=0; videoIndex<videoList.length; videoIndex++) {
        temp = `
            <div class="video-container" onclick="playVideo('${videoList[videoIndex].CID}')">
                <div><img class="thumbnail" src="${videoList[videoIndex].thumbnail}"></div>
                <div>${videoList[videoIndex].title}</div>
            </div>
        `;
        document.getElementById('video-lists').innerHTML += temp;
    }
}

function mainButton() {
    window.location.href = '/';
}

function playVideo(cid) {
    window.location.href = '/player?cid=' + cid;
}

function on() {
    document.getElementById("overlay").style.display = "block";
}

function off() {
    document.getElementById("overlay").style.display = "none";
}

window.onload = function() {
    $("#select-video-button").click(function () {
        $("#select-video").trigger('click');
    });
    $("#select-thumbnail-button").click(function () {
        $("#select-thumbnail").trigger('click');
    });

    init();
}
