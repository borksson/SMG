const DEFAULT_GEN = [[0,0],[0,1],[0,-1],[1,0],[1,1],[1,-1],[-1,0],[-1,1],[-1,-1]];
const FOE_TYPES = ["Zombie"];

var keyState = {};    
window.addEventListener('keydown',function(e){
    keyState[e.keyCode || e.which] = true;
},true);    
window.addEventListener('keyup',function(e){
    keyState[e.keyCode || e.which] = false;
},true);


function BackTile (local, numType = 0) {
	this.local = local;
	this.numType = numType;
	this.backTile = document.createElement("img");
	this.backTile.className = "Back";
	this.backTile.src = "Sprites//Tiles//Tile" + this.numType + ".png";
	document.getElementById("contain").prepend(this.backTile);
	this.backTile.style.left = this.local[0]*600 + "px";
	this.backTile.style.top = this.local[1]*600 + "px";
}

BackTile.prototype = Object.create(BackTile.prototype);

BackTile.prototype.GetLocal = function () {
	return this.local;
}
BackTile.prototype.Anim = function (centerPoint) {
	this.backTile.style.top = centerPoint[1] + this.local[1]*-600 + "px";
	this.backTile.style.left = centerPoint[0] + this.local[0]*-600 + "px";
}
BackTile.prototype.Remove = function () {
	this.backTile.remove();
}

function BackGround () {
	this.dirFace = "Front";
	this.walkSpeed = 0;
	this.walkDir = [0,0];
	this.centerPoint = [0,0];
	this.currLocal = [Math.floor(this.centerPoint[0]/600),Math.floor(this.centerPoint[1]/600)];
	this.backTiles = [];
	this.backTile;
	for(var i=0; i<DEFAULT_GEN.length; i++){
		this.backTile = new BackTile(DEFAULT_GEN[i]);
		this.backTiles.push(this.backTile);
	}
}

BackGround.prototype = Object.create(BackGround.prototype);

BackGround.prototype.SetWalkDir = function (walkDir) {
	this.walkDir = walkDir;
}

BackGround.prototype.SetWalkSpeed = function (walkSpeed) {
	this.walkSpeed = walkSpeed;
}

BackGround.prototype.GetCenterPoint = function () {
	return this.centerPoint;
}

BackGround.prototype.GetcurrLocal = function () {
	return this.currLocal;
}

BackGround.prototype.GetWalkSpeed = function () {
	return this.walkSpeed;
}

BackGround.prototype.GetMainTian = function () {
	return [
	[this.currLocal[0],this.currLocal[1]],
	[this.currLocal[0]+1,this.currLocal[1]],
	[this.currLocal[0]-1,this.currLocal[1]],
	[this.currLocal[0],this.currLocal[1]+1],
	[this.currLocal[0]+1,this.currLocal[1]+1],
	[this.currLocal[0]-1,this.currLocal[1]+1],
	[this.currLocal[0],this.currLocal[1]-1],
	[this.currLocal[0]+1,this.currLocal[1]-1],
	[this.currLocal[0]-1,this.currLocal[1]-1]
	];
}

BackGround.prototype.XequlsY = function (x, y) {
	for(var i=0; i<2; i++){
		if(x[i]!=y[i]){
			return false;
		}
	}
	return true;
}
BackGround.prototype.Contains = function (searchItem, searchList) {
	for(var i=0; i<searchList.length; i++){
		if(this.XequlsY(searchItem, searchList[i])){
			return true;
		}
	}
	return false;
}
BackGround.prototype.GarbageCollect = function () {
	locals = []
	for(var i=0; i<this.backTiles.length ; i++){
		if(!this.Contains(this.backTiles[i].GetLocal(), mainTain)) {
			this.backTiles[i].Remove();
			delete this.backTiles[i];
			this.backTiles.splice(i,1);
		}
		else{
			locals.push(this.backTiles[i].GetLocal())
		}
	}
	for(var i=0; i<mainTain.length ; i++){
		if(!this.Contains(mainTain[i], locals)){
			backTile = new BackTile(mainTain[i]);
			this.backTiles.push(backTile);
		}
	}
}
BackGround.prototype.Anim = function () {
	this.GarbageCollect();
	if(this.walkSpeed==1){
		this.currLocal = [Math.floor((this.centerPoint[0]+300)/600),Math.floor((this.centerPoint[1]+300)/600)]
		this.centerPoint[0] += this.walkDir[0];
		this.centerPoint[1] += this.walkDir[1];
	}
	for(var i=0; i<this.backTiles.length ; i++){
		this.backTiles[i].Anim(this.GetCenterPoint());
	}
}


function Char () {
	this.Facing = "Front";
	this.footSwitch = false;
	this.char = document.createElement("img");
	this.char.className = "Sprite";
	this.char.id = "Char";
	this.char.src = "Sprites//Character//" + this.Facing + ".png";
	document.getElementById("contain").append(this.char);
}

Char.prototype = Object.create(Char.prototype);

Char.prototype.SetFacing = function (Facing) {
	this.Facing = Facing;
}
Char.prototype.Anim = function (walkSpeed) {
	if(walkSpeed==1) {
		switch(this.footSwitch){
			case false:
			this.char.src = "Sprites//Character//" + this.Facing + "1.png";
			break;
			case true:
			this.char.src = "Sprites//Character//" + this.Facing + "2.png"
			break;
		}
	}
	else{
		this.char.src = "Sprites//Character//" + this.Facing + ".png";
	}
	this.footSwitch = !this.footSwitch;
}

//PROTOTYPING ZONE

function FOE (numType) {
	this.numType = numType;
	this.walkSpeed = 0;
	this.walkDir = [0,0];
	this.Facing = "Front";
	this.footSwitch = false;
	this.foe = document.createElement("img");
	this.foe.className = "Sprite";
	this.foe.src = "Sprites//FOE//" + FOE_TYPES[this.numType] + "//" + this.Facing + ".png";
	document.getElementById("contain").append(this.foe);
}

//PROTOTYPING ZONE

function KeyTic () {
	if(keyState[87]){
		char.SetFacing("Back");
		backGround.SetWalkDir([0,10]);
	}
	else if(keyState[65]){
		char.SetFacing("Left");
		backGround.SetWalkDir([10,0]);
	}
	else if(keyState[83]){
		char.SetFacing("Front");
		backGround.SetWalkDir([0,-10]);
	}
	else if(keyState[68]){
		char.SetFacing("Right");
		backGround.SetWalkDir([-10,0]);
	}
	if(keyState[87] || keyState[65] || keyState[83] || keyState[68]){
		backGround.SetWalkSpeed(1);
	}
	else{
		backGround.SetWalkSpeed(0);
	}
}

let backGround = new BackGround();
let char = new Char();

function mainLoop() {
	document.getElementById("text").innerHTML = backGround.GetCenterPoint();
	document.getElementById("text1").innerHTML = backGround.GetcurrLocal();
	KeyTic();
	backGround.Anim();
	char.Anim(backGround.GetWalkSpeed());
}

var int = setInterval(mainLoop, 100)