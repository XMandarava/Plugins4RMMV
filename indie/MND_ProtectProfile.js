//==============================
// MND_ProtectProfile.js
// Copyright (c) 2017 Mandarava
// Homepage: www.popotu.com
//==============================

/*:
 * @plugindesc 用于加密存档的插件，可指定加密密码。(v1.1)
 * @author Mandarava（鳗驼螺）
 * @version 1.1
 *
 * @param Password
 * @text 存档密码，任意数字，通常取0~26之间的数字。
 * @type Number
 * @default Mandarava
 *
 * @help
 * 使用时请修改存档密码，不要使用默认值哦！
 *
 * v1.1 修正字符串加解密算法，支持中文内容。
 *      说明：第1版中提供的字符串加解密算法不支持中文，造成如果属性或数据有中文内容的会加密成不可逆字符串，造成读档失败。
 * v1.0 发布。
 *
 * by Mandarava(鳗驼螺）
 */

(function($){

    var params=PluginManager.parameters("MND_ProtectProfile");
    var password=Number(params["Password"]) || 66;
    console.log("Password="+password);

    DataManager.saveGameWithoutRescue = function(savefileId) {
        var json = JsonEx.stringify(this.makeSaveContents());
        if (json.length >= 200000) {
            console.warn('Save data too big!');
        }
        json=encrypt(json, password); //对json字符串进行加密
        StorageManager.save(savefileId, json);
        this._lastAccessedId = savefileId;
        var globalInfo = this.loadGlobalInfo() || [];
        globalInfo[savefileId] = this.makeSavefileInfo();
        this.saveGlobalInfo(globalInfo);
        return true;
    };

    DataManager.loadGameWithoutRescue = function(savefileId) {
        var globalInfo = this.loadGlobalInfo();
        if (this.isThisGameFile(savefileId)) {
            var json = StorageManager.load(savefileId);
            json=decrypt(json, password); //对加密过的json字符串进行解密
            this.createGameObjects();
            this.extractSaveContents(JsonEx.parse(json));
            this._lastAccessedId = savefileId;
            return true;
        } else {
            return false;
        }
    };

    //===字符串加密解密算法=========
    //凯撒加密算法改自：https://github.com/bukinoshita/caesar-encrypt
    function numToChar(num){
        return String.fromCharCode(97 + num)
    }
    function charToNum(char){
        return char.charCodeAt(0) - 97
    }
    function caesar(char, shift){
        return numToChar(charToNum(char) + (shift % 26))
    }
    function caesarDec(char, shift){
        return numToChar(charToNum(char) - (shift % 26))
    }
    function encryptByCaesar(value, shift){
        var letters = value.split('')

        return letters.map(function (letter) { return caesar(letter, shift); }).join("");
    }
    function decryptByCaesar(value, shift){
        var letters = value.split('')
        return letters.map(function (letter) { return caesarDec(letter, shift); }).join("");
    }

    /**
     * 加密字符串
     * @param text 要加密的字符串
     * @param shift 解密密码（任意数字，通常取0~26之间的数字）
     * @returns {*}
     */
    function encrypt(text, shift) {
        var result=LZString.compressToBase64(text);
        result=encryptByCaesar(result, shift);
        return result;
    }

    /**
     * 解密字符串
     * @param text 要解密的字符串
     * @param shift 解密密码（任意数字，通常取0~26之间的数字）
     */
    function decrypt(text, shift) {
        var result=decryptByCaesar(text, shift);
        result=LZString.decompressFromBase64(result);
        return result;
    }
    //===========================

})();