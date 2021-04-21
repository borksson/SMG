var keyState = {};    
window.addEventListener('keydown',function(e){
    keyState[e.keyCode || e.which] = true;
},true);    
window.addEventListener('keyup',function(e){
    keyState[e.keyCode || e.which] = false;
},true);
var Char = document.getElementById("Char");
var Facing = "Front";
var walkSpeed = 0;
var walkDirect = [0,0];
var centerPoint = [300,300];
var currBlock = [Math.floor(centerPoint[0]/600),Math.floor(centerPoint[1]/600)];
var backTiles =  [];
function BackTile(local) {
	this.local = local;
	this.backTile = document.createElement("img");
	this.backTile.className = "Back";
	this.backTile.src = "Sprites//Background.png";
	document.getElementById("contain").prepend(this.backTile);
	this.backTile.style.top = this.local[1]*600 + "px";
	this.backTile.style.left = this.local[0]*600 + "px";
}
BackTile.prototype = Object.create(BackTile.prototype);

BackTile.prototype.GetLocal = function () {
	return this.local;
}
BackTile.prototype.Anim = function () {
	this.backTile.style.top = centerPoint[1] + this.local[1]*-600 - 300 + "px";
	this.backTile.style.left = centerPoint [0] + this.local[0]*-600 - 300 + "px";
}
BackTile.prototype.Remove = function () {
	this.backTile.remove();
}

var back;

var defaultGen = [
[0,0],
[0,1],
[0,-1],
[1,0],
[1,1],
[1,-1],
[-1,0],
[-1,1],
[-1,-1]
];

var mainTain = [];

for(var i=0; i<defaultGen.length; i++){
	back = new BackTile(defaultGen[i]);
	backTiles.push(back);
}

function XequlsY (x, y){
	for(var i=0; i<2; i++){
		if(x[i]!=y[i]){
			return false;
		}
	}
	return true;
}

function contains (searchItem, searchList) {
	for(var i=0; i<searchList.length; i++){
		if(XequlsY(searchItem, searchList[i])){
			return true;
		}
	}
	return false;
}

function garbageColect () {
	mainTain = [
	[currBlock[0],currBlock[1]],
	[currBlock[0]+1,currBlock[1]],
	[currBlock[0]-1,currBlock[1]],
	[currBlock[0],currBlock[1]+1],
	[currBlock[0]+1,currBlock[1]+1],
	[currBlock[0]-1,currBlock[1]+1],
	[currBlock[0],currBlock[1]-1],
	[currBlock[0]+1,currBlock[1]-1],
	[currBlock[0]-1,currBlock[1]-1]
	];
	locals = []
	for(var i=0; i<backTiles.length ; i++){
		if(!contains(backTiles[i].GetLocal(), mainTain)){
			backTiles[i].Remove();
			delete backTiles[i];
			backTiles.splice(i,1);
		}
		else{
			locals.push(backTiles[i].GetLocal())
		}
	}
	for(var i=0; i<mainTain.length ; i++){
		if(!contains(mainTain[i], locals)){
			back = new BackTile(mainTain[i]);
			backTiles.push(back);
		}
	}
}

function mainLoop() {
	if(keyState[87]){
		Facing = "Back";
		walkDirect = [0,10];
	}
	else if(keyState[65]){
		Facing = "Left";
		walkDirect = [10,0];
	}
	else if(keyState[83]){
		Facing = "Front";
		walkDirect = [0,-10];
	}
	else if(keyState[68]){
		Facing = "Right";
		walkDirect = [-10,0];
	}
	if(keyState[87] || keyState[65] || keyState[83] || keyState[68]){
		walkSpeed = 1;
	}
	else{
		walkSpeed = 0;
	}
	animateChar();
	garbageColect();
}
var int = setInterval(mainLoop, 100)
var footSwitch = false;
function animateChar() {
	footSwitch = !footSwitch;
	for(var i=0; i<backTiles.length ; i++){
		backTiles[i].Anim();
	}
	if(walkSpeed==1){
		currBlock = [Math.floor(centerPoint[0]/600),Math.floor(centerPoint[1]/600)]
		centerPoint[0] += walkDirect[0];
		centerPoint[1] += walkDirect[1];
		document.getElementById("text").innerHTML = centerPoint;
		document.getElementById("text1").innerHTML = currBlock;
		switch(footSwitch){
			case false:
			Char.src = "Sprites//Character//" + Facing + "1.png";
			break;
			case true:
			Char.src = "Sprites//Character//" + Facing + "2.png"
			break;
		}
	}
	else{
		Char.src = "Sprites//Character//" + Facing + ".png";
	}
}