//=============================================================================
// Fun_MoveDire.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 移动时先转向
 * @author 希夷先生
 *
 * @help
 * 插件功能：移动时先转向
*/
(() => {



Game_Player.prototype.getInputDirection = function() {
	let d = Input.dir4;
	// 无方向输入，重置锁定
	if (d <= 0) {
		this._inputTime = 0;
		return d;
	}
	if(d > 0 && this.direction() != d){
		this.setDirection(d);
		// 锁定多少毫秒，200毫秒
        this._inputTime = Date.now() + 200;
	}
	
	if (Date.now() < this._inputTime) {
		return 0;
	}else{
		this._inputTime = 0;
		return d;
	}
    
};

})();