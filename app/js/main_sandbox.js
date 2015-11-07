var my_sanbox_messageManager;
var svgAr={};
var intervalGif;
var codeToSend = "";
var editor;
var dragend;
var container_dragend;
var jscolor_input;

window.onload = function() {
  my_sanbox_messageManager = new sanbox_messageManager();
  // Add listener to postmessages
  if (window.addEventListener){
    addEventListener("message", my_sanbox_messageManager.listener, false);
  } else {
    attachEvent("onmessage", my_sanbox_messageManager.listener);
  }
  // send test postmessage
  my_sanbox_messageManager.sendTest();
  
  // load xml for textures
  var totalSVGModels = 5;
  for(i=1;i<(totalSVGModels+1);i++){
    console.log(totalSVGModels);
    getSVGSource(i,"models-butterflies-svg-last/butterfly"+i+".svg",sendSVGCanvas);
  }

  setupEditor();
  if(!getCookieForEditor() ){
    setDefaultCode();
  }

  toastr.options.positionClass = "toast-top-left";
  toastr.info('Hi welcome to tutorial');
  addKeyListenerSaveEditor();

  container_dragend = document.getElementById("help-div");
  dragend = new Dragend(container_dragend, {
    direction: "vertical",
    afterInitialize: function() {
      console.log("_dragend visible");
      console.log(container_dragend);
      container_dragend.className = "visible_help";
      setInterval(function () {
        var editor_container = document.getElementById("editor-div");
        editor_container.className = "visible_help";
      }, 1000);
    }
  });

  var colorPickerInput = document.getElementById("colorPicker");
  jscolor_input = new jscolor.color(colorPickerInput);
};

//
function showColorPicker(){
  console.log('open color picker');
  jscolor_input.showPicker();  
}

function addKeyListenerSaveEditor(){
  document.onkeydown = function(evt) {
    setCookie("editor", editor.getSession().getValue());
  };
}

function getCookie(name) {
  // Retrieve
  return localStorage.getItem(name);
}

function getCookieForEditor(){
  var cookieStored = getCookie("editor");
  if(cookieStored!=undefined){
    var codeStored = decodeURIComponent(cookieStored);
    console.log(codeStored);
    editor.getSession().setValue( codeStored );
    return true;
  }else{
    return false;
  }
}

function setCookie(name, value){
  // Store
  localStorage.setItem(name, value);
}

function sendCode(){
  var json = {'message':'unloadAndReload'};
  my_sanbox_messageManager.sendMessageToRender(json);
  codeToSend = editor.getSession().getValue();
  // get focus from input
  $( "#submit1" ).blur();
};

function sendRecord(){
  var json = {'message':'createGIF'};
  my_sanbox_messageManager.sendMessageToRender(json);
};

// code editor 
function setupEditor(){
  editor = ace.edit("editor");
  editor.setTheme("ace/theme/twilight");
  editor.getSession().setMode("ace/mode/javascript");

  document.getElementById('submit1').onclick = sendCode;
  //document.getElementById('submit2').onclick = sendRecord;
}

function saveCanvasToGif(canvas){
  myGifCreator.addFrame(canvas);
}

// send to iframe
var sendSVGCanvas = function(id,xmlContent){
  //console.log(id+" ==>"+xmlContent);
  var json = {'message':'svg_butterflies','id':id,'xml':xmlContent};
  my_sanbox_messageManager.sendMessageToRender(json);
};

// load svg
function getSVGSource(id,scriptPath,callback){
  if(window.XMLHttpRequest) {
      var xhr = new XMLHttpRequest(); 
      var scriptID = scriptID;    
      xhr.onreadystatechange = function() {
        if(xhr.status == 200 && xhr.readyState == 4) {
            var xmlContent = xhr.responseText;
            //console.log('The source code is:\n'+sourceCode);
            saveSVGInAr(id,xmlContent);
            callback(id,xmlContent);
        }
      }
      xhr.open("GET",scriptPath,true);
      xhr.send(null);
    }
};

function saveSVGInAr(id,xmlContent){
  svgAr[id] = xmlContent;
};
// send SVG when is load iframe
function iframeLoaded(){
  // send svg
  for(s in svgAr){
    sendSVGCanvas(s,svgAr[s]);
  }
}

function readyForSendCode(){
  if(codeToSend!=""){
    var json = {'message': "code-to-render",'code': codeToSend};
    my_sanbox_messageManager.sendMessageToRender(json);
  }
}

function reloadIframe(){
  document.getElementById('render-iframe').contentWindow.location.reload(true);
}

function successCompiling(){
  toastr.info('Congratulations. Code sucessfully compiled! ');
}

function showErrorCompiling(){
  toastr.error('There is one or more compilation errors.');
}

function showWarning(text){
  toastr.warning(text);
}

function setDefaultCode(){
  textEditor = "";
  /*
  textEditor += "mybutterfly = new butterfly();\r\n";
  textEditor += "mybutterfly.setHexColor('#0000FF');\r\n";
  textEditor += "mybutterfly.setScale(10.2);\r\n";
  textEditor += "mybutterfly.setShapeModel(2);\r\n";
  textEditor += "mybutterfly.setSpeed(0.01);\r\n";
  textEditor += "mybutterfly.setFlyMode(3);\r\n";
  textEditor += "mybutterfly.setPosition(0,10,0);\r\n";
  textEditor += "mybutterfly.setRotation(0,Math.radians(90),0);\r\n";
  */
  editor.getSession().setValue(textEditor);
}

function changeToFullscreen(){
  var img = document.getElementById('fullscreenButton-img');
  if (img.src.indexOf('open.png')!=-1) {
    img.src = 'imgs/close.png';
    // make fullscreen
    document.getElementById('help-div').style.display = "none";
    document.getElementById('editor-div').style.display = "none";
    document.getElementById('render-iframe').style.width = "1366px";
    document.getElementById('render-iframe').style.left = "0px";
    document.getElementById('fullscreenButton').alt = "Close fullscreen";
  }else{
    img.src = 'imgs/open.png';
    // out fullscreen
    document.getElementById('help-div').style.display = "inline";
    document.getElementById('editor-div').style.display = "inline";
    document.getElementById('render-iframe').style.width = "616px";
    document.getElementById('render-iframe').style.left = "0px";
    document.getElementById('fullscreenButton').alt = "Set fullscreen";
  }
}

function addWhiteLineEditor(){
  var  text = editor.getSession().getValue();
  var re=/\r\n|\n\r|\n|\r/g;
  var arrayofLines = text.replace(re,"\n").split("\n");
  var lastLineId = arrayofLines.length-1;
  var charactersLastLine = arrayofLines[lastLineId].length;
  if(charactersLastLine!=0){
    editor.getSession().setValue(text+'\n'); 
    editor.focus(); // To focus the ace editor
    var n = editor.getSession().getValue().split("\n").length ;
    editor.gotoLine(n); 
    editor.navigateLineEnd(); // Navigate to end of line
  }
}

function nextSlideHelp(){
  console.log("nextSlideHelp");
  dragend.swipe("up");
  addWhiteLineEditor();
}

function backSlideHelp(){
  console.log("backSlideHelp");
  dragend.swipe("down"); 
}

function resetCode(){
  var answer = confirm("Are you sure you want to delete code to start again?")
  if (answer){
    setDefaultCode();
    //save in cookies editor
    setCookie("editor", editor.getSession().getValue());
  }
}

function restartTutorial(){
  var answer = confirm("Are you sure you want to restart and delete code?")
  if (answer){
    toastr.info('Restarted the tutorial');
    setDefaultCode();
    dragend.jumpToPage(1);
  }
}

function openAboutProjectPage(){
  document.getElementById('videoPage').style.display = "inherit";
  document.getElementById('movie_player').src = "https://www.youtube.com/embed/MX0Z6aHZYDw?autoplay=1";
  document.getElementById('videoPage_title').innerHTML ="About the art project";
}

function openAboutArtistPage(){
  document.getElementById('videoPage').style.display = "inherit";
  document.getElementById('videoPage_title').innerHTML = "About the artists";
  document.getElementById('movie_player').src = "https://www.youtube.com/embed/S1Ta8AMbkGU?autoplay=1";
}

function closeAboutPage(){
  document.getElementById('videoPage').style.display = "none";
  document.getElementById('movie_player').src = "";
}
