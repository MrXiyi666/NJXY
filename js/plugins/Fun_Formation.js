//=============================================================================
// Fun_Formation.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 队伍
 * @author 希夷先生
 *
 * @help
 * 插件功能：队伍
*/

function Scene_Formation() {
	this.initialize(...arguments);
}

Scene_Formation.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Formation.prototype.constructor = Scene_Formation;

Scene_Formation.prototype.initialize = function() {
	Scene_MenuBase.prototype.initialize.call(this);
	
};

(() => {

const Scene_Base_prototype_createWindowLayer = Scene_Base.prototype.createWindowLayer;
Scene_Base.prototype.createWindowLayer = function() {
	if (SceneManager._scene instanceof Scene_Map) {
		this._Formation_Sprite = CreateButton("队伍", 116, Graphics.boxHeight - 58, 96, 48,
		function(){
			SoundManager.playOk();
				SceneManager.push(Scene_Formation);
		}, "shortcut3");
		this.addChild(this._Formation_Sprite);
	}
	Scene_Base_prototype_createWindowLayer.call(this);
};

const _Scene_Map_prototype_isMapTouchOk = Scene_Map.prototype.isMapTouchOk;
Scene_Map.prototype.isMapTouchOk = function() {
	if(!this._Formation_Sprite._istouch){
		return _Scene_Map_prototype_isMapTouchOk.call(this);
	}else{
		return false;
	}
};


const _Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
    _Game_System_initialize.call(this);
	this._formation_num = 3;
};
	
Game_Party.prototype.maxBattleMembers = function() {
    return $gameSystem._formation_num;
};

Scene_Formation.prototype.create = function() {
	Scene_MenuBase.prototype.create.call(this);
	this.createStatusWindow();
	this.createDirButon();
};
Scene_Formation.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._statusWindow.refresh();
};

Scene_Formation.prototype.createDirButon = function() {
	this.hintText = CreateButton("出战人数：" + $gameSystem._formation_num, Graphics.boxWidth / 2 - 122, Graphics.boxHeight - 65, 244, 48, null, null);
	this.addWindow(this.hintText);
	const scene = this; //先保存当前场景
	this._dir_left = CreateButton("减少", 20, Graphics.boxHeight - 58, 96, 48, 
	function() {
		if($gameSystem._formation_num > 1){
			SoundManager.playCursor();
			$gameSystem._formation_num--;
			scene._statusWindow.refresh();
			scene.hintText.text = "出战人数：" + $gameSystem._formation_num;
			scene.hintText.refresh();
		}
	}, "left");
	this.addChild(this._dir_left);
	
	this._dir_right = CreateButton("增加", Graphics.boxWidth - 107, Graphics.boxHeight - 58, 96, 48, 
	function() {
		if($gameSystem._formation_num < 3){
			SoundManager.playCursor();
			$gameSystem._formation_num++;
			scene._statusWindow.refresh();
			scene.hintText.text = "出战人数：" + $gameSystem._formation_num;
			scene.hintText.refresh();
		}
	}, "right");
	this.addChild(this._dir_right);
	
	
};


Scene_Formation.prototype.statusWindowRect = function() {
    const ww = Graphics.boxWidth;
    const wh = this.mainAreaHeight();
    const wx = 0;
    const wy = this.mainAreaTop();
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Formation.prototype.createStatusWindow = function() {
	const rect = this.statusWindowRect();
	this._statusWindow = new Window_MenuStatus(rect);
	this.addWindow(this._statusWindow);
	this._statusWindow.setFormationMode(true);
	this._statusWindow.selectLast();
	this._statusWindow.activate();
	this._statusWindow.setHandler("ok", this.onFormationOk.bind(this));
	this._statusWindow.setHandler("cancel", this.onFormationCancel.bind(this));
};

Scene_Formation.prototype.onFormationOk = function() {
    const index = this._statusWindow.index();
    const pendingIndex = this._statusWindow.pendingIndex();
    if (pendingIndex >= 0) {
        $gameParty.swapOrder(index, pendingIndex);
        this._statusWindow.setPendingIndex(-1);
        this._statusWindow.redrawItem(index);
    } else {
        this._statusWindow.setPendingIndex(index);
    }
    this._statusWindow.activate();
};

Scene_Formation.prototype.onFormationCancel = function() {
    if (this._statusWindow.pendingIndex() >= 0) {
        this._statusWindow.setPendingIndex(-1);
        this._statusWindow.activate();
    } else {
        SceneManager.pop();
    }
};

const _Scene_Formation_prototype_update = Scene_Formation.prototype.update;
Scene_Formation.prototype.update = function() {
	_Scene_Formation_prototype_update.call(this);
	if(Input.isTriggered('shortcut3')){
		// 快捷键
		SoundManager.playCancel()
		SceneManager.pop();
	}
}

})();