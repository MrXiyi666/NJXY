//=============================================================================
// Fun_Seed_ID.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 种子编号
 * @author 希夷先生
 *
 * @help
 * 插件功能：种子编号
*/
(() => {

//=============================存档功能======================================
const _Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
    _Game_System_initialize.call(this);
	this._seed_id = 0; //种子的编号
	/*
	1 血灵果
	2 朱果
	*/
};


})();