
// Handle errors.
let handleError = function(err){
    console.log("Error: ", err);
};

// Query the container to which the remote stream belong.
let remoteContainer = document.getElementById("remote-container");

// Add video streams to the container.
function addVideoStream(elementId){
    // Creates a new div for every stream
    let streamDiv = document.createElement("div");
    // Assigns the elementId to the div.
    streamDiv.id = elementId;
    /**
     * assigning class attribute 
     * to redesign remote videos
     */
     streamDiv.setAttribute("class","remote_video")

    // Takes care of the lateral inversion
    streamDiv.style.transform = "rotateY(180deg)";
    // Adds the div to the container.
    remoteContainer.appendChild(streamDiv);
};

// Remove the video stream from the container.
function removeVideoStream(elementId) {
    let remoteDiv = document.getElementById(elementId);
    if (remoteDiv) remoteDiv.parentNode.removeChild(remoteDiv);
};

let client = AgoraRTC.createClient( {
    mode: 'rtc',
    codec: 'vp8'
})

client.init("21a80c5b81844d1ea620aa78c50a9ce5", function() {
    console.log("client initialized");
}, function(err) {
    console.log("client init failed ", err);
});


client.join("00621a80c5b81844d1ea620aa78c50a9ce5IABJ1bXJcm4eyJVgQnkmpgRftzPnwsuhVFp00yJALhnhQwx+f9gAAAAAEADL5xHf+08GYgEAAQD7TwZi", 'test', null, (uid) => {
    let localStream = AgoraRTC.createStream({
        video:true,
        audio : true,
    });

    localStream.init( () => {
      localStream.play('me');
      client.publish(localStream, handleError);
    },handleError);
},handleError);

client.on('stream-added', function(evt) {
    client.subscribe(evt.stream , handleError);
})

client.on('stream-subscribed', (evt) => {
    let stream =evt.stream;
    let streamId = String(stream.getId());
    addVideoStream(streamId);
    stream.play(streamId);
})

client.on('stream-removed', function(evt){
    let stream =evt.stream;
    let streamId = String(stream.getId());
    stream.close();
    removeVideoStream(streamId);
});

client.on('peer-leave', function(evt){
    let stream =evt.stream;
    let streamId = String(stream.getId());
    stream.close();
    removeVideoStream(streamId);
});






