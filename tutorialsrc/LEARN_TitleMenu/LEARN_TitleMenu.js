/*:
 * @plugindesc 标题画面前景、背景、菜单等美化。
 * @author Mandarava（鳗驼螺）
 *
 * @help
 * 本插件针对的教程地址：http://www.jianshu.com/p/527a82a2fd6a
 * 
 * version 1.1 (2017/12/19) 优化菜单点选方式
 * version 1.0 (2017/06/21) 发布
 *
 */

//=================图片菜单=================

var _Scene_Title_create = Scene_Title.prototype.create;
Scene_Title.prototype.create = function () {
    _Scene_Title_create.call(this);
    this._commandWindow.visible = false;//不显示原始的文本菜单
    this._commandWindow.x=Graphics.width;//移到画面外去，否则虽然不显示仍能点击
    var btnimgs=["CmdStartGame", "CmdContinueGame", "CmdOptions", "CmdHomepage"];
    var clicks=[
		//方案一
        //function(){this.commandNewGame(); SoundManager.playOk();},
        //function(){this.commandContinue(); SoundManager.playOk();},
        //function(){this.commandOptions(); SoundManager.playOk();},
        //function(){this.commandHomepage(); SoundManager.playOk();}
		//方案二：优化
		function(){if(this._commandWindow.index()!=0){this._commandWindow.select(0);}else{this._commandWindow.processOk();}; SoundManager.playOk();},
        function(){if(this._commandWindow.index()!=1){this._commandWindow.select(1);}else{this._commandWindow.processOk();}; SoundManager.playOk();},
        function(){if(this._commandWindow.index()!=2){this._commandWindow.select(2);}else{this._commandWindow.processOk();}; SoundManager.playOk();},
        function(){if(this._commandWindow.index()!=3){this._commandWindow.select(3);}else{this._commandWindow.processOk();} SoundManager.playOk();}
    ];
    this._cmdButtons=[];//所有图片菜单
    for(var i in btnimgs){
        var sprite=new Sprite_Button();
        sprite.width=184;
        sprite.height=53;
        sprite.bitmap=ImageManager.loadBitmap("img/mndtitle/", btnimgs[i]);
        //sprite.anchor=new Point(0.5,0.5);//不要设置，设置这个会出现菜单点不中的问题，不清楚原因。
        sprite.x=Graphics.width/2-92;
        sprite.y=360+60*i;
        sprite.setClickHandler(clicks[i].bind(this));
        this._cmdButtons.push(sprite);
        this.addChild(sprite);
    }
    this._cmdSelect=new Sprite(ImageManager.loadBitmap("img/mndtitle/", "CmdSelect"));//选中菜单的指示器
    this._cmdSelect.anchor=new Point(1,0);//因为按钮的anchor是默认的(0,0),这个指示器要放在按钮左侧，所以让它的anchor为(1,0)更容易定位
    this.addChild(this._cmdSelect);
};

//=================添加自定义菜单：官方网站=================

var _Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
Window_TitleCommand.prototype.makeCommandList = function () {
    _Window_TitleCommand_makeCommandList.call(this);

    this.addCommand("官方网站", 'homepage');//增加一个新菜单，标识符为 homepage
};

var _Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
Scene_Title.prototype.createCommandWindow = function() {
    _Scene_Title_createCommandWindow.call(this);

    this._commandWindow.setHandler('homepage', this.commandHomepage.bind(this)); //将标识符为homepage的菜单绑定到commandHomepage方法
};

Scene_Title.prototype.commandHomepage = function() {
    this._commandWindow.activate();
    //打开url
    var cmd;
    if (process.platform === 'darwin') cmd = 'open';
    if (process.platform === 'win32') cmd = 'explorer.exe';
    if (process.platform === 'linux') cmd = 'xdg-open';
    var spawn = require('child_process').spawn;
    spawn(cmd, ["http://www.jianshu.com/nb/13204998"]);
};

//=================标题前景、背景修改=================

Scene_Title.prototype.createForeground = function() {
    if ($dataSystem.optDrawTitle) {
        var gameLogo = ImageManager.loadBitmap("img/mndtitle/", "GameLogo");
        this._gameTitleSprite = new Sprite(gameLogo);
        this._gameTitleSprite.anchor = new Point(0.5, 0);
        this._gameTitleSprite.x = Graphics.width / 2;
        this._gameTitleSprite.y = 40;
        this.addChild(this._gameTitleSprite);
    }
};

Scene_Title.prototype.createBackground = function() {
    this._animFrameImgs=[
        ImageManager.loadBitmap("img/mndtitle/", "TitleBack1"),
        ImageManager.loadBitmap("img/mndtitle/", "TitleBack2"),
        ImageManager.loadBitmap("img/mndtitle/", "TitleBack3")
    ];
    this._animFrames=[0,1,2,1];
    this._currFrame=0;
    this._animDelay=0.2;
    this._backSprite = new Sprite(this._animFrameImgs[0]);
    this.centerSprite(this._backSprite)
    this.addChild(this._backSprite);
};

Scene_Title.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    SceneManager.clearStack();
    //this.centerSprite(this._backSprite1);//删除
    //this.centerSprite(this._backSprite2);//删除
    this.playTitleMusic();
    this.startFadeIn(this.fadeSpeed(), false);
};

var _Scene_Title_update = Scene_Title.prototype.update;
Scene_Title.prototype.update = function() {
    _Scene_Title_update.call(this);

    //动态背景：更新动画
    this._elapsedSinceLastUpdate = this._elapsedSinceLastUpdate || 0;
    if (this._elapsedSinceLastUpdate >= this._animDelay) {
        this._currFrame++;
        this._currFrame = this._currFrame % this._animFrames.length;
        var animFrameIndex = this._animFrames[this._currFrame];
        this._backSprite.bitmap = this._animFrameImgs[animFrameIndex];
        this._elapsedSinceLastUpdate = 0;
    }
    this._elapsedSinceLastUpdate += 1 / Graphics._fpsMeter.fps;

    //图片菜单相关：在当前选中的图片菜单前面加个指示器
    var btnSelect = this._cmdButtons[this._commandWindow.index()];
    this._cmdSelect.x = btnSelect.x;
    this._cmdSelect.y = btnSelect.y;
};