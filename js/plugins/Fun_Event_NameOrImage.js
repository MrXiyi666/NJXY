//=============================================================================
// Fun_Event_NameOrImage.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 修改事件名字和图像
 * @author 希夷先生
 *
 * @help
 * 插件功能：修改事件名字和图像
   this.setName(Name); 修改事件名字
   this.setImage("", 0); 修改事件图像
*/
(() => {
	
//=============================存档功能======================================
const _Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
    _Game_System_initialize.call(this);
	this._event_name = [];
};

const _Game_Event_prototype_initialize = Game_Event.prototype.initialize;
Game_Event.prototype.initialize = function(mapId, eventId) {
	_Game_Event_prototype_initialize.call(this, mapId, eventId);
	if(!$gameSystem._event_name){
		$gameSystem._event_name = [];
	}
	let item = $gameSystem._event_name.find(ev=> ev.mapId === mapId && ev.eventId === eventId); //查找数据
	if(!item){
		// 先只存mapId eventId 名字
		item = {
			mapId: mapId,
			eventId: eventId,
			name: this.event().name,
			characterName: "",
			characterIndex: 0
		};
		$gameSystem._event_name.push(item);
	}
	this._event_name = item;
};

//立刻刷新事件图像
Game_CharacterBase.prototype.forceSpriteRefresh = function(){
    if(!(SceneManager._scene instanceof Scene_Map)) return;
    const spriteset = SceneManager._scene._spriteset;
    for(const spr of spriteset._characterSprites){
        if(spr._character === this){
            if (spr._tileId > 0) {
				spr.setTileBitmap();
			} else {
				spr.setCharacterBitmap();
			}
            return;
        }
    }
};
//修改事件图像
Game_Interpreter.prototype.setImage = function(characterName, characterIndex) {
	const event = this.character(0);
    if(!event) return;
	if(event._event_name){
		event._event_name.characterName = characterName;
		event._event_name.characterIndex = characterIndex;
	}
    event.setImage(characterName, characterIndex);
};

//获取图像用于判断
Game_Interpreter.prototype.getImageName = function(){
	const event = this.character(0);
    if(!event) return;
	if(event._event_name){
		return event._event_name.characterName;
	}
};

Game_Event.prototype.getImageName = function() {
	if(this._event_name){
		return this._event_name.characterName;
	}
	return null;
};

const _Game_Event_prototype_setImage = Game_Event.prototype.setImage;
Game_Event.prototype.setImage = function(characterName, characterIndex) {
	_Game_Event_prototype_setImage.call(this, characterName, characterIndex);
	if(this._event_name){
		this._event_name.characterName = characterName;
		this._event_name.characterIndex = characterIndex;
	}
};

//修改事件名字
Game_Interpreter.prototype.setName = function(name) {
	const event = this.character(0);
    if(!event) return;
	if(event._event_name){
		event._event_name.name = name;
		event.forceSpriteRefresh();
	}
};

//=============================在这里初始化得到 character======================================
const _Sprite_Character_prototype_setCharacter = Sprite_Character.prototype.setCharacter;
Sprite_Character.prototype.setCharacter = function(character) {
	_Sprite_Character_prototype_setCharacter.call(this, character);
	if (character instanceof Game_Event) {
		this._name_sprite = new Sprite();
		this._name_sprite.event = character;
		this._name_sprite.eventId = character.eventId();
		this._name_sprite.mapId = character._mapId;
		this._name_sprite.name = "";
		this.addChild(this._name_sprite);
		if(character._event_name){
			//恢复存档的图像 
			if(character._erased === false && character._event_name.characterName !== "" && character.findProperPageIndex() >= 0){	
				character.setImage(character._event_name.characterName, character._event_name.characterIndex);
			}
		}
		
	}
};

//创建事件名字精灵
Sprite_Character.prototype.createNameBitmap = function() {
	const sprite_char = this;
	if(!this._name_sprite){
		return;
	}
	if (this._name_sprite.bitmap) {
		this._name_sprite.bitmap.destroy();
	}
	const height = this.patternHeight();
	this._name_sprite.bitmap = new Bitmap(600, height);
	this._name_sprite.bitmap.fontFace = $gameSystem.mainFontFace();
    this._name_sprite.bitmap.fontSize = $gameSystem.mainFontSize();
	this._name_sprite.bitmap.outlineColor = ColorManager.outlineColor();
	this._name_sprite.bitmap.textColor = ColorManager.normalColor();
	this._name_sprite.bitmap.smooth = true;
	this._name_sprite.bitmap.paintOpacity = 255;
	this._name_sprite.refresh = function(){
		if(this.event._erased === true){
			return;
		}
		if(sprite_char._character._event_name){
			this.bitmap.clear();
			this.bitmap.drawText(sprite_char._character._event_name.name, 0, 0, this.bitmap.width, 46, "center");
			this.move(0 - this.bitmap.width / 2, 0 - (height + 38));
			this.name = sprite_char._character._event_name.name;
		}
	};
	this._name_sprite.refresh();
}

//在下面两个加载自定义的Sprite获取尺寸显示名字
const _Sprite_Character_prototype_setTileBitmap = Sprite_Character.prototype.setTileBitmap;
Sprite_Character.prototype.setTileBitmap = function() {
    _Sprite_Character_prototype_setTileBitmap.call(this);
	const _sprite = this;
	this.bitmap.addLoadListener(()=>{
		_sprite.createNameBitmap();
    });
	
};
const _Sprite_Character_prototype_setCharacterBitmap = Sprite_Character.prototype.setCharacterBitmap;
Sprite_Character.prototype.setCharacterBitmap = function() {
    _Sprite_Character_prototype_setCharacterBitmap.call(this);
	const _sprite = this;
	this.bitmap.addLoadListener(()=>{
		_sprite.createNameBitmap();
    });
	
};

})();