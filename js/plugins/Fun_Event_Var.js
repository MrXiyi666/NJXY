//=============================================================================
// Fun_Event_Var.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 事件变量
 * @author 希夷先生
 *
 * @help
 * 插件功能：每一个事件都有着独立的变量 可以做倒计时
*/
(() => {
//=============================存档功能======================================
const _Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
    _Game_System_initialize.call(this);
	this._event_var = [];
};

const _Game_Event_prototype_initialize = Game_Event.prototype.initialize;
Game_Event.prototype.initialize = function(mapId, eventId) {
	_Game_Event_prototype_initialize.call(this, mapId, eventId);
	if(!$gameSystem._event_var){
		$gameSystem._event_var = [];
	}
	let item = $gameSystem._event_var.find(ev=> ev.mapId === mapId && ev.eventId === eventId);
	if(!item){
		//没有找到，新建
		item = {
			mapId: mapId,
			eventId: eventId,
			_num: 0,              //最高支持 54000 15分钟  默认0不执行
			_pack: 3600,          //一分钟领取一次礼包
			_date: "",            //用于记录当前时间判断时间差
			_currentStamp: 0      //保存毫秒戳
		};
		$gameSystem._event_var.push(item);
	}
	this._event_var = item;
};

//获取具体某个地图某个事件的 保存的var
Game_Interpreter.prototype.getEventVar = function(mapId, eventId) {
	const event = this.character(0);
    if(!event) return;
	if(event._event_var){
		return event._event_var;
	}
    return;
};

//获取事件的x格子
Game_Interpreter.prototype.getX = function() {
	const event = this.character(0);
    if(!event) return-1;
	return event.x;
};
//获取事件的y格子
Game_Interpreter.prototype.getY = function() {
    const event = this.character(0);
    if(!event) return -1;
    return event.y;
};

Game_Interpreter.prototype.resetNum = function() {
	const event = this.character(0);
    if(!event) return;
	if(event._event_var){
		event._event_var._num = 54000;
	}
};

Game_Interpreter.prototype.getNum = function() {
	const event = this.character(0);
    if(!event) return;
	if(event._event_var){
		return event._event_var._num;
	}
};

Game_Interpreter.prototype.getNumMax = function() {
	return 54000;
};

Game_Interpreter.prototype.getPack = function() {
	const event = this.character(0);
    if(!event) return;
	if(event._event_var){
		return event._event_var._pack;
	}
};

Game_Interpreter.prototype.setPack = function(num) {
	const event = this.character(0);
    if(!event) return;
	if(event._event_var){
		event._event_var._pack= num;
	}
};

Game_Interpreter.prototype.resetPack = function() {
	const event = this.character(0);
    if(!event) return;
	if(event._event_var){
		event._event_var._pack= 3600;
	}
};
//记录当前时间
Game_Interpreter.prototype.recordDate = function() {
	const event = this.character(0);
    if(!event) return;
	if(event._event_var){
		event._event_var._date = getDate();
		event._event_var._currentStamp = currentStamp;
	}
};
//重置当前时间为 空
Game_Interpreter.prototype.resetDate = function() {
	const event = this.character(0);
    if(!event) return;
	if(event._event_var){
		event._event_var._date= "";
		event._event_var._currentStamp = 0;
	}
};

//经过了多少 秒
Game_Interpreter.prototype.timeDiff = function() {
	const event = this.character(0);
    if(!event) return 0;
	if(event._event_var){
		if(!event._event_var._currentStamp && event._event_var._currentStamp === 0) return 0;
        const diffMs = Math.abs(currentStamp - event._event_var._currentStamp);
        return Math.floor(diffMs / 1000);
	}else{
		return 0;
	}
};

Game_Event.prototype.timeDiff = function() {
	if(this._event_var){
		if(!this._event_var._currentStamp && this._event_var._currentStamp === 0) return 0;
        const diffMs = Math.abs(currentStamp - this._event_var._currentStamp);
        return Math.floor(diffMs / 1000);
	}else{
		return 0;
	}
};

Game_Interpreter.prototype.getDate = function() {
	const event = this.character(0);
    if(!event) return;
	if(event._event_var){
		return event._event_var._date;
	}
};

const _Game_Event_prototype_update = Game_Event.prototype.update;
Game_Event.prototype.update = function() {
	_Game_Event_prototype_update.call(this);
	if(this._event_var){
		if(this._event_var._num > 0) this._event_var._num--;
		if(this._event_var._pack > 0) this._event_var._pack--;
	}
	
};

})();

