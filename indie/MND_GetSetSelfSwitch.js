//============================================
// MND_GetSetSelfSwitch.js
//============================================
/*:
 * @plugindesc Get / set the self switch of the event.(v1.0)
 * @author Mandarava
 *
 * @help
 *
 * JavaScript code:
 *
 * Set the self switch for the event:
 * SetSelfSwitch(eventId, switchId, value, mapId)
 *   - eventId: event id.
 *   - switchId: self switch id, e.g. "A", "B", "C", "D".
 *   - value: value of the self switch, e.g. true, false.
 *   - mapId: the map id where the event is, if null, means in current map.
 *
 * Set all self switches for all events in current map:
 * SetAllSelfSwitches(switchId, value);
 *   - switchId: self switch id, e.g. "A", "B", "C", "D".
 *   - value: value of the self switch, e.g. true, false.
 *
 * Get the self switch of the event:
 * GetSelfSwitch(eventId, switchId, mapId)
 *   - eventId: event id.
 *   - switchId: self switch id, e.g. "A", "B", "C", "D".
 *   - mapId: the map id where the event is, if null, means in current map.
 *
 * Javascript example:
 *
 *  SetSelfSwitch(1, "A", true);
 *  SetSelfSwitch(1, "A", true, 2);
 *
 *  SetAllSelfSwitches("A", true);
 *
 *  GetSelfSwitch(1, "A")
 *  GetSelfSwitch(1, "A", 2)
 *
 */

/*:zh
 * @plugindesc 获取和设置指定Map中指定Event的指定自有开关的开关状态。(v1.0)
 * @author Mandarava（鳗驼螺）
 * 
 * @help 
 * 
 * 在脚本中调用以下方法：
 * 
 * 设置事件自有开关状态：
 * SetSelfSwitch(eventId, switchId, value, mapId)
 *   - eventId: 事件id。
 *   - switchId: 自有开关的id，可选值："A", "B", "C", "D"
 *   - value: 开关状态，可选值：true, false
 *   - mapId: 事件所在的地图id，如果不提供或为null，则为当前地图。
 * 
 * 设置当前地图中所有事件的自有开关状态：
 * SetAllSelfSwitches(switchId, value);
 *   - switchId: 自有开关的id，可选值："A", "B", "C", "D"
 *   - value: 开关状态，可选值：true, false
 *
 * 获取事件自有开关状态：
 * GetSelfSwitch(eventId, switchId, mapId)
 *   - eventId: 事件id。
 *   - switchId: 自有开关的id，可选值："A", "B", "C", "D"。
 *   - mapId: 事件所在的地图id，如果不提供或为null，则为当前地图。
 * 
 * 示例：
 *  SetSelfSwitch(1, "A", true);    //设置当前地图上ID为1的事件的自有开关A的开关状态为true
 *  SetSelfSwitch(1, "A", true, 2); //设置ID为2的地图上ID为1的事件的自有开关A的开关状态为true
 * 
 *  SetAllSelfSwitches("A", true);  //设置当前地图上所有事件的自有开关A的开关状态为true
 * 
 *  GetSelfSwitch(1, "A")      //获取当前地图上ID为1的事件的自有开关A的开关状态
 *  GetSelfSwitch(1, "A", 2)   //获取ID为2的地图上ID为1的事件的自有开关A的开关状态
 *
 */

(function($){

	GetSelfSwitch=function(eventId, switchId, mapId){
        if (!switchId.match(/^[A-D]$/)) return;
		eventId = Number(eventId)
		mapId = mapId || $gameMap.mapId();
        if (eventId > 0) {
            var key = [mapId, eventId, switchId];
            return $gameSelfSwitches.value(key);
        }
        return false;
	}

	SetSelfSwitch=function(eventId, switchId, value, mapId){
		if (!switchId.match(/^[A-D]$/)) return;
        mapId = mapId || $gameMap.mapId();
        _setSelfSwitch(eventId, switchId, value, mapId);
	}

    SetAllSelfSwitches=function(switchId, value){
        if (!switchId.match(/^[A-D]$/)) return;
        var mapId=$gameMap.mapId();
        for (var i = 1; i < $dataMap.events.length; i++) {
            _setSelfSwitch(i, switchId, value, mapId);
        }
    }

	function _setSelfSwitch(eventId, switchId, value, mapId){
        eventId = Number(eventId);
        if (eventId > 0) {
            var key = [mapId, eventId, switchId];
            $gameSelfSwitches.setValue(key, value);
        }
	}

})();