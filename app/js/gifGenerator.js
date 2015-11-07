/*
Gif Generation Object
Wishing wall - Devart Google Commission
Mar Canet & Varvara
2014
*/
var gifCreator = function (){
	this.frameCount = 0;
	this.blobURLSupport = ((_ref2 = window.URL) != null ? _ref2.createObjectURL : void 0) != null;
	
	this.maxiumFrame = 10;
	this.state = "Stop";
	this.debug = true;
	this.gif = new GIF({
		workers: 2,
		quality: 100,
		/*transparent:true,*/
		workerScript:'gif.worker.js'
	});
	var self = this;

	this.gif.on('finished', function(blob, data) {
		
		if (self.blobURLSupport) {
			var renderimg = document.getElementById("render-gif");
			renderimg.src = URL.createObjectURL(blob);
			if(self.debug){
				console.log("blob");
			}
		}
		
		self.saveAndDownload(blob);
		document.getElementById("threejs").style.display = "inline";
	});

	this.saveAndDownload = function (blob){
		this.state = "Saving";
		var fileName = "exported.gif";
		var a = document.createElement("a");
	    document.body.appendChild(a);
	    a.style = "display: none";
		url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
	};
	
	this.startRecord = function (){
		self.intervalGif = window.setInterval(function(){
			self.saveFrame();
		},200);
		this.state = "Recording";
	};
	
	this.saveFrame = function (){
		this.frameCount += 1;
		if(this.maxiumFrame>0 && this.frameCount==this.maxiumFrame){
			this.state = "Rendering";
			window.clearInterval(this.intervalGif);
			self.gif.render();
			if(this.debug){
				console.log("call render");
			}
		}else{
			self.gif.addFrame(document.getElementById("threejs"), {delay: 200});
			if(this.debug){
				console.log("add frame");
			}
		}
	};
	
	this.addFrame = function(frame){
		self.gif.addFrame(frame, {delay: 300});
	};

	this.render = function(){
		self.gif.render();
	};

};




// alternatives
//* https://github.com/antimatter15/jsgif