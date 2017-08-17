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
 * @text 存档密码
 * @default Mandarava
 *
 * @help
 * 使用时请修改存档密码，不要使用默认值，密码尽量长！
 * 这个加密工具强度可以，但会增大存档内容。如果需要简单加密可以使用 MND_ProtectProfile2.js
 *
 * v1.1 修正字符串加解密算法，支持中文内容。
 *      说明：第1版中提供的字符串加解密算法不支持中文，造成如果属性或数据有中文内容的会加密成不可逆字符串，造成读档失败。
 * v1.0 发布。
 *
 * by Mandarava(鳗驼螺）
 */

(function($){

    var params=PluginManager.parameters("MND_ProtectProfile");
    var password=params["Password"] || "Mandarava";

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

    /**
     * 加密字符串
     * @param str 要加密的字符串
     * @param pwd 加密密码
     * @returns {*}
     */
    function encrypt(text, pwd) {
        var result=LZString.compressToBase64(text);
        return encryptEnText(result, pwd);//encryptEnText / decryptEnText不能加解密中文数据，所以先用LZString压缩成英文字符
    }
    /**
     * 解密字符串
     * @param str 要解密的字符串
     * @param pwd 解密的密码
     * @returns {*}
     */
    function decrypt(text, pwd) {
        var result=decryptEnText(text, pwd);
        return LZString.decompressFromBase64(result);
    }

    function encryptEnText(str, pwd) {
        if(pwd == null || pwd.length <= 0) {
            return null;
        }
        var prand = "";
        for(var i=0; i<pwd.length; i++) {
            prand += pwd.charCodeAt(i).toString();
        }
        var sPos = Math.floor(prand.length / 5);
        var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos*2) + prand.charAt(sPos*3) + prand.charAt(sPos*4) + prand.charAt(sPos*5));
        var incr = Math.ceil(pwd.length / 2);
        var modu = Math.pow(2, 31) - 1;
        if(mult < 2) {
            return null;
        }
        var salt = Math.round(Math.random() * 1000000000) % 100000000;
        prand += salt;
        while(prand.length > 10) {
            prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
        }
        prand = (mult * prand + incr) % modu;
        var enc_chr = "";
        var enc_str = "";
        for(var i=0; i<str.length; i++) {
            enc_chr = parseInt(str.charCodeAt(i) ^ Math.floor((prand / modu) * 255));
            if(enc_chr < 16) {
                enc_str += "0" + enc_chr.toString(16);
            } else enc_str += enc_chr.toString(16);
            prand = (mult * prand + incr) % modu;
        }
        salt = salt.toString(16);
        while(salt.length < 8)salt = "0" + salt;
        enc_str += salt;
        return enc_str;
    }
    function decryptEnText(str, pwd) {
        if(str == null || str.length < 8) {
            return null;
        }
        if(pwd == null || pwd.length <= 0) {
            return null;
        }
        var prand = "";
        for(var i=0; i<pwd.length; i++) {
            prand += pwd.charCodeAt(i).toString();
        }
        var sPos = Math.floor(prand.length / 5);
        var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos*2) + prand.charAt(sPos*3) + prand.charAt(sPos*4) + prand.charAt(sPos*5));
        var incr = Math.round(pwd.length / 2);
        var modu = Math.pow(2, 31) - 1;
        var salt = parseInt(str.substring(str.length - 8, str.length), 16);
        str = str.substring(0, str.length - 8);
        prand += salt;
        while(prand.length > 10) {
            prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
        }
        prand = (mult * prand + incr) % modu;
        var enc_chr = "";
        var enc_str = "";
        for(var i=0; i<str.length; i+=2) {
            enc_chr = parseInt(parseInt(str.substring(i, i+2), 16) ^ Math.floor((prand / modu) * 255));
            enc_str += String.fromCharCode(enc_chr);
            prand = (mult * prand + incr) % modu;
        }
        return enc_str;
    }

})();