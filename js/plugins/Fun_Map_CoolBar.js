//=================================================================================================
// Fun_Map_CoolBar.js
//=================================================================================================
/*:
 * @target MZ
 * @plugindesc 采集进度条显示。
 * @author 希夷先生
 *
 * @help
 * 插件功能：采集进度条显示
 * 采集某事件 停止玩家和事件的移动 进度条结束执行某代码
 * 事件内 this.openCool() 即可启动进度条
 *
*/
(() => {


//事件内 this.openCool() 即可启动进度条
Game_Interpreter.prototype.openCool = function() {
	createBarSprite();
};

let _Cool_Sprite = null;

function createBarSprite(){
	let index_bar = 180; //进度条长度
	_cool_sprite = new Sprite();
	
	_cool_sprite.bitmap = new Bitmap(180, 48);
	_cool_sprite.bitmap.fontFace = $gameSystem.mainFontFace();
    _cool_sprite.bitmap.fontSize = $gameSystem.mainFontSize();
	_cool_sprite.bitmap.outlineColor = ColorManager.outlineColor();
	_cool_sprite.bitmap.textColor = ColorManager.normalColor();
	_cool_sprite.bitmap.outlineWidth = 8;
	_cool_sprite.bitmap.fontBold = true;
	
	_cool_sprite.name = $gameMap.displayName();
	_cool_sprite.name_text = "";
	_cool_sprite.move(Graphics.boxWidth / 2 - 90, Graphics.boxHeight / 2 - 24);
	
	const _update = _cool_sprite.update;
	_cool_sprite.update = function(){
		_update.call(this);
		this.bitmap.clear();
		this.bitmap.fillAll(ColorManager.itemBackColor2());
		this.bitmap.fillRect(0, 0, index_bar, 48, "#ffffff");
		if(this.name == "家园"){
			this.name_text = "收获中";
		}else if(this.name == "森林"){
			this.name_text = "探索中";
		}else if(this.name == "开心小屋"){
			this.name_text = "🍺";
		}
		this.bitmap.drawText(this.name_text, 0, 0, 180, 48, "center");
		index_bar--;
		if(index_bar <= 0){
			//移出去
			if(_cool_sprite && _cool_sprite.parent) {
				_cool_sprite.parent.removeChild(_cool_sprite);
			}
			_Cool_Sprite = null;
		}
	};
	_Cool_Sprite = _cool_sprite;
	SceneManager._scene.addChild(_cool_sprite);
}

//===============================消息框等待===================================
const _Game_Message_prototype_isBusy = Game_Message.prototype.isBusy;
Game_Message.prototype.isBusy = function() {
	 const baseWait = _Game_Message_prototype_isBusy.call(this);
    return baseWait || _Cool_Sprite;
};

// ========== 关键：拦截事件解释器，实现等待阻塞 ==========
const _Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
Game_Interpreter.prototype.updateWaitMode = function() {
    const baseWait = _Game_Interpreter_updateWaitMode.call(this);
    return baseWait || _Cool_Sprite;
};

})();