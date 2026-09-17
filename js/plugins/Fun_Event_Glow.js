//=============================================================================
// Fun_Event_Glow.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 一个可以发光的事件
 * @author 希夷先生
 *
 * @help
 * 插件功能：一个可以发光的事件
*/
(() => {

//=============================存档功能======================================
const _Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
    _Game_System_initialize.call(this);
	this._glow = [];
};

Bitmap.prototype.drawGlowCircle = function(cx,cy,r,color1,color2){
    const ctx = this.context;
    ctx.save();
    const grad = ctx.createRadialGradient(cx,cy,0,cx,cy,r);
    grad.addColorStop(0, color1);
    grad.addColorStop(0.5, color1);
    grad.addColorStop(1, color2);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.fill();
    ctx.restore();
    this._baseTexture.update();
};


//=============================在这里初始化得到 character======================================
const _Sprite_Character_prototype_setCharacter = Sprite_Character.prototype.setCharacter;
Sprite_Character.prototype.setCharacter = function(character) {
	_Sprite_Character_prototype_setCharacter.call(this, character);
	if (character instanceof Game_Event) {
		this._glow_sprite = new Sprite();
		this._glow_sprite.r = 255;
		this._glow_sprite.g = 255;
		this._glow_sprite.b = 255;
		this._glow_sprite.t = 0;
		this.addChild(this._glow_sprite);
	}
	
	
};

const _Game_Event_prototype_initialize = Game_Event.prototype.initialize;
Game_Event.prototype.initialize = function(mapId, eventId) {
	_Game_Event_prototype_initialize.call(this, mapId, eventId);
	if(!$gameSystem._glow){
		$gameSystem._glow = [];
	}
	let item = $gameSystem._glow.find(ev=> ev.mapId === mapId && ev.eventId === eventId);
	if(!item){
		//初始化数据
		$gameSystem._glow.push({
			mapId: mapId,
			eventId: eventId, 
			_glow: false
		});
	}
	
	item = $gameSystem._glow.find(ev=> ev.mapId === mapId && ev.eventId === eventId);
	this._glow = item._glow;
	
};

Game_Interpreter.prototype.openGlow = function() {
	const event = this.character(0);
    if(!event) return;
	if(event._glow){
		return;
	}
	const item = $gameSystem._glow.find(ev=> ev.mapId === event._mapId && ev.eventId === event.eventId());
	if(item){
		item._glow = true;
		event._glow = true;
	}
};

Game_Interpreter.prototype.closeGlow = function() {
	const event = this.character(0);
    if(!event) return;
	if(!event._glow){
		return;
	}
	const item = $gameSystem._glow.find(ev=> ev.mapId === event._mapId && ev.eventId === event.eventId());
	if(item){
		item._glow = false;
		event._glow = false;
		const sp = getEventSprite(event);
		if(sp && sp._glow_sprite){
			sp._glow_sprite.bitmap?.clear();
		}
	}
};


//创建事件名字精灵
Sprite_Character.prototype.createGlowBitmap = function() {
	if(!this._glow_sprite){
		return;
	}
	if (this._glow_sprite.bitmap) {
		this._glow_sprite.bitmap.destroy();
	}
	const _sprite_char = this;
	const width = this.patternWidth() + 20;
	const height = this.patternHeight() + 20;
	this._glow_sprite.bitmap = new Bitmap(width, height);
	this._glow_sprite.bitmap.fontFace = $gameSystem.mainFontFace();
    this._glow_sprite.bitmap.fontSize = $gameSystem.mainFontSize();
	this._glow_sprite.bitmap.outlineColor = ColorManager.outlineColor();
	this._glow_sprite.bitmap.textColor = ColorManager.normalColor();
	this._glow_sprite.bitmap.smooth = true;
	this._glow_sprite.bitmap.paintOpacity = 255;
	this._glow_sprite.refresh = function(){
		this.bitmap.clear();
		this.t += 0.06;

		const breath = (Math.sin(this.t) + 1) / 2;
		const outerAlpha = 0.4 + breath * 0.5;
		this.bitmap.drawGlowCircle(
			width / 2,
			height / 2,
			width / 2,
			`rgba(${this.r}, ${this.g}, ${this.b}, ${outerAlpha})`,
			"rgba(255, 255, 0, 0)"
		);
		this.move(0 - width / 2, 0 - height + 10);
	};
    
	const _glow_sprite_update = this._glow_sprite.update;
	this._glow_sprite.update = function() {
		_glow_sprite_update.call(this);	
		if(_sprite_char._character && _sprite_char._character._erased === false && _sprite_char._character.findProperPageIndex() >= 0
		&& _sprite_char._character._glow
		){
			this.refresh();
		}
		
	};
}


//在下面两个加载自定义的Sprite获取尺寸显示名字
const _Sprite_Character_prototype_setTileBitmap = Sprite_Character.prototype.setTileBitmap;
Sprite_Character.prototype.setTileBitmap = function() {
    _Sprite_Character_prototype_setTileBitmap.call(this);
	const _sprite = this;
	this.bitmap.addLoadListener(()=>{
		_sprite.createGlowBitmap();
    });
	
};
const _Sprite_Character_prototype_setCharacterBitmap = Sprite_Character.prototype.setCharacterBitmap;
Sprite_Character.prototype.setCharacterBitmap = function() {
    _Sprite_Character_prototype_setCharacterBitmap.call(this);
	const _sprite = this;
	this.bitmap.addLoadListener(()=>{
		_sprite.createGlowBitmap();
    });
	
};

const _Sprite_Character_prototype_update = Sprite_Character.prototype.update;
Sprite_Character.prototype.update = function() {
	_Sprite_Character_prototype_update.call(this);
	
};

})();