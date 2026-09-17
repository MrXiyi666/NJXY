//=================================================================================================
// Fun_TitleBgmWaiting.js
//=================================================================================================
/*:
 * @target MZ
 * @plugindesc 开始游戏标题界面 等待音乐播放完毕在弹出游戏窗口
 * @author 希夷先生
 *
 * @help
 * 插件功能：开始游戏标题界面 等待音乐播放完毕在弹出游戏窗口
*/
(() => {

//音乐已经缓存完毕开始播放 才返回true AudioManager._bgmBuffer.isPlaying();
const _WebAudio_prototype_play = WebAudio.prototype.play;
WebAudio.prototype.play = function(loop, offset) {
	if (SceneManager._scene instanceof Scene_Title) {
		this._loop = loop;
		if (this.isReady()) {
			offset = offset || 0;
			this._startPlaying(offset);
			this._isPlaying = true;
		} else if (WebAudio._context) {
			this.addLoadListener(() => this.play(loop, offset));
		}
		return;
	}
	_WebAudio_prototype_play.call(this, loop, offset);
    
    
};

const _Scene_Title_prototype_initialize = Scene_Title.prototype.initialize;
Scene_Title.prototype.initialize = function() {
	_Scene_Title_prototype_initialize.call(this);
	this.isBgm = true;
};

const _Scene_Title_prototype_isBusy = Scene_Title.prototype.isBusy;
Scene_Title.prototype.isBusy = function() {
	return _Scene_Title_prototype_isBusy.call(this) || this.isBgm;
};

const _Scene_Title_prototype_update = Scene_Title.prototype.update;
Scene_Title.prototype.update = function(){
	_Scene_Title_prototype_update.call(this);
	if(this.isBgm === false){
		return;
	}
	const buf = AudioManager._bgmBuffer;
	if(buf && buf.isPlaying()){
		this.isBgm = false;
	}
	
};

})();