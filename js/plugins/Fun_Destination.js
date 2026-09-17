//=============================================================================
// Fun_Destination.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 地图点击图标
 * @author 希夷先生
 *
 * @help
 * 插件功能：地图点击图标
*/
(() => {
	//================================================================================
	//==========================地图点击图像改变========================
	//================================================================================
	Sprite_Destination.prototype.updateAnimation = function() {
        this._frameCount++;
        this._frameCount %= 20;
        this.scale.x = 1 + this._frameCount / 20;
        this.scale.y = this.scale.x;
    };
	
	Sprite_Destination.prototype.createBitmap = function() {
        this.bitmap = ImageManager.loadSystem("map_tou");
		this.opacity=255;
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
    };
    
	Sprite_Destination.prototype.destroy = function(options) {
		this.bitmap = null;
		Sprite.prototype.destroy.call(this, options);
		
	};
})();