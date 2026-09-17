//=============================================================================
// Fun_Event_Plant.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 农作物的编号记录
 * @author 希夷先生
 *
 * @help
 * 插件功能：农作物的编号记录
*/
(() => {

//=============================存档功能======================================
const _Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
    _Game_System_initialize.call(this);
	this._plant_id = [];
	this._plant_num=0; //采摘次数根据次数可以兑换物品
};

const _Game_Event_prototype_initialize = Game_Event.prototype.initialize;
Game_Event.prototype.initialize = function(mapId, eventId) {
	_Game_Event_prototype_initialize.call(this, mapId, eventId);
	if(!$gameSystem._plant_id){
		$gameSystem._plant_id = [];
	}
	let item = $gameSystem._plant_id.find(ev=> ev.mapId === mapId && ev.eventId === eventId);
	if(!item){
		//没有找到，新建
		item = {
			mapId: mapId,
			eventId: eventId,
			id: 0
		};
		$gameSystem._plant_id.push(item);
	}
	this._plant_id = item;

};


//设置种子id
Game_Interpreter.prototype.setPlant = function(num) {
	const event = this.character(0);
    if(!event) return;
	if(event._plant_id){
		event._plant_id.id = num;
	}else{
		this.mess("种植失败");
	}
	
	
};
//获取种子id
Game_Interpreter.prototype.getPlant = function() {
	const event = this.character(0);
    if(!event) return 0;
	if(event._plant_id){
		return event._plant_id.id;
	}
	return 0;
    
};


Game_Event.prototype.getPlant = function() {
	if(this._plant_id){
		return this._plant_id.id;
	}
	return 0;
};

//重置种子id
Game_Interpreter.prototype.resetPlant = function() {
	const event = this.character(0);
    if(!event) return;
	if(event._plant_id){
		event._plant_id.id = 0;
	}
};

})();