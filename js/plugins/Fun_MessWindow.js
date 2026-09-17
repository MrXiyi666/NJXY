//=================================================================================================
// Fun_MessWindow.js
//=================================================================================================
/*:
 * @target MZ
 * @plugindesc 消息窗口 全局可用 。
 * @author 希夷先生
 *
 * @help
 * 插件功能：消息窗口 全局可用 。
*/
(() => {

let _MessWindow = null;

function CenterTextWindow(Text){
	
	const _window1 = new Window_Selectable(new Rectangle(0,0, 1,1));
	const text = _window1.convertEscapeCharacters(Text.trim());
	const _text_size = _window1.textSizeEx(text);


    const pad = _window1.padding * 2;
	const width = _text_size.width + pad * 2;
	const height = _text_size.height + pad * 2;

	

	const _window = new Window_Selectable(new Rectangle(Graphics.boxWidth / 2 - width / 2, Graphics.boxHeight / 2 - height / 2, width, height));
	_window.openness = 0;
	_window.mess = true;
	_window.refresh = function(){
		// 文字相对于内容画布居中
		const tx = this.contents.width / 2 - _text_size.width / 2;
		const ty = this.padding;
		this.drawTextEx(text, tx, ty, this.contents.width);
	};
	
	const _open = _window.open;
	_window.open = function(){
		_open.call(this);
		this.refresh();
		this.activate();
	};
	
	const _close = _window.close;
	_window.close = function(){
		_close.call(this);
		_MessWindow = null;
	};
	
    _window.setHandler("ok", function() {
		_window.close();
	});
	
	_window.setHandler("cancel", function() {
		_window.close();
	});
	
	const _update = _window.update;
	_window.update = function(){
		_update.call(this);
		
		if (_window.isOpen() && TouchInput.isTriggered()) {
			_window.processOk();
		}
		
		if(_window.isClosed()){
			if(_window && _window.parent) {
				_window.parent.removeChild(_window);
			}
		}
	};
	_MessWindow = _window;
	SceneManager._scene.addChild(_window);
	_MessWindow.open();
}

Scene_Base.prototype.showTip = function(text) {
    CenterTextWindow(text); 
};

Game_System.prototype.mess = function(text) {
	CenterTextWindow(text);
};
//事件页直接 this.mess即可
Game_Interpreter.prototype.mess = function(text) {
	CenterTextWindow(text);
};

//===============================消息框等待===================================
const _Game_Message_prototype_isBusy = Game_Message.prototype.isBusy;
Game_Message.prototype.isBusy = function() {
	const baseWait = _Game_Message_prototype_isBusy.call(this);
    return baseWait || _MessWindow;
};

// ========== 关键：拦截事件解释器，实现等待阻塞 ==========
const _Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
Game_Interpreter.prototype.updateWaitMode = function() {
    const baseWait = _Game_Interpreter_updateWaitMode.call(this);
    return baseWait || _MessWindow;
};

})();