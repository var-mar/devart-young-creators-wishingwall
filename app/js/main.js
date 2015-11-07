window.onfocus = function() { 

}

window.onblur = function() { 
 
}

window.onresize = function() {
  
}

window.onload = function() {
  // screens in the projectors
  var screenWidth =  1980;
  var screenHeigh =  1200;
  // window
  chrome.app.window.create('container.html', 
  {
    id: "Young-Creators-Wishing-Wall",
    frame: 'none',
    width:screenWidth, 
    height: screenHeigh,
  }, function(appwindow) {
  });
}
