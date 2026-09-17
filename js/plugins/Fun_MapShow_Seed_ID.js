//=============================================================================
// Fun_MapShow_Seed_ID.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 地图上显示当前种子名称
 * @author 希夷先生
 *
 * @help
 * 插件功能：地图上显示当前种子名称
*/
(() => {

function getText(){
	if($gameSystem._seed_id === 1){
		return "已登记：血灵果种子";
	}else if($gameSystem._seed_id === 2){
		return "已登记：朱果种子";
	}else if($gameSystem._seed_id === 3){
		return "已登记：天山雪莲种子";
	}else if($gameSystem._seed_id === 4){
		return "已登记：彼岸花种子";
	}else if($gameSystem._seed_id === 5){
		return "已登记：油菜花种子";
	}else if($gameSystem._seed_id === 6){
		return "已登记：一点筛子种子";
	}else if($gameSystem._seed_id === 7){
		return "已登记：二点筛子种子";
	}else if($gameSystem._seed_id === 8){
		return "已登记：三点筛子种子";
	}else if($gameSystem._seed_id === 9){
		return "已登记：四点筛子种子";
	}else if($gameSystem._seed_id === 10){
		return "已登记：五点筛子种子";
	}else if($gameSystem._seed_id === 11){
		return "已登记：六点筛子种子";
	}else{
		return;
	}
	
	
}

const Scene_Base_prototype_createWindowLayer = Scene_Base.prototype.createWindowLayer;
Scene_Base.prototype.createWindowLayer = function() {
	Scene_Base_prototype_createWindowLayer.call(this);
	if (SceneManager._scene instanceof Scene_Map) {
		const text = getText();
		if(!text){
			return;
		}
		const _this = this;
		const width = textWidth(text);
		const _SeedName_Sprite = CreateButton(text, 10, 10, width + (width*0.5), 56, 
		function(){
			$gameSystem._seed_id = 0;
			_this.removeChild(_SeedName_Sprite);
			$gameSystem.mess("取消登记");
		},"cancel");
		this.addChild(_SeedName_Sprite);
	}
	
};

})();