// ----------------------------------------------------------------
// Container
// ----------------------------------------------------------------
function sanbox_messageManager(){
	this.iframe_render = document.getElementById('render-iframe').contentWindow;
  this.debug = true;
  var self = this;
  
  // Messaging system
  this.listener = function (e){
      var json = e.data;
      console.log("Received json:");
      console.log(json);
      if(typeof(e.data)=='object' && e.data.message=='canvasForGif'){
        saveCanvasToGif(e.data.canvas);
      }
  };

  this.sendTest = function (){
    this.sendMessageToRender('initialization');
    if(this.debug)
    {
  	 console.log("send");
    }
  };

  this.sendMessageToRender = function(message){
    this.iframe_render.postMessage(message, '*'); 
  };
}

// ----------------------------------------------------------------
// Render
// ----------------------------------------------------------------

function render_messageManager(){
  var self = this;
  // Receive messages
  this.handleResponse = function(e) {
    if(typeof(e.data)!='object' && e.data=="initialization"){
      self.eventSource = event.source;
      self.eventOrigin = event.origin;
      console.log("render: initialization");
      event.source.postMessage("test-render", self.eventOrigin);
    }

    if(typeof(e.data)=='object' && e.data.message=='svg_butterflies'){
      saveButterFlySVG(e.data.xml);
    }
    
    if(typeof(e.data)=='object' && e.data.message=='code-to-render'){
      renderCode(e.data.code);
    }

    if(typeof(e.data)=='object' && e.data.message=='get-render-frame'){
      sendThreejsCanvasData();
    }

    if(typeof(e.data)=='object' && e.data.message=='createGIF'){
      createGif();
    }
    
    if(typeof(e.data)=='object' && e.data.message=='unloadAndReload'){
      unload();
    }

    console.log("render:"+typeof(e.data));
  };
  // Send messages
  this.sendMessage = function(json) {
    console.log(this.eventOrigin);
    self.eventSource.postMessage(json, self.eventOrigin);
  };
  window.addEventListener('message', this.handleResponse, false);
}