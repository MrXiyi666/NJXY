//=============================================================================
// Fun_MapName.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 地图名字右下角
 * @author 希夷先生
 *
 * @help
 * 插件功能：地图名字右下角
*/
(() => {
//$gameMap.displayName()

Scene_Map.prototype.mapNameWindowRect = function() {
    const wx = 10000;
    const wy = 0;
    const ww = 360;
    const wh = this.calcWindowHeight(1, false);
    return new Rectangle(wx, wy, ww, wh);
};

const Scene_Base_prototype_createWindowLayer = Scene_Base.prototype.createWindowLayer;
Scene_Base.prototype.createWindowLayer = function() {
	Scene_Base_prototype_createWindowLayer.call(this);
	if (SceneManager._scene instanceof Scene_Map) {
		const _map_name_Sprite = CreateButton($gameMap.displayName(), Graphics.boxWidth - 184, Graphics.boxHeight - 58, 183, 48, null, null);
		this.addChild(_map_name_Sprite);
	}
	
};

})();