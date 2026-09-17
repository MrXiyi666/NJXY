//=============================================================================
// Fun_Gen.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 武将
 * @author 希夷先生
 *
 * @help
 * 插件功能：武将
*/
(() => {

const Scene_Base_prototype_createWindowLayer = Scene_Base.prototype.createWindowLayer;
Scene_Base.prototype.createWindowLayer = function() {
	if (SceneManager._scene instanceof Scene_Map) {
		this._Gen_Sprite = CreateButton("武将", 222, Graphics.boxHeight - 58, 96, 48,
		function(){
			SoundManager.playOk();
			SceneManager.push(Scene_Status);
		}, "shortcut4");
		this.addChild(this._Gen_Sprite);
	}
	Scene_Base_prototype_createWindowLayer.call(this);
};

const _Scene_Map_prototype_isMapTouchOk = Scene_Map.prototype.isMapTouchOk;
Scene_Map.prototype.isMapTouchOk = function() {
	if(!this._Gen_Sprite._istouch){
		return _Scene_Map_prototype_isMapTouchOk.call(this);
	}else{
		return false;
	}
};

let _actor = null;

const _Scene_Status_prototype_create = Scene_Status.prototype.create;
Scene_Status.prototype.create = function() {
	_Scene_Status_prototype_create.call(this);
	const scene = this;
	this._left_button = CreateButton("上一页", 25, 420, 130, 48,
		function(){
			if($gameParty.members().length > 1){
				scene.previousActor();
			}
		}, "left");
	this.addChild(this._left_button);
	this._right_button = CreateButton("下一页", 480, 420, 130, 48,
		function(){
			if($gameParty.members().length > 1){
				scene.nextActor();
			}
		}, "right");
	this.addChild(this._right_button);
	
	this._equip_button = CreateButton("装备", 272, 420, 110, 48,
		function(){
			SoundManager.playOk();
			_actor = scene._actor;
			SceneManager.push(Scene_Equip);
			
		}, "shortcut1");
	this.addChild(this._equip_button);
};

//右侧装备武器防具界面 最大三个字的武器防具名字
Window_StatusEquip.prototype.drawItem = function(index) {
    const rect = this.itemLineRect(index);
    const equips = this._actor.equips();
    const item = equips[index];
    const slotName = this.actorSlotName(this._actor, index);
    const sw = 110;
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(slotName, rect.x, rect.y, sw, rect.height);
    this.drawItemName(item, rect.x + sw, rect.y, rect.width - sw);
};
//装备界面右侧文字 最大三个
Window_EquipSlot.prototype.slotNameWidth = function() {
    return 100;
};

//============================================================
//==========================装备界面===========================
//============================================================
Scene_MenuBase.prototype.updateActor = function() {
	if (SceneManager._scene instanceof Scene_Equip) {
		this._actor = _actor;
	}else{
		this._actor = $gameParty.menuActor();
	}
		
};


Scene_Equip.prototype.createCommandWindow = function() {
    const rect = this.commandWindowRect();
    this._commandWindow = new Window_EquipCommand(rect);
    this._commandWindow.setHelpWindow(this._helpWindow);
    this._commandWindow.setHandler("equip", this.commandEquip.bind(this));
    //this._commandWindow.setHandler("optimize", this.commandOptimize.bind(this));
    this._commandWindow.setHandler("clear", this.commandClear.bind(this));
    this._commandWindow.setHandler("cancel", this.popScene.bind(this));
    this._commandWindow.setHandler("pagedown", this.nextActor.bind(this));
    this._commandWindow.setHandler("pageup", this.previousActor.bind(this));
    this.addWindow(this._commandWindow);
};

Window_EquipCommand.prototype.maxCols = function() {
    return 2;
};

Window_EquipCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.equip2, "equip");
    //this.addCommand(TextManager.optimize, "optimize");
    this.addCommand(TextManager.clear, "clear");
};

})();