//=============================================================================
// Fun_Core.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 核心
 * @author 希夷先生
 *
 * @help
 * 插件功能：核心
*/
(() => {

const _SceneMap_updateCallMenu = Scene_Map.prototype.updateCallMenu;
Scene_Map.prototype.updateCallMenu = function() {
    //直接return，不执行原版打开菜单逻辑
    return;
    _SceneMap_updateCallMenu.call(this);
};



//下面是加粗 间距
//=================================修改位图数据===============================
const _Bitmap_prototype_initialize = Bitmap.prototype.initialize;
Bitmap.prototype.initialize = function(width, height) {
	_Bitmap_prototype_initialize.call(this, width, height);
	this.outlineWidth = 8;
	this.fontBold = true;
};

//手动画让他支持间距
const LETTER_SPACING = 8; //单字之间额外间距


//字体加粗加描边 需要加间距
Window_Base.prototype.flushTextState = function(textState) {
    const text = textState.buffer;
    const rtl = textState.rtl;
    const width = this.textWidth(text);
    const height = textState.height;
    const x = rtl ? textState.x - width : textState.x;
    const y = textState.y;
    if (textState.drawing) {
        this.contents.drawText(text, x, y, width, height);
    }
	
	// ========== 修改这一行 ==========
    const addSpace = text.length * LETTER_SPACING;
    if (rtl) {
        textState.x += -width - addSpace;
    } else {
        textState.x += width + addSpace;
    }
    // =================================
	
    //textState.x += rtl ? -width : width;
    textState.buffer = this.createTextBuffer(rtl);
    const outputWidth = Math.abs(textState.x - textState.startX);
    if (textState.outputWidth < outputWidth) {
        textState.outputWidth = outputWidth;
    }
    textState.outputHeight = y - textState.startY + height;
};



//字体高度改为46 适配小设备字体更清晰
Window_Base.prototype.lineHeight = function() {
    return 46;
};

Window_Base.prototype.itemPadding = function() {
    return 10;
};

Window_Selectable.prototype.itemLineRect = function(index) {
    const rect = this.itemRectWithPadding(index);
    const padding = (rect.height - this.lineHeight()) / 2;
    rect.y += padding;
	rect.y += 1;
    rect.height -= padding * 2;
    return rect;
};

const _Window_Base_drawText = Window_Base.prototype.drawText;
Window_Base.prototype.drawText = function(text, x, y, maxWidth, align) {
    text = String(text);
    //拆分为字符数组，兼容中文
    const chars = [...text];
    //文字本体总宽度
    const textW = this.textWidth(text);
    //全部额外间距总长度：字符数‑1
    const totalSpace = (chars.length - 1) * LETTER_SPACING;
    //加上间距之后完整总宽度
    const fullW = textW + totalSpace;

    let cx = x;
    //居中修正起点
    if (align === "center") {
        cx = x + (maxWidth - fullW) / 2;
    }
    //右对齐修正起点
    else if (align === "right") {
        cx = x + (maxWidth - fullW);
    }

    //循环逐个绘制每个字
    for (const ch of chars) {
        const w = this.textWidth(ch);
        this.contents.drawText(ch, cx, y, maxWidth, this.lineHeight(), "left");
        cx += w + LETTER_SPACING;
    }
};

Bitmap.prototype.drawText = function(text, x, y, maxWidth, lineHeight, align) {
    // [Note] Different browser makes different rendering with
    //   textBaseline == 'top'. So we use 'alphabetic' here.
    const context = this.context;
    const alpha = context.globalAlpha;
    maxWidth = maxWidth || 0xffffffff;

    text = String(text);
    const chars = [...text];

    // 1、计算所有文字本体宽度总和
    let charTotalWidth = 0;
    for (const c of chars) {
        charTotalWidth += this.measureTextWidth(c);
    }
    // 所有间隙总宽度：N个字 → N‑1个空隙
    const gapTotal = (chars.length - 1) * LETTER_SPACING;
    const fullBlockWidth = charTotalWidth + gapTotal;

    // 2、计算第一个字的起始X坐标（处理左/居中/右对齐）
    let cx = x;
    if (align === "center") {
        cx = x + (maxWidth - fullBlockWidth) / 2;
    } else if (align === "right") {
        cx = x + (maxWidth - fullBlockWidth);
    }

    context.save();
    context.font = this._makeFontNameText();
    context.textBaseline = "alphabetic";

    // 3、循环逐个绘制文字
    for (const ch of chars) {
        const ty = Math.round(y + lineHeight / 2 + this.fontSize * 0.35);
        context.textAlign = "left"; //逐字绘制强制左对齐

        context.globalAlpha = 1;
        this._drawTextOutline(ch, cx, ty, maxWidth);
        context.globalAlpha = alpha;
        this._drawTextBody(ch, cx, ty, maxWidth);

        // 当前文字宽度
        const w = this.measureTextWidth(ch);
        cx += w + LETTER_SPACING;
    }

    context.restore();
    this._baseTexture.update();
};
//上面是加粗 间距

//下面是商店的修改
Scene_Shop.prototype.statusWindowRect = function() {
    const ww = this.statusWidth()-100;
    const wh = this._dummyWindow.height;
    const wx = Graphics.boxWidth - ww;
    const wy = this._dummyWindow.y;
    return new Rectangle(wx, wy, ww, wh);
};
Scene_Shop.prototype.buyWindowRect = function() {
    const wx = 0;
    const wy = this._dummyWindow.y;
    const ww = Graphics.boxWidth - this.statusWidth() + 100;
    const wh = this._dummyWindow.height;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Shop.prototype.numberWindowRect = function() {
    const wx = 0;
    const wy = this._dummyWindow.y;
    const ww = Graphics.boxWidth - this.statusWidth() + 100;
    const wh = this._dummyWindow.height;
    return new Rectangle(wx, wy, ww, wh);
};

Window_ShopNumber.prototype.drawCurrentItemName = function() {
    const padding = this.itemPadding();
    const x = padding * 2;
    const y = this.itemNameY();
    const width = this.multiplicationSignX() - padding * 3;
    this.drawItemName(this._item, x, y - 50, width);
};

Window_ShopNumber.prototype.multiplicationSign = function() {
    return "";
};

Window_ShopNumber.prototype.cursorWidth = function() {
    const padding = this.itemPadding();
    const digitWidth = this.textWidth("00");
    return this.maxDigits() * digitWidth + padding * 2 - 4;
};

Window_ShopBuy.prototype.drawItem = function(index) {
    const item = this.itemAt(index);
    const price = this.price(item);
    const rect = this.itemLineRect(index);
    const priceWidth = this.priceWidth();
    const priceX = rect.x + rect.width - priceWidth;
    const nameWidth = rect.width - priceWidth;
    this.changePaintOpacity(this.isEnabled(item));
    this.drawItemName(item, rect.x, rect.y, nameWidth);
    //this.drawText(price, priceX, rect.y, priceWidth, "right");
    this.changePaintOpacity(true);
};

//图表和文本间距
Window_Base.prototype.drawItemName = function(item, x, y, width) {
    if (item) {
        const iconY = y + (this.lineHeight() - ImageManager.iconHeight) / 2;
        const delta = ImageManager.standardIconWidth - ImageManager.iconWidth;
        const textMargin = ImageManager.standardIconWidth + 4;
        const itemWidth = Math.max(0, width - textMargin);
        this.resetTextColor();
        this.drawIcon(item.iconIndex, x + delta / 2, iconY);
        this.drawText(item.name, x + textMargin + 10, y, itemWidth);
    }
};

//去掉光标背景
Window_Selectable.prototype.drawItemBackground = function(index) {
    const rect = this.itemRect(index);
    //this.drawBackgroundRect(rect);
};

//金币窗口间距调整
Window_Base.prototype.drawCurrencyValue = function(value, unit, x, y, width) {
    const unitWidth = Math.min(80, this.textWidth(unit));
    this.resetTextColor();
    this.drawText(value, x-12, y, width - unitWidth - 6, "right");
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(unit, x + width - unitWidth, y, unitWidth, "right");
};
//对话框上移 适配底部菜单
Scene_Message.prototype.messageWindowRect = function() {
    const ww = Graphics.boxWidth;
    const wh = this.calcWindowHeight(3, false) + 8;
    const wx = (Graphics.boxWidth - ww) / 2;
    const wy = 0;
    return new Rectangle(wx, wy, ww, wh);
};

//=================================窗口子项背景颜色===============================
ColorManager.itemBackColor1 = function() {
    return "rgba(23, 131, 149, 0.5)";
};

ColorManager.itemBackColor2 = function() {
    return "rgba(80, 80, 80, 0.5)";
};

//系统菜单调整
Scene_Menu.prototype.commandWindowRect = function() {
    const ww = this.mainCommandWidth();
    const wh = this.calcWindowHeight(2, true);
    const wx = Graphics.boxWidth / 2 - this.mainCommandWidth() / 2;
    const wy = Graphics.boxHeight / 2- 57;
    return new Rectangle(wx, wy, ww, wh);
};

//去掉死亡游戏结束 死亡游戏不结束 恢复1点生命
Scene_Base.prototype.checkGameover = function() {
    if ($gameParty.isAllDead()) {
        $gameParty.reviveBattleMembers();
    }
};

//=============================================================================
//=================================存档点核心功能===============================
//=============================================================================	
//不保存bgm
Scene_Load.prototype.terminate = function() {
	Scene_File.prototype.terminate.call(this);
	if (this._loadSuccess) {
		//$gameSystem.onAfterLoad();
	}
};
// 保存原方法
const _Scene_Load_create = Scene_Load.prototype.create;
Scene_Load.prototype.create = function() {
    _Scene_Load_create.call(this);
    // 进入读档场景立刻自动加载 1 号存档
    this.executeLoad(1);
        
};
// 确保 helpWindow 消失
Scene_Load.prototype.helpWindowRect = function() {
    return new Rectangle(0, 0, 0, 0);
};
// 确保 listWindowRect 消失
Scene_Load.prototype.listWindowRect = function() {
    return new Rectangle(0, 0, 0, 0);
};
//继续游戏跳转到存档
Scene_Title.prototype.commandContinue = function() {
    this._commandWindow.close();
    SceneManager.goto(Scene_Load);
};
// 重写：读档失败 → 自动返回标题
Scene_Load.prototype.onLoadFailure = function() {
    SoundManager.playBuzzer();
    SceneManager.goto(Scene_Title); // 自动回标题
};
Scene_Load.prototype.onSavefileOk = function() {
       
};
 
Scene_Load.prototype.cancelScene = function() {
  
};

//对话框上移适配底部按钮
Window_Message.prototype.updatePlacement = function() {
	const goldWindow = this._goldWindow;
	this._positionType = $gameMessage.positionType();
	this.y = (this._positionType * (Graphics.boxHeight - this.height)) / 2;
	if(this._positionType == 2){
		this.y = this.y - 68;
	}
	if (goldWindow) {
		goldWindow.y = this.y > 0 ? 0 : Graphics.boxHeight - goldWindow.height;
	}
};

Window.prototype._updatePauseSign = function() {
    //取消暂停标记
};
Window_Scrollable.prototype.updateArrows = function() {
    this.downArrowVisible = false;
    this.upArrowVisible = false;
};

//环境设置级关闭触屏按钮
const _Scene_Base_prototype_create = Scene_Base.prototype.create
Scene_Base.prototype.create = function() {
    _Scene_Base_prototype_create.call(this);
	ConfigManager.touchUI = false;	//取消返回按钮
};
Window_Options.prototype.addGeneralOptions = function() {
	this.addCommand(TextManager.alwaysDash, "alwaysDash");
	this.addCommand(TextManager.commandRemember, "commandRemember");
	//this.addCommand(TextManager.touchUI, "touchUI");
};
//环境设置最大6个
Scene_Options.prototype.maxCommands = function() {
	// Increase this value when adding option items.
	return 6;
};

//金币突破到9亿
Game_Party.prototype.maxGold = function() {
    return 999999999;
};

Scene_Menu.prototype.statusWindowRect = function() {
    const ww = Graphics.boxWidth - this.mainCommandWidth();
    const wh = this.mainAreaHeight();
    const wx = 10000;//this.isRightInputMode() ? 0 : Graphics.boxWidth - ww;
    const wy = this.mainAreaTop();
    return new Rectangle(wx, wy, ww, wh);
};
//更改颜色色调
Game_Screen.prototype.startTint = function(tone, duration) {
    // 新增：如果颜色没有变化，直接返回，什么都不做
    if (
        this._tone[0] === tone[0] &&
        this._tone[1] === tone[1] &&
        this._tone[2] === tone[2] &&
        this._tone[3] === tone[3]
    ) {
        return;
    }
    this._toneTarget = tone.clone();
    this._toneDuration = duration;
    if (this._toneDuration === 0) {
        this._tone = this._toneTarget.clone();
    }
};


//=============================读取本地Txt文件 并且返回随机一个内容======================================
//使用方法 $gameSystem.getText();
Game_System.prototype.getText = function(file_name) {
	let data = file_name;
	if(StorageManager.isLocalMode()){
		data = StorageManager.fsReadFile(file_name);
	}else{
		const xhr = new XMLHttpRequest();
        xhr.open('GET', file_name, false);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send();
		if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
			data = xhr.responseText;
		}else{
			data = "";
		}
    }
	
	let arr = data.split("-");
    let randomItem = "";
	let maxLoop = 100;
    while (randomItem.trim() === "" && maxLoop > 0) {
        let randomIndex = Math.floor(Math.random() * arr.length);
        randomItem = arr[randomIndex];
		maxLoop--;
    }
    
    return randomItem.trimStart();
};
//使用方法 this.getText();
Game_Interpreter.prototype.getText = function(file_name) {
	let data = file_name;
	if(StorageManager.isLocalMode()){
		data = StorageManager.fsReadFile(file_name);
	}else{
		const xhr = new XMLHttpRequest();
        xhr.open('GET', file_name, false);
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send();
		if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
			data = xhr.responseText;
		}else{
			data = "";
		}
    }
	
	let arr = data.split("-");
    let randomItem = "";
	let maxLoop = 100;
    while (randomItem.trim() === "" && maxLoop > 0) {
        let randomIndex = Math.floor(Math.random() * arr.length);
        randomItem = arr[randomIndex];
		maxLoop--;
    }
    
    return randomItem.trimStart();
};

})();