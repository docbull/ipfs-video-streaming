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
}
