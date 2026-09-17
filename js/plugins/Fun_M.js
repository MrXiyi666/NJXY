//=================================================================================================
// Fun_M.js
//=================================================================================================
/*:
 * @target MZ
 * @plugindesc 全局工具函数。
 * @author 希夷先生
 *
 * @help
 * 插件功能：全局工具函数
 *
*/

function textWidth(text){
	const bitmap = new Bitmap(1, 1);
	bitmap.fontFace = $gameSystem.mainFontFace();
    bitmap.fontSize = $gameSystem.mainFontSize();
	bitmap.outlineColor = ColorManager.outlineColor();
	bitmap.textColor = ColorManager.normalColor();
	bitmap.outlineWidth = 8;
	bitmap.fontBold = true;
	return bitmap.measureTextWidth(text);
}

//====================================================
//=======================创建一个精灵按钮==================
//====================================================
function CreateButton(text, x, y, width, height, callback, shortcut) {
	const _sprite = new Sprite();
	_sprite.bitmap = new Bitmap(width, height);
	_sprite.bitmap.fontFace = $gameSystem.mainFontFace();
    _sprite.bitmap.fontSize = $gameSystem.mainFontSize();
	_sprite.bitmap.outlineColor = ColorManager.outlineColor();
	_sprite.bitmap.textColor = ColorManager.normalColor();
	_sprite.bitmap.smooth = true;
	_sprite._istouch = false;
	_sprite.x = x;
	_sprite.y = y;
	_sprite.text = text;
	_sprite._callback = callback;
	const _update = _sprite.update;
	_sprite.update = function(){
		_update.call(this);
		this.touch_update();
	};
    _sprite.touch_update = function(){
		if(!$gamePlayer.canMove()){
			//this.hide();
			return;
		}else{
			//this.show();
		}
		if (!this._callback) {
			return;
		}
		if(Input.isTriggered(shortcut)){
			// 快捷键
			this._callback();
		}
		//进入鼠标区域
		if(TouchInput.x > this.x && TouchInput.x < this.x + this.bitmap.width && TouchInput.y > this.y && TouchInput.y < this.y + this.bitmap.height){
			// 鼠标按下
			if (TouchInput.isTriggered()) {
				//console.log("鼠标按下");
				this._istouch = true;
				this.bitmap.outlineColor = ColorManager.normalColor();
			    this.bitmap.textColor = ColorManager.outlineColor();
				this.bitmap.fontSize = $gameSystem.mainFontSize() + 4;
				this.refresh();
			}
			if(TouchInput.isReleased()) {
				// 鼠标松开
				this._istouch = false;
				this.bitmap.outlineColor = ColorManager.outlineColor();
			    this.bitmap.textColor = ColorManager.normalColor();
				this.bitmap.fontSize = $gameSystem.mainFontSize();
				this.refresh();
				this._callback();
			}
			
		}else{
			if(!this._istouch){
				return;
			}
			this._istouch = false;
			this.bitmap.outlineColor = ColorManager.outlineColor();
			this.bitmap.textColor = ColorManager.normalColor();
			this.bitmap.fontSize = $gameSystem.mainFontSize();
			this.refresh();
		}
		
	}
	_sprite.refresh = function(){
		//在这里画图
		this.bitmap.clear();
		this.bitmap.fillAll(ColorManager.itemBackColor2());
		this.bitmap.drawText(this.text, 0, 0, this.bitmap.width, this.bitmap.height, "center");
	}
	_sprite.refresh();
	const _destroy = _sprite.destroy;
	_sprite.destroy = function() {
		if (this.bitmap) {
			this.bitmap.destroy();
		}
		_destroy.call(this);
	};
	return _sprite;
};

//========================================================
//========================添加新按键============================
//========================================================

Input.keyMapper[48] = 'shift';    //0键
Input.keyMapper[50] = 'cancel';    //2键
Input.keyMapper[50] = 'escape';    //2键
Input.keyMapper[51] = 'shortcut3'; //3键
Input.keyMapper[52] = 'shortcut4'; //4键
Input.keyMapper[53] = 'ok'; //5键  //5键
Input.keyMapper[54] = 'shortcut6'; //6键
Input.keyMapper[55] = 'shortcut7'; //7键

/*
// 获取地图的渲染对象 Sprite_Character
const event = $gameMap.event(5);
const spr = getEventSprite(event);
*/
function getEventSprite(gameEvent) {
	if (!(SceneManager._scene instanceof Scene_Map)) return null;
	const spriteset = SceneManager._scene._spriteset;
	// 遍历所有角色精灵（玩家+全部事件）
	for (const spr of spriteset._characterSprites) {
		if (spr._character === gameEvent) {
			return spr;
		}
	}
	return null;
}

// 随机整数 [min,max] 之间
function getRandomInt(min, max) {
	return min + Math.randomInt(max - min + 1);
}
