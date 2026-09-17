//=============================================================================
// Fun_Bag.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 背包
 * @author 希夷先生
 *
 * @help
 * 插件功能：背包
*/

function Scene_Bag() {
    this.initialize(...arguments);
}

Scene_Bag.prototype = Object.create(Scene_ItemBase.prototype);
Scene_Bag.prototype.constructor = Scene_Bag;

Scene_Bag.prototype.initialize = function() {
    Scene_ItemBase.prototype.initialize.call(this);
};
(() => {
	
	
Input.keyMapper[49] = 'shortcut1'; //1键
const Scene_Base_prototype_createWindowLayer = Scene_Base.prototype.createWindowLayer;
Scene_Base.prototype.createWindowLayer = function() {
	if (SceneManager._scene instanceof Scene_Map) {
		this._bagSprite = CreateButton("背包", 10, Graphics.boxHeight - 58, 96, 48,
		function(){
			SoundManager.playOk();
			SceneManager.push(Scene_Bag);
		},"shortcut1");
		this.addChild(this._bagSprite);
	}
	Scene_Base_prototype_createWindowLayer.call(this);
};

const _Scene_Map_prototype_isMapTouchOk = Scene_Map.prototype.isMapTouchOk;
Scene_Map.prototype.isMapTouchOk = function() {
	if(!this._bagSprite._istouch){
		return _Scene_Map_prototype_isMapTouchOk.call(this);
	}else{
		return false;
	}
};

Scene_Bag.prototype.createGoldWindow = function() {
    const rect = this.goldWindowRect();
    this._goldWindow = new Window_Gold(rect);
    this.addWindow(this._goldWindow);
};

Scene_Bag.prototype.goldWindowRect = function() {
    const ww = Graphics.boxWidth;
    const wh = this.calcWindowHeight(1, true);
    const wx = 0;
    const wy = 0;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Menu.prototype.goldWindowRect = function() {
    const ww = this.mainCommandWidth();
    const wh = this.calcWindowHeight(1, true);
    const wx = 2000;//this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
    const wy = this.mainAreaBottom() - wh;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Bag.prototype.create = function() {
    Scene_ItemBase.prototype.create.call(this);
	this.createGoldWindow();
    this.createHelpWindow();
    this.createCategoryWindow();
    this.createItemWindow();
    this.createActorWindow();	
};


Scene_ItemBase.prototype.actorWindowRect = function() {
    const wx = 0;
    const wy = this.calcWindowHeight(1, true);
    const ww = Graphics.boxWidth - this.mainCommandWidth();
    const wh = this.mainAreaHeight() + this.helpAreaHeight() - 26;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Bag.prototype.createCategoryWindow = function() {
    const rect = this.categoryWindowRect();
    this._categoryWindow = new Window_ItemCategory(rect);
    this._categoryWindow.setHelpWindow(this._helpWindow);
    this._categoryWindow.setHandler("ok", this.onCategoryOk.bind(this));
    this._categoryWindow.setHandler("cancel", this.popScene.bind(this));
    this.addWindow(this._categoryWindow);
};

Scene_Bag.prototype.categoryWindowRect = function() {
    const wx = 0;
    const wy = this.calcWindowHeight(1, true);
    const ww = Graphics.boxWidth;
    const wh = this.calcWindowHeight(1, true);
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Bag.prototype.createItemWindow = function() {
    const rect = this.itemWindowRect();
    this._itemWindow = new Window_ItemList(rect);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
    this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
    this.addWindow(this._itemWindow);
    this._categoryWindow.setItemWindow(this._itemWindow);
    if (!this._categoryWindow.needsSelection()) {
        this._itemWindow.y -= this._categoryWindow.height;
        this._itemWindow.height += this._categoryWindow.height;
        this._itemWindow.createContents();
        this._categoryWindow.update();
        this._categoryWindow.hide();
        this._categoryWindow.deactivate();
        this.onCategoryOk();
    }
	this._item_help_window = this.CreateItemHelpWindow(); //创建物品介绍窗口
	this._item_help_window.setHandler('cancel', this.ok1Help.bind(this));
	
	
	this.addWindow(this._item_help_window);
	
};
Scene_Bag.prototype.ok1Help = function() {
	this._item_help_window.deactivate();
	this._item_help_window.hide();
	this._itemWindow.activate();
};
Scene_Bag.prototype.itemWindowRect = function() {
    const wx = 0;
    const wy = this._categoryWindow.y + this._categoryWindow.height;
    const ww = Graphics.boxWidth;
    const wh = this.mainAreaBottom() - wy;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Bag.prototype.user = function() {
    const members = $gameParty.movableMembers();
    const bestPha = Math.max(...members.map(member => member.pha));
    return members.find(member => member.pha === bestPha);
};

Scene_Bag.prototype.onCategoryOk = function() {
    this._itemWindow.activate();
    this._itemWindow.selectLast();
};

const _Scene_Bag_prototype_update = Scene_Bag.prototype.update;
Scene_Bag.prototype.update = function() {
	_Scene_Bag_prototype_update.call(this);

}

Scene_Bag.prototype.onItemOk = function() {
    $gameParty.setLastItem(this.item());
	if(this.item() == null){
		return;
	}
	if(this._item_help_window.active){
		return;
	}
	SoundManager.playOk();
	this._item_help_window.text = this.item().name;
	this._item_help_window.show();
	this._item_help_window.activate();
	this._itemWindow.deactivate();
};

Scene_Bag.prototype.onItemCancel = function() {
    if (this._categoryWindow.needsSelection()) {
        this._itemWindow.deselect();
        this._categoryWindow.activate();
    } else {
        this.popScene();
    }
};

Scene_Bag.prototype.playSeForItem = function() {
    SoundManager.playUseItem();
};

Scene_Bag.prototype.useItem = function() {
    Scene_ItemBase.prototype.useItem.call(this);
    this._itemWindow.redrawCurrentItem();
};
const _Scene_Bag_prototype_determineItem = Scene_Bag.prototype.determineItem;
Scene_Bag.prototype.determineItem = function() {
	_Scene_Bag_prototype_determineItem.call(this);
    this._actorWindow.refresh();
};

//物品最大数突破9亿
Game_Party.prototype.maxItems = function(/*item*/) {
    return 999999999;
};

Window_ItemCategory.prototype.maxCols = function() {
    return 2;
};

//物品数量画
Window_ItemList.prototype.drawItemNumber = function(item, x, y, width) {
    if (this.needsNumber()) {
        //this.drawText(": ", x-this.textWidth(String($gameParty.numItems(item))), y, width, "right");
        this.drawText($gameParty.numItems(item), x, y, width, "right");
    }
};
//物品栏一行
Window_ItemList.prototype.maxCols = function() {
    return 1;
};

//角色窗口永远在左侧
Scene_ItemBase.prototype.isCursorLeft = function() {
    return false;
};


Scene_Bag.prototype.CreateItemHelpWindow = function() {
	const _window = new Window_Selectable(this.itemWindowRect());
	_window.text = "";
	_window.refresh = function(){
		
		if(this.text === "血灵果种子"){
			$gameSystem._seed_id = 1;
		}else if(this.text === "朱果种子"){
			$gameSystem._seed_id = 2;
		}else if(this.text === "天山雪莲种子"){
			$gameSystem._seed_id = 3;
		}else if(this.text === "彼岸花种子"){
			$gameSystem._seed_id = 4;
		}else if(this.text === "油菜花种子"){
			$gameSystem._seed_id = 5;
		}else if(this.text === "一点筛子种子"){
			$gameSystem._seed_id = 6;
		}else if(this.text === "二点筛子种子"){
			$gameSystem._seed_id = 7;
		}else if(this.text === "三点筛子种子"){
			$gameSystem._seed_id = 8;
		}else if(this.text === "四点筛子种子"){
			$gameSystem._seed_id = 9;
		}else if(this.text === "五点筛子种子"){
			$gameSystem._seed_id = 10;
		}else if(this.text === "六点筛子种子"){
			$gameSystem._seed_id = 11;
		}else{
			$gameSystem._seed_id = 0;
		}
		this.contents.clear();
		this.changeTextColor(ColorManager.systemColor());
		if($gameSystem._seed_id <= 0){
			this.drawText("登记失败", 0, 0, this.contents.width, "center");
		}else{
			this.drawText("登记成功", 0, 0, this.contents.width, "center");
			this.resetTextColor();
			this.drawText("在土地上可直接种植", 10, 50, this.contents.width, "left");
			this.drawText("已登记： " + this.text, 10, 100, this.contents.width, "left");
		}
		
		
		
		
	};
	
	
	_window.hide();
	_window._show = _window.show;
	_window.show = function(){
		this._show.call(this);
		this.refresh();
	};
	_window._hide = _window.hide;
	_window.hide = function(){
		this._hide.call(this);
		this.contents.clear();
	};
	return _window;
};
})();