var points=[],_letter='A',_letterarray = Object(),c=document.getElementById("myCanvas"),ctx=c.getContext("2d");
show();
function show () {

	points.length = 0;
	_letterarray = Object(jsonobj[_letter]);

	for (var i = 0; i < _letterarray.length; i++) {
		var p = {};
		if (_letterarray[i].c1x) {
			p = {x:200,y:200,c1x:200,c1y:200,c2x:200,c2y:200,bazier:true}
		}
		else{
			p={x:200,y:200,bazier:false}
		}
		points.push(p);
	};

	TweenLite.ticker.addEventListener("tick", drawAllDots);
	animate();
};

function drawAllDots(){
	ctx.clearRect(0,0,400,400);
	ctx.beginPath();
	ctx.fillStyle = "rgba(252,60,14,1)";
	drawLetter(points);
};

function drawLetter (_points) {
	ctx.moveTo(_points[0].x,_points[0].y);
	for (var i = 1; i < _points.length; i++) {
		if(_points[i].bazier){
			ctx.bezierCurveTo(_points[i].c1x, _points[i].c1y, _points[i].c2x, _points[i].c2y, _points[i].x, _points[i].y);
		}
		else{
			ctx.lineTo(_points[i].x,_points[i].y);
		}
	};
	ctx.closePath();
	ctx.fill();
};

function animate () {

	for (var i = 0; i < _letterarray.length; i++) {
		var _t = Math.floor(Math.random()*10)/10+1;
		 if(_letterarray[i].c1x){
		 	TweenLite.to(points[i],_t,{x:_letterarray[i].x,y:_letterarray[i].y,c1x:_letterarray[i].c1x,c1y:_letterarray[i].c1y,c2x:_letterarray[i].c2x,c2y:_letterarray[i].c2y,ease:Elastic.easeOut});
		 }
		 else{
			TweenLite.to(points[i],_t,{x:_letterarray[i].x,y:_letterarray[i].y,ease:Elastic.easeOut});
			
		 }
				
	};
};




document.onkeypress = function(evt) {
     evt = (evt) ? evt : event;
       var charCode = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode :((evt.which) ? evt.which : 0));

		if ((charCode > 64 &&  charCode < 91) || (charCode > 96 &&  charCode < 123)){
			  _letter=String.fromCharCode(charCode).toUpperCase();
			  show();
		};

};