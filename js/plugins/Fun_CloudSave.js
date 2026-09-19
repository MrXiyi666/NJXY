//=================================================================================================
// Fun_CloudSave.js
//=================================================================================================
/*:
 * @target MZ
 * @plugindesc 云存档功能
 * @author 希夷先生
 *
 * @help
 * 插件功能：云存档功能
*/
(() => {

let url = "http://mrxiyi.top/njxy/";

const _Scene_Title_prototype_initialize = Scene_Title.prototype.initialize;
Scene_Title.prototype.initialize = function() {
	_Scene_Title_prototype_initialize.call(this);
	this._cloudGlobalLoaded = true;
	this.LoadGlobal();
};

const _Scene_Title_prototype_isBusy = Scene_Title.prototype.isBusy;
Scene_Title.prototype.isBusy = function() {
	return _Scene_Title_prototype_isBusy.call(this) || this._cloudGlobalLoaded;
};


Scene_Title.prototype.LoadGlobal = function() {
	StorageManager.loadObject("global")
	.then(info=>{
        if(!info || !Array.isArray(info) || info.length === 0){
            //文件读取成功，但数据无效
            DataManager._globalInfo = [null];
			//console.log("读取到global，但数据无效，使用默认值", info);
        }else{
            DataManager._globalInfo = info;
			//console.log("加载配置成功", info);
        }
        this._cloudGlobalLoaded = false;
	})
	.catch(e=>{
        //文件读取失败
        //console.log("global文件读取失败", e);
        DataManager._globalInfo = [null];
		this._cloudGlobalLoaded = false;
    });
};



DataManager.removeInvalidGlobalInfo = function() {
    return;
};

//保存存档数据
StorageManager.saveZip = function(saveName, zip) {
    return saveData(saveName, zip);
};
//读取存档数据
StorageManager.loadZip = function(saveName) {
    return loadData(saveName);
};

// 保存存档
async function saveData(saveName, zip) {
    const params = new URLSearchParams();
    params.append("name", saveName);
    params.append("data", zip);

    const res = await fetch(url + "save.php", {
        method: "POST",
        body: params
    });
    return await res.text();
}

// 读取存档
async function loadData(saveName) {
    const params = new URLSearchParams();
    params.append("name", saveName);
    const res = await fetch(url + "load.php", {
        method: "POST",
        body: params
    });
    // 返回存档原始字符串（zip文本）
    return await res.text();
}

})();