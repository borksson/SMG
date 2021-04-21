let offsetGlobal = [0,0];

const FOE_TYPES = ["Zombie"];

let pauseState = false;

let pauseHeld = false;

let keyState = {};

let walkDist = 10; 

let keyStrikeSwitch = false;

let keySpellSwitch = false;

window.addEventListener('keydown',function(e){
    keyState[e.keyCode || e.which] = true;
},true);    
window.addEventListener('keyup',function(e){
    keyState[e.keyCode || e.which] = false;
},true);

function KeyTic () {
	console.log(keyState)
	if(keyState[27]){
		if(!pauseHeld){
			pauseState = !pauseState;
		}
	}
	if(!pauseState){
		if(keyState[87]){
			char.SetFacing("Back");
			offsetGlobal[1] += walkDist;
		}
		else if(keyState[65]){
			char.SetFacing("Left");
			offsetGlobal[0] += walkDist;
		}
		else if(keyState[83]){
			char.SetFacing("Front");
			offsetGlobal[1] -= walkDist;
		}
		else if(keyState[68]){
			char.SetFacing("Right");
			offsetGlobal[0] -= walkDist;
		}
		if(keyState[74] && char.GetStaminaPer() > 0){
			keyStrikeSwitch = true;
		}
		if(keyState[75] && char.GetMagicPer() > 0){
			keySpellSwitch = true;
		}
	}
	if(char.GetStaminaPer()<=0  && (keyState[87] || keyState[65] || keyState[83] || keyState[68])){
		walkDist = 5;
		char.SetWalkSpeed(1);
	}
	else if(keyState[13] && (keyState[87] || keyState[65] || keyState[83] || keyState[68])){
		walkDist = 20;
		char.SetWalkSpeed(3);
	}
	else if(keyState[87] || keyState[65] || keyState[83] || keyState[68] || keyState[27]){
		char.SetWalkSpeed(2);
		walkDist = 10;
		pauseHeld = true;
	}
	else{
		char.SetWalkSpeed(0);
		pauseHeld = false;
	}
}

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

function IsNumBetween(num, lessBound, moreBound) {
	if(num>=lessBound && num<=moreBound){
		return true;
	}
	else{
		return false;
	}
}

function IsPntBetween(pnt, lessBound, moreBound) {
	if(IsNumBetween(pnt[0], lessBound[0], moreBound[0]) && IsNumBetween(pnt[1], lessBound[1], moreBound[1])){
		return true;
	}
	else{
		return false;
	}
}

function HBCol(HB1, HB2) {
	if(IsPntBetween(HB1[0], HB2[0], HB2[2]) || IsPntBetween(HB1[1], HB2[0], HB2[2]) || IsPntBetween(HB1[2], HB2[0], HB2[2]) || IsPntBetween(HB1[3], HB2[0], HB2[2])){
		return true;
	}
	else{
		return false;
	}
}

function RelPosZone(altPos, core, colide, num) {
	if(Math.abs(core[0]-colide[0])-Math.abs(core[1]-colide[1]) >= 0){
		if(core[0]-colide[0] >= 0){
			return ArrayAdd(altPos, [-num,0]);
		}
		else if(core[0]-colide[0] <= 0){
			return ArrayAdd(altPos, [num,0]);
		}
	}
	else if(Math.abs(core[0]-colide[0])-Math.abs(core[1]-colide[1]) <= 0){
		if(core[1]-colide[1] >= 0){
			return ArrayAdd(altPos, [0,-num]);
		}
		else if(core[1]-colide[1] <= 0){
			return ArrayAdd(altPos, [0,num]);
		}
	}
}

function RelPosZoneStrike(altPos, core, colide) {
	if(Math.abs(core[0]-colide[0])-Math.abs(core[1]-colide[1]) >= 0){
		if(core[0]-colide[0] >= 0){
			return ArrayAdd(altPos, [40, 0])
		}
		else if(core[0]-colide[0] <= 0){
			return ArrayAdd(altPos, [-40, 0])
		}
	}
	else if(Math.abs(core[0]-colide[0])-Math.abs(core[1]-colide[1]) <= 0){
		if(core[1]-colide[1] >= 0){
			return ArrayAdd(altPos, [0,40])
		}
		else if(core[1]-colide[1] <= 0){
			return ArrayAdd(altPos, [0, -40])
		}
	}
}

function Char () {
	this.relPos = [282, 275];
	this.gridPos;
	this.local;
	this.HB;
	this.Initiate();
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

Char.prototype.SetGridPos = function() {
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

Char.prototype.Spell = function() {
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
		keySpellSwitch = false;
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
		keyStrikeSwitch = false;
	}
	else{
		this.StrikeSwitch++;
	};
};

Char.prototype.ColCheck = function(colGridPos) {
	if(this.isCol){
		offsetGlobal = RelPosZone(offsetGlobal, this.gridPos, colGridPos, 40);
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

Char.prototype.Initiate = function() {
	this.SetGridPos();
	this.SetLocal();
	this.SetHB();
};

Char.prototype.Update = function() {
	this.HealthCheck();
	this.StaminaCheck();
	this.MagicCheck();
	this.SetGridPos();
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

Char.prototype.Anim = function () {
	this.WalkAnim();
	this.HealthAnim();
	this.StaminaAnim();
	this.MagicAnim();
	if(keyStrikeSwitch){
		this.Strike();
	}
	if(keySpellSwitch){
		this.Spell();
	}
};


function BackTile (local, numType = 0) {
	this.local = local;
	this.relPos;
	this.SetRelPos(this.local);
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

BackTile.prototype.SetRelPos = function() {
	this.relPos = ArrayAdd(ArrayMult(this.local, 600), offsetGlobal)
};

BackTile.prototype.Update = function() {
	this.SetRelPos();
};

BackTile.prototype.Anim = function () {
	this.backTile.style.left = this.relPos[0] + "px";
	this.backTile.style.top = this.relPos[1] + "px";
};

BackTile.prototype.Remove = function () {
	this.backTile.remove();
};


function BackGround (currLocal) {
	this.backTiles = [];
	this.mainTain;
	this.SetMainTain(currLocal);
	this.GarbageCollect(currLocal);
};

BackGround.prototype = Object.create(BackGround.prototype)

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

BackGround.prototype.GarbageCollect = function (currLocal) {
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
			backTile = new BackTile(this.mainTain[i]);
			this.backTiles.push(backTile);
		}
	}
};

BackGround.prototype.Update = function(currLocal) {
	this.GarbageCollect(currLocal);
	for(var i=0; i<this.backTiles.length; i++) {
			this.backTiles[i].Update();
	}
};

BackGround.prototype.Anim = function() {
	for(var i=0; i<this.backTiles.length; i++) {
			this.backTiles[i].Anim();
	}
};


function FOE (local, gridPos, numType, colorType) {
	this.local = local;
	this.gridPos = gridPos;
	this.charSizeOffset = [-18,-25];
	this.relPos;
	this.SetRelPos();
	this.isCol;
	this.SetIsCol(false);
	this.HB;
	this.SetHB();
	this.healthPnts = 20;
	this.typeName = FOE_TYPES[numType];
	this.colorType = colorType;;
	this.switchBool = false;
	this.walkSpeed = 1;
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

FOE.prototype.SetRelPos = function() {
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

FOE.prototype.Update = function(targetPos, colGridPos) {
	this.ColCheck(colGridPos);
	this.SetRelPos();
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


//MAIN LOOP
//INIT
let foes = [];
let char = new Char();
let backGround = new BackGround(char.GetLocal());

let foe;

function FOEGen(num, colorType) {
	foe = new FOE([0,0],[num,200],0,colorType)
	foes.push(foe);
}

FOEGen(100, "health")
FOEGen(200, "magic")
FOEGen(300, "stamina")

let foesHBs = [];
for(var i=0; i<foes.length; i++){
	foesHBs.push(foes[i].GetHB());
}

function FOEisFOE(iter) {
	for(var i=0; i<foes.length; i++) {
		if(i!=iter && HBCol(foes[i].GetHB(), foes[iter].GetHB())){
			return i;
		}
	}
	return -1;
}

function ColUpdate() {
	for(var i=0; i<foes.length; i++){
		if(foes[i].GetHealth() <= 0){
			foes[i].Die();
			foes.splice(i, 1);
		}
		else if(char.GetStrikeHB()!=null && HBCol(foes[i].GetHB(), char.GetStrikeHB())){
			foes[i].SetIsCol(2);
		}
		else if(char.GetSpellHB()!=null && HBCol(foes[i].GetHB(), char.GetSpellHB())){
			foes[i].Die();
			foes.splice(i, 1);
		}
		else if(HBCol(char.GetHB(), foes[i].GetHB())){
			char.SetIsCol(true);
			foes[i].SetIsCol(1);
		}
		else if(foes.length>1 && FOEisFOE(i)!=-1){
			foes[i].SetIsCol(3);
			foes[i].ColCheck(foes[FOEisFOE(i)].GetGridPos())
		}
	}
}

function mainLoop() {
	document.getElementById("text").innerHTML = char.GetLocal();
	document.getElementById("text1").innerHTML = char.GetGridPos();
	document.getElementById("text2").innerHTML = char.GetHealthPer() + "%";
	KeyTic();
	if(!pauseState){
		//UPDATE
		ColUpdate();
		for(var i=0; i<foes.length; i++){
			foes[i].Update(char.GetRelPos(), char.GetGridPos());
			foes[i].Anim();
			char.ColCheck(foes[i].GetGridPos());
		}
		char.Update();
		backGround.Update(char.GetLocal());
		//ANIMATE
		char.Anim();
		backGround.Anim();
	}
}

var int = setInterval(mainLoop, 50);