//=============================================================================
// Fun_EventLocation.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 保存地图上的事件位置
 * @author 希夷先生
 *
 * @help
 * 插件功能：保存地图上的事件位置
*/
(() => {

//=============================存档功能======================================
const _Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
    _Game_System_initialize.call(this);
	this._location = [];
};

const _Game_Event_prototype_initialize = Game_Event.prototype.initialize;
Game_Event.prototype.initialize = function(mapId, eventId) {
	_Game_Event_prototype_initialize.call(this, mapId, eventId);
	// 查找存档数据
	if(!$gameSystem._location){
		$gameSystem._location = [];
	}
	let item = $gameSystem._location.find(ev=> ev.mapId === mapId && ev.eventId === eventId);
	if(!item){
		//没有找到，新建
		item = {
			mapId: mapId,
			eventId: eventId,
			x: 0,
			y: 0,
			dir: 2,
			savedPos: false
		};
		$gameSystem._location.push(item);
	}
	this._location = item;

};

//事件创建完毕 统一恢复坐标
const _Game_Map_setupEvents = Game_Map.prototype.setupEvents;
Game_Map.prototype.setupEvents = function() {
    _Game_Map_setupEvents.call(this);
    this.events().forEach(ev => {
        if (ev._location && ev._location.savedPos) {
			ev.locate(ev._location.x, ev._location.y);
			if(ev._location.dir){
				ev.setDirection(ev._location.dir);
			}
			
        }
    });
};

const _Game_Event_prototype_update = Game_Event.prototype.update;
Game_Event.prototype.update = function() {
    _Game_Event_prototype_update.call(this);
    // 有_location对象才处理
    if (!this._location) return;
    // 对比当前坐标 和 已保存的坐标
    if (this._location.x !== this._x || this._location.y !== this._y || this._location.dir !== this.direction()) {
        this._location.x = this._x;
        this._location.y = this._y;
        this._location.savedPos = true;
		this._location.dir = this.direction();
		//console.log("修改了坐标");
    }
};

})();