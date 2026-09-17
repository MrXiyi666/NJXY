//=============================================================================
// Fun_Date.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 全局时间功能
 * @author 希夷先生
 *
 * @help
 * 插件功能：全局时间功能
*/


let _hour = 0;  //本地小时 判断小时数的改变

let year = 0;
let month = 0;
let day = 0;
let hour = 0;
let minute = 0;
let second = 0;
let currentStamp = 0; //当前帧缓存的时间戳

// 获取当前时间
function getDate(){
	return year + "_" + month + "_" + day + "_" + hour + "_" + minute + "_" + second + "_" + ms;
}


/**
 * 判断是否已经过了第二天（旧时间和现在不是同一天）
 * @param {string} date getDate()生成的旧时间字符串 格式: yyyy_m_d_H_m_s
 * @returns {boolean} true=已经跨到下一天(不是同一天)
 */
function isPassNextDay(date) {
	// 空值、null、undefined、空字符串 → 视为跨天
	if (!date || date.length === 0) {
		return true;
	}
	const a = date.split("_").map(Number);
	if(a.length < 6) return true;
	// 不要调用getTime()，保留Date对象
	const oldDate = new Date(a[0], a[1]-1, a[2], a[3], a[4], a[5]);
	// 判断日期是否合法，无效日期直接返回跨天
	if (isNaN(oldDate.getTime())) {
		return true;
	}

	const isSameDay =
		oldDate.getFullYear() === year &&
		oldDate.getMonth() === month-1 &&
		oldDate.getDate() === day;

    return !isSameDay;
}



(() => {

let url = "http://mrxiyi.top/fun_date.php";

// 获取服务器时间
async function getServerTime() {
    try{
        const fetchPromise = fetch(url);
		// 1000 = 1秒
		const timeoutPromise = new Promise((_, reject) => {
			setTimeout(() => reject(new Error("请求超时")), 700);
		});
		const res = await Promise.race([fetchPromise, timeoutPromise]);
        if(!res.ok) throw new Error("http错误:"+res.status);
        // 解析json，对应你php echo输出的数据
        const data = await res.json();
        currentStamp = data.currentStamp;
		year = data.year;
		month = data.month;
		day = data.day;
		hour = data.hour;
		minute = data.minute;
		second = data.second;
		ms = data.ms;
		//console.log("服务器时间", getDate());
    }catch(err){
        // 请求失败 → 降级读取本地时间
        //console.warn("获取服务器时间失败，切换本地时间",err);
        getLocalTime();
		//console.log("本地时间", getDate());
    }finally{
        // 无论成败，解锁状态
        isPHP = false;
		buffer = 0;
		//console.log("重置");
		//console.log("分钟", minute);
    }
}


function getLocalTime(){
	//只获取一次时间
	const now = new Date();
	currentStamp = now.getTime(); //一次性获取毫秒戳

	year = now.getFullYear();
	month = now.getMonth() + 1;
	day = now.getDate();
	hour = now.getHours();
	minute = now.getMinutes();
	second = now.getSeconds();
	ms = now.getMilliseconds();
	
}

//玩家是否移动切换开关3号
let buffer = 0;
let isPHP = false;
const _Scene_Base_prototype_update = Scene_Base.prototype.update;
Scene_Base.prototype.update = function() {
	_Scene_Base_prototype_update.call(this);
	if($gamePlayer.isMoving()){
		//console.log("暂停了");
		$gameSwitches.setValue(3, false);
		return;
	};
	if(!$gameSwitches.value(3)){
		$gameSwitches.setValue(3, true);
	}
	if(buffer > 60){
		if(isPHP === false){
			isPHP = true;
			getServerTime();
		}
	}else{
		buffer++;
	}
};

})();