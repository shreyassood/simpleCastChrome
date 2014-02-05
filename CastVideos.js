var session = null;
window.onload=function(){
//Check if CAST API Available
if (!chrome.cast || !chrome.cast.isAvailable) {
  setTimeout(initializeCastApi,1000);
}
}
function initializeCastApi() {
//Initialize using the default player
  var sessionRequest = new chrome.cast.SessionRequest(chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID);
  var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
    sessionListener,
    receiverListener);
  chrome.cast.initialize(apiConfig, onInitSuccess, onError);
};
function onInitSuccess(){
}
function onError(){
}
function onLaunchError(){
}
function receiverListener(e) {
//Check if Chromecast devices available
  if( e === 'available' ) {
	set("devices","Devices Exist");
	set("session","No existing session : Click me to launch session")
  }
  else set("devices","No Devices Exist");
}
function onRequestSessionSuccess(e) {
//New Session successfully created
      session = e;
	  con("created session");
	  set("media","No existing Media : Click on me to load media");
	  set("session","Created New Session");
 }
 function onMediaDiscovered(how, media) {
 //New or Existing media successfully recognized
   currentMedia = media;
   currentMedia.addUpdateListener(statechanged);
   con("Got media controls");
   document.getElementById("controls").style.display = "Block";
   con(media.media);
}
function statechanged(x){
//Change in media state (Play/Pause/Stop/Buffering)
console.log(currentMedia.playerState)
switch(currentMedia.playerState){
case "PLAYING":
set("play","");
set("pause","Pause");
set("buffer","");
break;
case "PAUSED":
set("play","Play");
set("pause","");
set("buffer","");
break;
case "BUFFERING":
set("buffer","buffering");
set("play","");
set("pause","");
break;
case "IDLE":
document.getElementById("controls").style.display = "none";
set("media","No existing Media : Click on me to load media");
break;
}
}
function sessionListener(e) {
  session = e;
    set("session","Found existing session");
	sessionav = true;
  if (session.media.length != 0) {
  con("Got media!");
  set("media","Found existing media : Click on me to reload/ load new media")
    onMediaDiscovered('onRequestSessionSuccess', session.media[0]);
  }
  else{
  set("media","No existing Media : Click on me to load media");
  }
}
function newSession(){
chrome.cast.requestSession(onRequestSessionSuccess, onLaunchError);
}
//Loads new media
function load(url,mime){
	  var mediaInfo = new chrome.cast.media.MediaInfo(url,mime);
	  mediaInfo.metadata = "Video";
var request = new chrome.cast.media.LoadRequest(mediaInfo);
set("media","Loading new media")
session.loadMedia(request,
   onMediaDiscovered.bind(this, 'loadMedia'),
    function errora(){console.log("Error loading media");});
}
function media(){
load("http://www.html5rocks.com/en/tutorials/video/basics/devstories.webm","video/webm");
}
//Short function for playing/pausing/stopping
function dao(a){
switch(a){
case 0:
	currentMedia.play(null,function(){},function(e){con("Error playing")});
	break;
case 1:
	currentMedia.pause(null,function(){},function(e){con("Error pausing")});
	break;
case 2:
	currentMedia.stop(null,function(){},function(e){con("Error stopping")});	
}
}
function con(a){console.log(a)} //Short Console.log function
function set(a,b){document.getElementById(a).innerHTML = b;} //Short function for changing content on the HTML Page