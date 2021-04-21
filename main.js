const FOE_TYPES = ["Zombie"];

const COLOR_TYPES = ["none", "health", "stamina", "magic"];

function ArrayMult(array, int) {
	let newArray = [];
	for(var i=0; i<array.length; i++){
		newArray.push(array[i]*int);
	}
	return newArray;
}

function ArrayDiv(array, int) {
	let newArray = [];
	for(var i=0; i<array.length; i++){
		newArray.push(Math.floor(array[i]/int));
	}
	return newArray;
}

function ArrayAdd(arrayA, arrayB) {
	let newArray = [];
	for(var i=0; i<arrayA.length; i++){
		newArray.push(arrayA[i]+arrayB[i]);
	}
	return newArray;
}

function ArrayAddNeg(arrayA, arrayB) {
	let newArray = [];
	for(var i=0; i<arrayA.length; i++){
		newArray.push(-arrayA[i]+arrayB[i]);
	}
	return newArray;
}

function IsValueInList(value, list) {
	for(var i=0; i<list.length; i++){
		if(value == list[i]){
			return true;
		}
	}
	return false;
}

function Char (offsetGlobal) {
	this.relPos = [282, 275];
	this.gridPos;
	this.local;
	this.HB;
	this.Initiate(offsetGlobal);
	this.isCol;
	this.SetIsCol(false); 
	this.healthFull = 100;
	this.healthPnts = 100;
	this.healthPer;
	this.healthBar = document.getElementById("Health");
	this.SetHealth(); 
	this.staminaFull = 25;
	this.staminaPnts = 25;
	this.staminaPer;
	this.staminaBar = document.getElementById("Stamina");
	this.staminaSwitch = 0;
	this.SetStamina();
	this.magicFull = 40;
	this.magicPnts = 40;
	this.magicPer;
	this.magicBar = document.getElementById("Magic");
	this.magicSwitch = 0;
	this.spellHB = null;
	this.spellMove;
	this.spellRelPos;
	this.spellGridPos;
	this.SetMagic();
	this.walkSpeed;
	this.SetWalkSpeed(0);
	this.Facing = "Front";
	this.footSwitch = 0;
	this.StrikeSwitch = 0;
	this.strikeHB = null;
	this.strike = document.createElement("img");
	this.strike.className = "strike";
	this.spell = document.createElement("img");
	this.spell.className = "spell";
	this.char = document.createElement("img");
	this.char.className = "Sprite";
	this.char.src = "Sprites//Character//" + this.Facing + ".png";
	document.getElementById("contain").append(this.char);
	this.char.style.left = this.relPos[0] + "px";
	this.char.style.top = this.relPos[1] + "px";
};

Char.prototype = Object.create(Char.prototype);

Char.prototype.GetSpellHB = function() {
	return this.spellHB;
};

Char.prototype.GetMagicPer = function() {
	return this.magicPer;
};

Char.prototype.GetStrikeHB = function() {
	return this.strikeHB;
};

Char.prototype.GetStaminaPer = function() {
	return this.staminaPer;
};

Char.prototype.GetHealthPer = function() {
	return this.healthPer;
};

Char.prototype.GetHB = function() {
	return this.HB;
};

Char.prototype.GetRelPos = function() {
	return this.relPos;
};

Char.prototype.GetGridPos = function() {
	return this.gridPos;
};

Char.prototype.GetLocal = function() {
	return this.local;
};

Char.prototype.SetIsCol = function(isCol) {
	this.isCol = isCol
};

Char.prototype.SetHB = function() {
	TR = ArrayAdd(this.gridPos, [25,0]);
	BR = ArrayAdd(this.gridPos, [25,50]);
	BL = ArrayAdd(this.gridPos, [0,50]);
	this.HB = [this.gridPos,TR, BR, BL];
};

Char.prototype.SetGridPos = function(offsetGlobal) {
	this.gridPos = ArrayAddNeg(offsetGlobal,[300,300]);
};

Char.prototype.SetLocal	= function() {
	this.local = ArrayDiv(this.gridPos, 600)
};

Char.prototype.SetWalkSpeed = function (walkSpeed) {
	this.walkSpeed = walkSpeed;
};

Char.prototype.SetFacing = function (Facing) {
	this.Facing = Facing;
};

Char.prototype.SetHealth = function() {
	this.healthPer = Math.round((this.healthPnts/this.healthFull)*100);
};

Char.prototype.SetStamina = function() {
	this.staminaPer = Math.round((this.staminaPnts/this.staminaFull)*100);
};

Char.prototype.SetMagic = function() {
	this.magicPer = Math.round((this.magicPnts/this.magicFull)*100);
};

Char.prototype.AddStamina = function(addedPnts) {
	this.staminaPnts += addedPnts;
	this.SetStamina();
};

Char.prototype.AddHealth = function(addedPnts) {
	this.healthPnts += addedPnts;
	this.SetHealth();
};

Char.prototype.AddMagic = function(addedPnts) {
	this.magicPnts += addedPnts;
	this.SetMagic();
};

Char.prototype.Spell = function(offsetGlobal) {
	if(this.magicSwitch == 0) {
		this.spell.src = "Sprites//Character//Magic.png";
		this.spell.style.left = 282 + "px";
		this.spell.style.top = 287 + "px";
		this.spellRelPos = [282, 287];
		this.spellGridPos = ArrayAddNeg(offsetGlobal, this.spellRelPos);
		document.getElementById("contain").append(this.spell);
		this.magicSwitch++;
		this.spellHB = [this.spellGridPos, ArrayAdd(this.spellGridPos, [25,0]), ArrayAdd(this.spellGridPos, [25,25]), ArrayAdd(this.spellGridPos, [0,25])];
		switch(this.Facing){
			case "Front":
				this.spellMove = [0,30];
			break;
			case "Back":
				this.spellMove = [0,-30];
			break;
			case "Left":
				this.spellMove = [-30,0];
			break;
			case "Right":
				this.spellMove = [30,0];
			break;
		}
		this.magicPnts -= 10;
		this.SetMagic();
	}
	else if (this.magicSwitch == 10){
		this.spell.parentNode.removeChild(this.spell);
		this.magicSwitch++;
	}
	else if (this.magicSwitch == 50){
		this.magicSwitch = 0;
		game.SetKeySpellSwitch(false);
	}
	else{
		this.spellRelPos = ArrayAdd(this.spellRelPos, this.spellMove);
		this.spellGridPos = ArrayAddNeg(offsetGlobal, this.spellRelPos);
		this.spell.style.left = this.spellRelPos[0] + "px";
		this.spell.style.top = this.spellRelPos[1] + "px";
		this.magicSwitch++;
		this.spellHB = [this.spellGridPos, ArrayAdd(this.spellGridPos, [25,0]), ArrayAdd(this.spellGridPos, [25,25]), ArrayAdd(this.spellGridPos, [0,25])];
	}
};

Char.prototype.Strike = function() {
	if(this.StrikeSwitch == 0){
		switch(this.Facing){
			//this.relPos = [282, 275];
			case "Front":
			this.strike.src = "Sprites//Character//DS.png";
			this.strike.style.left = 277 + "px";
			this.strike.style.top = 325 + "px";
			TL = ArrayAdd(this.gridPos, [0,50]);
			TR = ArrayAdd(this.gridPos, [25,50]);
			BR = ArrayAdd(this.gridPos, [25,80]);
			BL = ArrayAdd(this.gridPos, [0,80]);
			this.strikeHB = [TL,TR, BR, BL];
			break;
			case "Back":
			this.strike.src = "Sprites//Character//US.png";
			this.strike.style.left = 277 + "px";
			this.strike.style.top = 260 + "px";
			TL = ArrayAdd(this.gridPos, [-5,-30]);
			TR = ArrayAdd(this.gridPos, [30,-30]);
			BR = ArrayAdd(this.gridPos, [30,0]);
			BL = ArrayAdd(this.gridPos, [-5,0]);
			this.strikeHB = [TL,TR, BR, BL];
			break;
			case "Left":
			this.strike.src = "Sprites//Character//LS.png";
			this.strike.style.left = 267 + "px";
			this.strike.style.top = 275 + "px";
			TL = ArrayAdd(this.gridPos, [-30,0]);
			TR = ArrayAdd(this.gridPos, [0,0]);
			BR = ArrayAdd(this.gridPos, [0,50]);
			BL = ArrayAdd(this.gridPos, [-30,50]);
			this.strikeHB = [TL,TR, BR, BL];
			break;
			case "Right":
			this.strike.src = "Sprites//Character//RS.png";
			this.strike.style.left = 307 + "px";
			this.strike.style.top = 275 + "px";
			TL = ArrayAdd(this.gridPos, [25,0]);
			TR = ArrayAdd(this.gridPos, [65,0]);
			BR = ArrayAdd(this.gridPos, [65,50]);
			BL = ArrayAdd(this.gridPos, [25,50]);
			this.strikeHB = [TL,TR, BR, BL];
			break;
		}
		document.getElementById("contain").append(this.strike);
		this.staminaPnts -= 5;
		this.SetStamina();
		this.StrikeSwitch++;
	}
	else if (this.StrikeSwitch == 1) {
		this.strikeHB = null;
		this.StrikeSwitch++;
	}
	else if(this.StrikeSwitch == 5) {
		this.strike.parentNode.removeChild(this.strike);
		this.StrikeSwitch++;
	}
	else if(this.StrikeSwitch > 10) {
		this.StrikeSwitch = 0;
		game.SetKeyStrikeSwitch(false);
	}
	else{
		this.StrikeSwitch++;
	};
};

Char.prototype.ColCheck = function(colGridPos, offsetGlobal) {
	if(this.isCol){
		game.SetOffsetGlobal(RelPosZone(offsetGlobal, this.gridPos, colGridPos, 40));
		this.healthPnts -= 10;
		this.SetHealth();
		this.isCol = false;
	}
};

Char.prototype.HealthCheck = function() {
	if(this.healthPer <=0){
		console.log("GAME OVER");
		pauseState = true;
	}
	else if(this.healthPnts>this.healthFull){
		this.healthPnts = this.healthFull;
		this.SetHealth();
	}
};

Char.prototype.StaminaCheck = function() {
	if(this.staminaPer <=0){
		this.staminaSwitch++;
		if(this.staminaSwitch == 20){
			this.staminaSwitch = 0;
			this.staminaPnts = 5;
			this.SetStamina();
		}
	}
	else if(this.staminaPnts>this.staminaFull){
		this.staminaPnts = this.staminaFull;
		this.SetStamina();
	}
};

Char.prototype.MagicCheck = function() {
	if(this.magicPnts>this.magicFull){
		this.magicPnts = this.magicFull;
		this.SetMagic()
	}
};

Char.prototype.Initiate = function(offsetGlobal) {
	this.SetGridPos(offsetGlobal);
	this.SetLocal();
	this.SetHB();
};

Char.prototype.Update = function(offsetGlobal) {
	this.HealthCheck();
	this.StaminaCheck();
	this.MagicCheck();
	this.SetGridPos(offsetGlobal);
	this.SetLocal();
	this.SetHB();
};

Char.prototype.WalkAnim = function() {
	if(this.walkSpeed>=1) {
		switch(this.footSwitch){
			case 2:
			this.char.src = "Sprites//Character//" + this.Facing + "1.png";
			break;
			case 4:
			this.char.src = "Sprites//Character//" + this.Facing + "2.png"
			this.footSwitch = 0
			break;
		}
		this.footSwitch++;
		if(this.walkSpeed==3){
			this.staminaPnts--;
		}
		this.SetStamina();
	}
	else{
		this.char.src = "Sprites//Character//" + this.Facing + ".png";
	}
};

Char.prototype.HealthAnim = function() {
	this.healthBar.style.background = "linear-gradient(to right, red " + this.healthPer + "%, black 0%)";
};

Char.prototype.StaminaAnim = function() {
	this.staminaBar.style.background = "linear-gradient(to right, green " + this.staminaPer + "%, black 0%)";
};

Char.prototype.MagicAnim = function() {
	this.magicBar.style.background = "linear-gradient(to right, blue " + this.magicPer + "%, black 0%)";
};

Char.prototype.Anim = function (keyStrikeSwitch, keySpellSwitch, offsetGlobal) {
	this.WalkAnim();
	this.HealthAnim();
	this.StaminaAnim();
	this.MagicAnim();
	if(keyStrikeSwitch){
		this.Strike();
	}
	if(keySpellSwitch){
		this.Spell(offsetGlobal);
	}
};


function BackTile (local, offsetGlobal, numType = 0) {
	this.local = local;
	this.relPos;
	this.SetRelPos(offsetGlobal);
	this.numType = numType;
	this.backTile = document.createElement("img");
	this.backTile.className = "Back";
	this.backTile.src = "Sprites//Tiles//Tile" + this.numType + ".png";
	document.getElementById("contain").prepend(this.backTile);
	this.Anim();
};

BackTile.prototype = Object.create(BackTile.prototype);

BackTile.prototype.GetLocal = function() {
	return this.local;
};

BackTile.prototype.GetRelPos = function() {
	return this.relPos
};

BackTile.prototype.SetRelPos = function(offsetGlobal) {
	this.relPos = ArrayAdd(ArrayMult(this.local, 600), offsetGlobal)
};

BackTile.prototype.Update = function(offsetGlobal) {
	this.SetRelPos(offsetGlobal);
};

BackTile.prototype.Anim = function () {
	this.backTile.style.left = this.relPos[0] + "px";
	this.backTile.style.top = this.relPos[1] + "px";
};

BackTile.prototype.Remove = function () {
	this.backTile.remove();
};


function BackGround (currLocal, offsetGlobal) {
	this.backTiles = [];
	this.mainTain;
	this.SetMainTain(currLocal);
	this.GarbageCollect(currLocal, offsetGlobal);
};

BackGround.prototype = Object.create(BackGround.prototype)

BackGround.prototype.GetMainTain = function() {
	return this.mainTain;
};

BackGround.prototype.SetMainTain = function (currLocal) {
	this.mainTain = [
	[currLocal[0],currLocal[1]],
	[currLocal[0]+1,currLocal[1]],
	[currLocal[0]-1,currLocal[1]],
	[currLocal[0],currLocal[1]+1],
	[currLocal[0]+1,currLocal[1]+1],
	[currLocal[0]-1,currLocal[1]+1],
	[currLocal[0],currLocal[1]-1],
	[currLocal[0]+1,currLocal[1]-1],
	[currLocal[0]-1,currLocal[1]-1]
	];
};

BackGround.prototype.XequlsY = function (x, y) {
	for(var i=0; i<2; i++){
		if(x[i]!=y[i]){
			return false;
		}
	}
	return true;
};

BackGround.prototype.Contains = function (searchItem, searchList) {
	for(var i=0; i<searchList.length; i++){
		if(this.XequlsY(searchItem, searchList[i])){
			return true;
		}
	}
	return false;
};

BackGround.prototype.GarbageCollect = function (currLocal, offsetGlobal) {
	this.SetMainTain(currLocal);
	locals = []
	if(this.backTiles.length != 0){
		for(var i=0; i<this.backTiles.length ; i++){
			if(!this.Contains(this.backTiles[i].GetLocal(), this.mainTain)) {
				this.backTiles[i].Remove();
				delete this.backTiles[i];
				this.backTiles.splice(i,1);
			}
			else{
				locals.push(this.backTiles[i].GetLocal())
			}
		}
	}
	for(var i=0; i<this.mainTain.length ; i++){
		if(!this.Contains(this.mainTain[i], locals)){
			backTile = new BackTile(this.mainTain[i], offsetGlobal);
			this.backTiles.push(backTile);
		}
	}
};

BackGround.prototype.Update = function(currLocal,offsetGlobal) {
	this.GarbageCollect(currLocal);
	for(var i=0; i<this.backTiles.length; i++) {
			this.backTiles[i].Update(offsetGlobal);
	}
};

BackGround.prototype.Anim = function() {
	for(var i=0; i<this.backTiles.length; i++) {
			this.backTiles[i].Anim();
	}
};


function FOE (local, gridPos, numType, colorType, offsetGlobal) {
	this.local = local;
	this.gridPos = gridPos;
	this.charSizeOffset = [-18,-25];
	this.relPos;
	this.SetRelPos(offsetGlobal);
	this.isCol;
	this.SetIsCol(false);
	this.HB;
	this.SetHB();
	this.healthPnts = 20;
	this.typeName = FOE_TYPES[numType];
	this.colorType = COLOR_TYPES[colorType];
	this.switchBool = false;
	this.walkSpeed = 0;
	this.footSwitch = 0;
	this.Facing = "Front";
	this.foe = document.createElement("img");
	this.foe.className = "Sprite";
	this.foe.src = "Sprites//FOE//" + this.typeName + "//" + this.Facing + ".png";
	document.getElementById("contain").append(this.foe);
	this.SetColorType()
	this.Anim();
}

FOE.prototype = Object.create(FOE.prototype)

FOE.prototype.GetLocal = function() {
	return this.local;
};

FOE.prototype.GetHealth = function() {
	return this.healthPnts;
};

FOE.prototype.GetRelPos = function() {
	return this.relPos;
};

FOE.prototype.GetHB = function() {
	return this.HB;
};

FOE.prototype.GetGridPos = function() {
	return this.gridPos;
};

FOE.prototype.SetWalkSpeed = function(walkSpeed) {
	this.walkSpeed = walkSpeed;
};

FOE.prototype.SetColorType = function() {
	switch(this.colorType){
		case "stamina":
			this.foe.style.background = "rgba(0,255,0,0.5)";
		break;
		case "magic":
			this.foe.style.background = "rgba(0,0,255,0.5)";
		break;
		case "health":
			this.foe.style.background = "rgba(255,0,0,0.5)";
		break;
	}
};

FOE.prototype.SetIsCol = function(isCol) {
	this.isCol = isCol
};

FOE.prototype.SetHB = function() {
	TR = ArrayAdd(this.gridPos, [25,0]);
	BR = ArrayAdd(this.gridPos, [25,50]);
	BL = ArrayAdd(this.gridPos, [0,50]);
	this.HB = [this.gridPos,TR, BR, BL];
};

FOE.prototype.SetRelPos = function(offsetGlobal) {
	this.relPos = ArrayAdd(ArrayAdd(ArrayAdd(ArrayMult(this.local, 600), this.gridPos),offsetGlobal),this.charSizeOffset);
};

FOE.prototype.SetGridPos = function(targetPos) {
	if(this.walkSpeed==1){
		this.switchBool = !this.switchBool;
		switch(this.switchBool){	
			case false:
				if(targetPos[0]>this.relPos[0]){
					this.gridPos[0] += 5;
					this.Facing = "Right";
				}
				else if(targetPos[0]<this.relPos[0]){
					this.gridPos[0] -= 5;
					this.Facing = "Left";
				}
			break;
			case true:
				if(targetPos[1]>this.relPos[1]){
					this.gridPos[1] += 5;
					this.Facing = "Front";
				}
				else if(targetPos[1]<this.relPos[1]){
					this.gridPos[1] -= 5;
					this.Facing = "Back";
				}
			break;
		}
	}
};

FOE.prototype.ColCheck = function(colGridPos) {
	if(this.isCol==2){
		this.gridPos = RelPosZoneStrike(this.gridPos, this.gridPos, colGridPos);
		this.healthPnts -= 10;
		this.isCol = 0;
	}
	else if(this.isCol==1){
		this.gridPos = RelPosZone(this.gridPos, this.gridPos, colGridPos, -5);
		this.isCol = 0;
	}
	else if(this.isCol==3){
		this.gridPos = RelPosZone(this.gridPos, this.gridPos, colGridPos, -5)
		this.isCol = 0;
	}
};

FOE.prototype.Update = function(targetPos, colGridPos, offsetGlobal) {
	this.ColCheck(colGridPos);
	this.SetRelPos(offsetGlobal);
	this.SetGridPos(targetPos);
	this.SetHB();
};

FOE.prototype.Anim = function() {
	if(this.walkSpeed==1) {
		switch(this.footSwitch){
			case 10:
			this.foe.src = "Sprites//FOE//" + this.typeName + "//" + this.Facing + "1.png";
			break;
			case 20:
			this.foe.src = "Sprites//FOE//" + this.typeName + "//" + this.Facing + "2.png";
			this.footSwitch = 0
			break;
		}
		this.footSwitch++;
	}
	else{
		this.foe.src = "Sprites//FOE//" + this.typeName + "//" + this.Facing + ".png";
	}
	this.foe.style.left = this.relPos[0] + "px";
	this.foe.style.top = this.relPos[1] + "px";
};

FOE.prototype.Die = function() {
	this.foe.parentNode.removeChild(this.foe);
	switch(this.colorType){
		case "stamina":
			char.AddStamina(10); 
		break;
		case "magic":
			char.AddMagic(10);
		break;
		case "health":
			char.AddHealth(20);
		break;
	}
};


var keyState = {};

window.addEventListener('keydown',function(e){
  keyState[e.keyCode || e.which] = true;
},true);    
window.addEventListener('keyup',function(e){
  keyState[e.keyCode || e.which] = false;
},true);


function Game () {
	this.keyState = {};
	this.offsetGlobal = [0,0];
	this.pauseState = false;
	this.pauseHeld = false;
	this.walkDist = 10;
	this.keyStrikeSwitch = false;
	this.keySpellSwitch = false;
	this.foes = [];
	this.foesHBs = [];
	this.char = new Char(this.offsetGlobal);
	this.backGround = new BackGround(this.char.GetLocal(), this.offsetGlobal);
	this.foe;
}

Game.prototype = Object.create(Game.prototype);

Game.prototype.SetKeyStrikeSwitch = function(keyStrikeSwitch) {
	this.keyStrikeSwitch = keyStrikeSwitch;
};

Game.prototype.SetKeySpellSwitch = function(keySpellSwitch) {
	this.keySpellSwitch = keySpellSwitch;
};

Game.prototype.SetOffsetGlobal = function(offsetGlobal) {
	this.offsetGlobal = offsetGlobal;
};

Game.prototype.GetOffsetGlobal = function() {
	return	this.offsetGlobal;
};

Game.prototype.KeyTic = function() {
	this.keyState = keyState;
	if(this.keyState[27]){
		if(!this.pauseHeld){
			this.pauseState = !this.pauseState;
		}
	}
	if(!this.pauseState){
		if(this.keyState[87]){
			this.char.SetFacing("Back");
			this.offsetGlobal[1] += this.walkDist;
		}
		else if(this.keyState[65]){
			this.char.SetFacing("Left");
			this.offsetGlobal[0] += this.walkDist;
		}
		else if(this.keyState[83]){
			this.char.SetFacing("Front");
			this.offsetGlobal[1] -= this.walkDist;
		}
		else if(this.keyState[68]){
			this.char.SetFacing("Right");
			this.offsetGlobal[0] -= this.walkDist;
		}
		if(this.keyState[74] && this.char.GetStaminaPer() > 0){
			this.keyStrikeSwitch = true;
		}
		if(this.keyState[75] && this.char.GetMagicPer() > 0){
			this.keySpellSwitch = true;
		}
	}
	if(this.char.GetStaminaPer()<=0  && (this.keyState[87] || this.keyState[65] || this.keyState[83] || this.keyState[68])){
		this.walkDist = 5;
		this.char.SetWalkSpeed(1);
	}
	else if(this.keyState[13] && (this.keyState[87] || this.keyState[65] || this.keyState[83] || this.keyState[68])){
		this.walkDist = 20;
		this.char.SetWalkSpeed(3);
	}
	else if(this.keyState[87] || this.keyState[65] || this.keyState[83] || this.keyState[68] || this.keyState[27]){
		this.char.SetWalkSpeed(2);
		this.walkDist = 10;
		this.pauseHeld = true;
	}
	else{
		this.char.SetWalkSpeed(0);
		this.pauseHeld = false;
	}
};

Game.prototype.FOEGen = function(local, gridPos, numType, colorType) {
	this.foe = new FOE(local,gridPos,numType,colorType,this.offsetGlobal)
	this.foes.push(this.foe);
};

Game.prototype.foesHBsSet = function() {
	for(var i=0; i<this.foes.length; i++){
		this.foesHBs.push(this.foes[i].GetHB());
	}
};

Game.prototype.FOEisFOE = function(iter) {
	for(var i=0; i<this.foes.length; i++) {
		if(i!=iter && this.HBCol(foes[i].GetHB(), foes[iter].GetHB())){
			return i;
		}
	}
	return -1;
};

Game.prototype.IsNumBetween = function(num, lessBound, moreBound) {
	if(num>=lessBound && num<=moreBound){
		return true;
	}
	else{
		return false;
	}
};

Game.prototype.IsPntBetween = function(pnt, lessBound, moreBound) {
	if(this.IsNumBetween(pnt[0], lessBound[0], moreBound[0]) && this.IsNumBetween(pnt[1], lessBound[1], moreBound[1])){
		return true;
	}
	else{
		return false;
	}
};

Game.prototype.HBCol = function(HB1, HB2) {
	if(this.IsPntBetween(HB1[0], HB2[0], HB2[2]) || this.IsPntBetween(HB1[1], HB2[0], HB2[2]) || this.IsPntBetween(HB1[2], HB2[0], HB2[2]) || this.IsPntBetween(HB1[3], HB2[0], HB2[2])){
		return true;
	}
	else{
		return false;
	}
};

Game.prototype.ColUpdate = function() {
	for(var i=0; i<this.foes.length; i++){
		if(this.foes[i].GetHealth() <= 0){
			this.foes[i].Die(this.char);
			this.foes.splice(i, 1);
		}
		else if(this.char.GetStrikeHB()!=null && this.HBCol(this.foes[i].GetHB(), this.char.GetStrikeHB())){
			this.foes[i].SetIsCol(2);
		}
		else if(this.char.GetSpellHB()!=null && this.HBCol(this.foes[i].GetHB(), this.char.GetSpellHB())){
			this.foes[i].Die(this.char);
			this.foes.splice(i, 1);
		}
		else if(this.HBCol(this.char.GetHB(), this.foes[i].GetHB())){
			this.char.SetIsCol(true);
			this.foes[i].SetIsCol(1);
		}
		else if(this.foes.length>1 && this.FOEisFOE(i)!=-1){
			this.foes[i].SetIsCol(3);
			this.foes[i].ColCheck(foes[this.FOEisFOE(i)].GetGridPos());
		}
	}
};

Game.prototype.FoePause = function(foe) {
	if(foe.GetLocal() == this.char.GetLocal()){
		foe.SetWalkSpeed(1);
	}
	else if(!IsValueInList(foe.GetLocal(), this.backGround.GetMainTain())){
		foe.Die();
		delete foe;
	}
};

Game.prototype.mainLoop = function() {
	this.KeyTic();
	if(!this.pauseState){
		//UPDATE
		this.ColUpdate();
		for(var i=0; i<this.foes.length; i++){
			//this.FoePause(this.foes[i]);
			this.foes[i].Update(this.char.GetRelPos(), this.char.GetGridPos(), this.offsetGlobal);
			this.foes[i].Anim();
			this.char.ColCheck(this.foes[i].GetGridPos(), this.Game);
		}
		this.char.Update(this.offsetGlobal);
		this.backGround.Update(this.char.GetLocal(), this.offsetGlobal);
		//ANIMATE
		this.char.Anim(this.keyStrikeSwitch, this.keySpellSwitch, this.offsetGlobal);
		this.backGround.Anim();
	}
};

let game = new Game();

game.FOEGen([0,0], [200,200], 0, 0);

int = setInterval(() => game.mainLoop(), 50);