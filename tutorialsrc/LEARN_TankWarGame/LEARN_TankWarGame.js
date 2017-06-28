/*:
 * @plugindesc 坦克大战小游戏
 * @author Mandarava（鳗驼螺）
 *
 * @help
 * 本插件针对的教程地址：http://www.jianshu.com/p/ddfa12f1acc9
 *
 */

var Scene_Boot_start = Scene_Boot.prototype.start;
/**
 * 使游戏在运行时直接进入坦克大战游戏的标题画面，如果要使用NPC打开坦克大战小游戏，请将下面的
 * 重写`Scene_Boot.prototype.start`方法的代码注释掉，在你的MV地图中添加NPC，并调用脚本：
 * `SceneManager.goto(Scene_TankWarTitle)` 即可。
 */
Scene_Boot.prototype.start = function () {
    Scene_Base.prototype.start.call(this);
    SoundManager.preloadImportantSounds();
    if (DataManager.isBattleTest()) {
        DataManager.setupBattleTest();
        SceneManager.goto(Scene_Battle);
    } else if (DataManager.isEventTest()) {
        DataManager.setupEventTest();
        SceneManager.goto(Scene_Map);
    } else {
        this.checkPlayerLocation();
        DataManager.setupNewGame();
        SceneManager.goto(Scene_TankWarTitle);//MV游戏启动时直接进入坦克大战游戏的标题画面
        Window_TitleCommand.initCommandPosition();
    }
    this.updateDocumentTitle();
};

//-----------------------------------------------------------------------------
/**
 * 扩展ImageManager，该方法用于从 img/mndtankwar 文件夹中加载指定名称的图片
 * @param filename
 * @param hue
 */
ImageManager.loadTankwar = function (filename, hue) {
    return ImageManager.loadBitmap("img/mndtankwar/", filename, hue, false);
};

//-----------------------------------------------------------------------------
/**
 * 精灵表(Sprite Sheet)切帧方法
 * @param texture 精灵表图片
 * @param frameWidth 帧图片的宽度
 * @param frameHeight 帧图片的高度
 * @returns {Array} 帧信息（帧图片在精灵表图片中的坐标、宽度、高度信息）数组
 */
function makeAnimFrames(texture, frameWidth, frameHeight) {
    var rows=parseInt(texture.height/frameHeight);  //包含的帧图片行数
    var cols=parseInt(texture.width/frameWidth);    //包含的帧图片列数
    var animFrames = [];	//二维数组，对应于精灵表的各行各列中的每一帧，其每个元素用于存储每行的所有帧信息
    for(var row=0;row<rows;row++) {
        animFrames.push([]);//二维数组的每个元素是一个一维数组
        for (var col=0;col<cols;col++) {
            var frame={		//帧信息，格式如：{x: 0, y: 0, width: 40, height: 40}，表示该帧图片在精灵表中的坐标及尺寸信息
                x: col * frameWidth,
                y: row * frameHeight,
                width: frameWidth,
                height: frameHeight
            };
            animFrames[row].push(frame);//一维数组的每个元素是一个frame帧信息
        }
    }
    return animFrames;
}

//-----------------------------------------------------------------------------
/**
 * 坦克大战游戏标题画面场景
 * @constructor
 */
function Scene_TankWarTitle() {
    this.initialize.apply(this, arguments);
};

Scene_TankWarTitle.prototype = Object.create(Scene_Base.prototype);
Scene_TankWarTitle.prototype.constructor = Scene_TankWarTitle;

Scene_TankWarTitle.prototype.create = function () {
    Scene_Base.prototype.create.call(this);

    this._backgroundSprite=new Sprite(ImageManager.loadTankwar("TitleBack"));//显示背景的精灵
    this.addChild(this._backgroundSprite);  //将背景加入场景

    this._logo=new Sprite(ImageManager.loadTankwar("Logo"));//显示Logo的精灵
    this._logo.anchor=new Point(0.5,0.5);   //设置锚点到其正中心
    this._logo.x=Graphics.boxWidth/2;       //设置Logo的x坐标
    this._logo.y=Graphics.boxHeight/2;      //设置Logo的y坐标
    this.addChild(this._logo);
};

Scene_TankWarTitle.prototype.update = function () {
    if(Input.isTriggered('ok') || TouchInput.isTriggered()){//当玩家按下确定键或点击屏幕
        SceneManager.goto(Scene_TankWar);   //进入游戏主场景：战场场景
    }
};

//-----------------------------------------------------------------------------
/**
 * 坦克大战游戏结束画面场景
 * @constructor
 */
function Scene_TankWarGameOver() {
    this.initialize.apply(this, arguments);
};

Scene_TankWarGameOver.prototype = Object.create(Scene_Base.prototype);
Scene_TankWarGameOver.prototype.constructor = Scene_TankWarGameOver;

/**
 * 用于向本场景传递参数
 * @param isWin 是否取得胜利
 */
Scene_TankWarGameOver.prototype.prepare = function(isWin) {
    this._isWin = isWin;
};

Scene_TankWarGameOver.prototype.create = function () {
    Scene_Base.prototype.create.call(this);

    this._backgroundSprite=new Sprite(ImageManager.loadTankwar("TitleBack"));//显示背景图片的精灵
    this.addChild(this._backgroundSprite);

    var image = ImageManager.loadTankwar(this._isWin ? "YouWin" : "YouLose");//根据输赢加载相应的图片
    this._logo=new Sprite(image);//显示输赢logo的精灵
    this._logo.anchor=new Point(0.5,0.5);
    this._logo.x=Graphics.boxWidth/2;
    this._logo.y=Graphics.boxHeight/2;
    this.addChild(this._logo);
};

Scene_TankWarGameOver.prototype.update = function () {
    if(Input.isTriggered('ok') || TouchInput.isTriggered()){
        SceneManager.goto(Scene_TankWarTitle);//进入标题画面场景
    }
};

//-----------------------------------------------------------------------------
/**
 * 坦克大战游戏主场景：战场场景
 * @constructor
 */
function Scene_TankWar() {
    this.initialize.apply(this, arguments);
};

Scene_TankWar.prototype = Object.create(Scene_Base.prototype);
Scene_TankWar.prototype.constructor = Scene_TankWar;

Scene_TankWar.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);

    this._isGameOver = false;     //游戏是否结束：如果玩家被消灭，或玩家消灭了20辆敌从坦克则游戏结束
    this._maxEnemyCount = 20;     //打完20个胜利
    this._eliminatedEnemy = 0;    //当前消灭的敌人数量
    this._desireFinishTick = 120; //游戏结束（输或赢）后转到结束画面的时间
    this._finishTick = 0;         //从结束开始流逝的时间
    this._playerSpeed = 2;        //玩家坦克的移动速度
    this._playerBullets = [];     //保存所有由玩家坦克发出的炮弹精灵
    this._enemyTanks = [];        //保存所有生成的敌人坦克精灵
    this._enemyBullets = [];      //保存所有由敌人坦克发出的炮弹精灵
    this._explodes = [];          //保存所有生成的爆炸效果精灵
};

/**
 * 加载精灵的纹理图片
 */
Scene_TankWar.prototype.loadTextures = function () {
    this._playerTexture=ImageManager.loadTankwar("TankPlayer");     //加载玩家坦克的纹理图片
    this._enemyTexture=ImageManager.loadTankwar("TankEnemy");       //加载敌人坦克的纹理图片
    this._bulletRedTexture=ImageManager.loadTankwar("BulletRed");   //加载炮弹的纹理图片
    this._explodeTexture=ImageManager.loadTankwar("Explode");       //加载爆炸效果的纹理图片
};

/**
 * 在场景上部y坐标为60的地方随机x位置生成敌人
 */
Scene_TankWar.prototype.createEnemy = function () {
    var tankEnemy = new Sprite_Enemy(this._enemyTexture, 40, 40, 1); //敌人坦克使用精灵表TankEnemy.png，其尺寸160x160，每行4帧图片，每列4帧图片，所以每帧的宽高为40x40
    tankEnemy.speed = 2;//设置坦克的行驶速度
    tankEnemy.x = 60 + Math.randomInt(Graphics.boxWidth - 120); //设置坦克随机x坐标，这样使每个敌人坦克出生地都不一样
    tankEnemy.y = 60;   //坦克出生的y坐标始终在60处
    tankEnemy.look(Direction.Down); //初始时让敌人坦克面向下
    this.addChild(tankEnemy);       //将坦克加入到场景

    //使用MV中的动画来展示敌人坦克出现时的一个发光传送效果
    var animation = $dataAnimations[46];            //根据动画ID获取MV数据库中的动画
    tankEnemy.startAnimation(animation, false, 0);  //让坦克展示此动画（动画会跟着坦克走）
    this._enemyTanks.push(tankEnemy);               //将敌人坦克对象加入_enemyTanks数组中，以便于后续操作
};


/**
 * 在指定位置生成爆炸精灵
 * @param x 爆炸精灵要显示在的x坐标
 * @param y 爆炸精灵要显示在的y坐标
 */
Scene_TankWar.prototype.createExplode = function (x, y) {
    var explode = new Sprite_Explode(this._explodeTexture); //图片Explode.png由8帧组成，只有1行，尺寸为1024128
    explode.x = x;
    explode.y = y;
    explode.anchor = new Point(0.5, 0.5);
    explode.scale = new Point(0.7, 0.7); //由于素材比较大，所以可以用scale来缩小精灵到原来的0.7倍
    this._explodes.push(explode); //将爆炸对象加入_explodes数组中，以便于后续操作
    this.addChild(explode);
};

Scene_TankWar.prototype.create = function () {
    Scene_Base.prototype.create.call(this);

    this._backgroundSprite = new Sprite(ImageManager.loadTankwar("Background"));//创建背景精灵用于显示背景Background.png图片
    this.addChild(this._backgroundSprite); //将背景精灵加入场景
    this.loadTextures(); //加载所需的素材
};

Scene_TankWar.prototype.start = function () {
    Scene_Base.prototype.start.call(this);

    //播放开始音效 TankWarStart.ogg / TankWarStart.m4a，注意参数格式是一个包含特定属性的对象
    AudioManager.playSe({
        name:"TankWarStart",    //音频文件名
        pan:0,                  //pan值，可能是用于声道均衡的值，参考：https://en.wikipedia.org/wiki/Panning_%28audio%29
        pitch:100,              //pitch音高值
        volume:100              //volume音量值
    });
    //增加玩家坦克到场景中
    this._player=new Sprite_Tank(this._playerTexture, 40, 40, 2);//玩家坦克使用精灵表TankPlayer.png，其尺寸160x160，每行4帧图片，每列4帧图片，所以每帧的宽高为40x40
    this._player.speed=0; //坦克的初始速度为0，因为这个坦克是由玩家操控的，一开始玩家未操控时速度就是0，静止的
    this._player.x=Graphics.boxWidth/2; //将坦克的x坐标设置在场景的正中间
    this._player.y=Graphics.height-this._player.height-20; //坦克的y坐标设置在场景的底部向上20个单位处
    this.addChild(this._player); //将坦克加入场景
};

Scene_TankWar.prototype.update = function () {
    Scene_Base.prototype.update.call(this);

    //按键检测和处理
    if (this._player.state == Tank_State.Live) {
        this._player.speed = 0; //先取消速度，因为玩家可能没有按任何方向键
        if (Input.isPressed("down")) {              //按向下键
            this._player.look(Direction.Down);      //让坦克向下看
            this._player.speed = this._playerSpeed; //重置速度
        }
        if (Input.isPressed("left")) {              //按向左键
            this._player.look(Direction.Left);      //让坦克向左看
            this._player.speed = this._playerSpeed;
        }
        if (Input.isPressed("right")) {             //按向右键
            this._player.look(Direction.Right);     //让坦克向右看
            this._player.speed = this._playerSpeed;
        }
        if (Input.isPressed("up")) {                //按向上键
            this._player.look(Direction.Up);        //让坦克向上看
            this._player.speed = this._playerSpeed;
        }
        if (Input.isPressed("control") && this._player.canFire) {   //按Ctrl键发射炮弹
            var bullet = this._player.fire(this._bulletRedTexture); //玩家坦克开火，得到炮弹对象
            this._playerBullets.push(bullet);   //将玩家打出的炮弹加入_playerBullets数组中，以便于后续操作
            this.addChild(bullet);              //将炮弹加入到场景中
        }
        if (this._player.speed != 0) this._player.move();//移动玩家坦克
    }

    //玩家打出的炮弹出界检测，如果炮弹超出画面边界，则将它们从游戏中移除
    for (var i = this._playerBullets.length - 1; i >= 0; i--) {
        this._playerBullets[i].move();
        if (this._playerBullets[i].x >= Graphics.boxWidth ||
            this._playerBullets[i].x <= 0 ||
            this._playerBullets[i].y >= Graphics.boxHeight ||
            this._playerBullets[i].y <= 0) {
            var outBullet = this._playerBullets.splice(i, 1)[0]; //找到一个出界的炮弹
            this.removeChild(outBullet); //从画面移除出界的炮弹
        }
    }
    //玩家炮弹与敌人碰撞检测，如果炮弹与敌人坦克碰撞，炮弹消失，敌人受到1点伤害
    for (var i = this._playerBullets.length - 1; i >= 0; i--) {
        for (var ti = this._enemyTanks.length - 1; ti >= 0; ti--) {
            if (this._enemyTanks[ti].state != Tank_State.Live) continue; //正在死亡或已经死亡的就不用处理了，也就是炮弹能穿过它们
            if (this._playerBullets[i].x >= this._enemyTanks[ti].x - this._enemyTanks[ti].width / 2 &&
                this._playerBullets[i].x <= this._enemyTanks[ti].x + this._enemyTanks[ti].width / 2 &&
                this._playerBullets[i].y >= this._enemyTanks[ti].y - this._enemyTanks[ti].height / 2 &&
                this._playerBullets[i].y <= this._enemyTanks[ti].y + this._enemyTanks[ti].height / 2) {

                var deadBullet = this._playerBullets.splice(i, 1)[0];//找到一个与敌人坦克碰撞的炮弹
                this.removeChild(deadBullet); //将炮弹从场景中移除
                this._enemyTanks[ti].hurt(1);       //被炮弹击中的敌人坦克受到1点HP伤害
                if (this._enemyTanks[ti].hp <= 0) { //检测敌人坦克是否还有hp生命值，如果死亡：
                    this._eliminatedEnemy++;        //玩家消灭的敌人数量增加1
                    this._isGameOver = this._eliminatedEnemy >= this._maxEnemyCount;    //如果消灭的敌人数量达到20个，游戏结束
                    this.createExplode(this._enemyTanks[ti].x, this._enemyTanks[ti].y); //在坦克的位置显示一个爆炸效果
                    AudioManager.playSe({   //播放一个爆炸音效 Explosion1.ogg / Explosion1.m4a
                        name: "Explosion1",
                        pan: 0,
                        pitch: 100,
                        volume: 100
                    });
                }
                break;
            }
        }
    }
    //检测是否有死亡的坦克，将其从场景内移除
    for (var i = this._enemyTanks.length - 1; i >= 0; i--) {
        if (this._enemyTanks[i].state == Tank_State.Dead) { //依次检测每个坦克的状态，看是否死亡
            var deadTank = this._enemyTanks.splice(i, 1)[0]; //找到一辆死亡的坦克
            this.removeChild(deadTank); //将死亡的坦克从战场移除
        }
    }

    //创建新的敌人加入战场
    if (!this._isGameOver && //未结束游戏时才允许增加敌人
        this._eliminatedEnemy + this._enemyTanks.length < this._maxEnemyCount && //被消灭的敌人数量和在场上的敌人数量不足最大值（20辆）时才允许增加敌人
        this._enemyTanks.length < 4) { //场上的敌人不足4人时才允许增加敌人
        this.createEnemy(); //创建新的敌人并将它加入战场
    }
    //敌人坦克自动开火
    if (!this._isGameOver) {//如果游戏未结束才允许敌人开火
        for (var i in this._enemyTanks) {
            if (this._enemyTanks[i].canFire) { //检测坦克是否能开火
                var bullet = this._enemyTanks[i].fire(this._bulletRedTexture); //坦克开火，生成一个炮弹对象
                this._enemyBullets.push(bullet); //将炮弹对象加入_enemyBullets数组，以便于后续操作
                this.addChild(bullet); //将炮弹加入场景
            }
        }
    }
    //敌人炮弹出界检测，如果炮弹超出画面边界，则将它们从游戏中移除
    for (var i = this._enemyBullets.length - 1; i >= 0; i--) {
        this._enemyBullets[i].move();
        if (this._enemyBullets[i].x >= Graphics.boxWidth ||
            this._enemyBullets[i].x <= 0 ||
            this._enemyBullets[i].y >= Graphics.boxHeight ||
            this._enemyBullets[i].y <= 0) {
            var outBullet = this._enemyBullets.splice(i, 1)[0]; //找到一个出界的炮弹
            this.removeChild(outBullet); //从画面移除出界的炮弹
        }
    }
    //敌人炮弹与玩家碰撞检测，如果敌人炮弹碰到玩家坦克，炮弹消失，玩家受1点伤害
    for (var i = this._enemyBullets.length - 1; i >= 0; i--) {
        if (this._enemyBullets[i].x >= this._player.x - this._player.width / 2 &&
            this._enemyBullets[i].x <= this._player.x + this._player.width / 2 &&
            this._enemyBullets[i].y >= this._player.y - this._player.height / 2 &&
            this._enemyBullets[i].y <= this._player.y + this._player.height / 2) {

            var deadBullet = this._enemyBullets.splice(i, 1)[0];//找到一个与玩家坦克碰撞的炮弹
            this.removeChild(deadBullet); //将炮弹从场景中移除
            this._player.hurt(1);         //玩家受到1点HP伤害
            if (this._player.hp <= 0) {   //检测玩家是否还有hp生命值，如果死亡：
                this.createExplode(this._player.x, this._player.y); //创建一个爆炸效果
                AudioManager.playSe({     //播放一个爆炸音效 Explosion1.ogg / Explosion1.m4a
                    name: "Explosion1",
                    pan: 0,
                    pitch: 100,
                    volume: 100
                });
            } else { //如果玩家坦克还有hp生命值
                AudioManager.playSe({ //播放一个被打击的音效 Shot2.ogg / Shot2.m4a
                    name: "Shot2",
                    pan: 0,
                    pitch: 100,
                    volume: 100
                });
            }
            break;
        }
    }

    //检测玩家坦克是否死亡，如果死亡游戏结束
    if (!this._isGameOver && this._player.state == Tank_State.Dead) {//如果玩家死亡：
        this.removeChild(this._player); //将玩家坦克从场景移除
        AudioManager.playSe({   //播放失败的音效 TankWarLost.ogg / TankWarLost.m4a
            name: "TankWarLost",
            pan: 0,
            pitch: 100,
            volume: 100
        });
        this._isGameOver = true; //将游戏结束设置为true
        for (var i in this._enemyTanks) {//停止所有敌人坦克的行动
            this._enemyTanks[i].isStop = true;
        }
    }

    //爆炸动画更新：爆炸动画有8帧组成，如果爆炸的动画播放完毕就将它们从场景中移除
    for (var i = this._explodes.length - 1; i >= 0; i--) {
        if (this._explodes[i].isFinished) {
            var explode = this._explodes.splice(i, 1)[0];
            this.removeChild(explode);
        }
    }

    //游戏结束检测
    if (this._isGameOver) {
        this._finishTick++;
        if (this._finishTick >= this._desireFinishTick) { //当流逝时间达到结束游戏需要等待的时间，则转场到游戏结束场景
            var isWin = this._player.state == Tank_State.Live; //如果玩家还活着就算胜利（其实这里还有个隐藏条件，就是玩家消灭了20个敌人坦克，因为游戏结束只有二种可能，一是玩家坦克被消灭，二是玩家消灭20辆敌人坦克，所以这里不用再检测该条件）
            SceneManager.push(Scene_TankWarGameOver);     //准备转场到游戏结束场景
            SceneManager.prepareNextScene(isWin);         //向游戏结束场景传递参数：玩家是否赢了游戏
        }
    }
};

//-----------------------------------------------------------------------------
/**
 * 坦克前进方向的“枚举”
 * @type {{Down: number, Left: number, Right: number, Up: number}}
 */
var Direction = {
    Down: 0,    //向下
    Left: 1,    //向左
    Right: 2,   //向右
    Up: 3       //向上
};

//-----------------------------------------------------------------------------
/**
 * 坦克状态的“枚举”
 * @type {{Live: number, Dying: number, Dead: number}}
 */
var Tank_State = {
    Live: 0,    //活着
    Dying: 1,   //死亡中
    Dead: 2     //死亡
}

//-----------------------------------------------------------------------------
/**
 * 坦克炮弹类
 * @constructor
 */
function Sprite_Bullet() {
    this.initialize.apply(this, arguments);
};

Sprite_Bullet.prototype = Object.create(Sprite_Base.prototype);
Sprite_Bullet.prototype.constructor = Sprite_Bullet;

Sprite_Bullet.prototype.initialize = function (texture) {
    Sprite_Base.prototype.initialize.call(this);

    this.bitmap = texture; //设置炮弹精灵的图片
    this.velocity = new Point(0, 0); //炮弹的前进速度
};

/**
 * 炮弹移动
 */
Sprite_Bullet.prototype.move = function () {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
};

//-----------------------------------------------------------------------------
/**
 * 坦克类
 * @constructor
 */
function Sprite_Tank() {
    this.initialize.apply(this, arguments);
};

Sprite_Tank.prototype = Object.create(Sprite_Base.prototype);
Sprite_Tank.prototype.constructor = Sprite_Tank;

Sprite_Tank.prototype.initialize = function (texture, frameWidth, frameHeight, hp) {
    Sprite_Base.prototype.initialize.call(this);

    this.canFire = true;  //能否开火（火炮冷却后才能再次开火）
    this.speed = 0;       //移动速度
    this.hp = hp;         //HP生命值
    this.state = Tank_State.Live; //状态
    this._animFrames = makeAnimFrames(texture, frameWidth, frameHeight);//包含了四个方向（向下、向左、向右、向上）的行走动画
    this._desireMoveTick = 20;   //坦克的移动动画二帧间隔的时间
    this._moveTick = 0;          //移动动画的当前帧
    this._desireFireTick = 30;   //坦克开火后二次开火间的间隔时间
    this._fireTick = 0;          //坦克自上次开火后流逝的时间
    this._currentAnimFrameIndex = 0; //移动动画的当前帧
    this._desireDieTick = 30;    //坦克从死亡到已经死亡所需要的时间
    this._dieTick = 0;           //死亡开始后流逝的时间
    this.anchor = new Point(0.5, 0.5); //设置锚点为其正中心
    this.bitmap = texture;       //设置其纹理图片
    this.look(Direction.Up);     //默认面向上
};

/**
 * 当前动画的帧序列信息数组
 */
Object.defineProperty(Sprite_Tank.prototype, 'currentAnimFrames', {
    get: function() {
        return this._animFrames[this._direction];
    }
});

/**
 * 让坦克面向指定的方向
 * @param direction
 */
Sprite_Tank.prototype.look = function (direction) {
    if(this._direction != direction) {
        this._direction = direction;
        this._currentAnimFrameIndex = 0;
        this.updateCurrentFrame();
    }
};

/**
 * 坦克开火
 * @param texture
 * @returns {Sprite_Bullet}
 */
Sprite_Tank.prototype.fire = function (texture) {
    this.canFire=false; //开过火后需要一段时间再开火，所以设置canFire=false
    var bullet=new Sprite_Bullet(texture);
    bullet.anchor=new Point(0.5,0.5);//(0.5,1)时设置到底部（左上角为原点）
    var bulletSpeed=10;
    switch (this._direction) {
        case Direction.Down:
            bullet.rotation = -180 * Math.PI / 180;     //由于炮弹的素材是个长方形的，所以要旋转炮弹让长边顺向开火方向
            bullet.x=this.x;                //将炮弹的初始x位置放到坦克的x位置
            bullet.y=this.y+this.height/2;  //将炮弹的初始y位置放到坦克的前方（这样就像是从炮筒射击出来的一样）
            bullet.velocity=new Point(0, bulletSpeed);  //根据坦克的面向，设置炮弹的前进方向和速度
            break;
        case Direction.Left:
            bullet.rotation = -90 * Math.PI / 180;
            bullet.x=this.x-this.width/2;
            bullet.y=this.y;
            bullet.velocity=new Point(-bulletSpeed, 0);
            break;
        case Direction.Right:
            bullet.rotation = 90 * Math.PI / 180;
            bullet.x=this.x+this.width/2;
            bullet.y=this.y;
            bullet.velocity=new Point(bulletSpeed, 0);
            break;
        case Direction.Up:
            bullet.rotation = 0;
            bullet.x=this.x;
            bullet.y=this.y-this.height/2;
            bullet.velocity=new Point(0, -bulletSpeed);
            break
        default: break;
    }
    AudioManager.playSe({ //播放一个开火音效 TankWarFire.ogg / TankWarFire.m4a
        name:"TankWarFire",
        pan:0,
        pitch:100,
        volume:100
    });
    return bullet;
};

/**
 * 移动坦克
 */
Sprite_Tank.prototype.move = function () {
    switch (this._direction){//移动时要根据坦克朝向
        case Direction.Down:
            this.y += this.speed;
            break;
        case Direction.Left:
            this.x -= this.speed;
            break;
        case Direction.Right:
            this.x += this.speed;
            break;
        case Direction.Up:
            this.y -= this.speed;
            break;
    }
};

/**
 * 坦克受到伤害
 * @param damage 坦克受到的伤害值
 */
Sprite_Tank.prototype.hurt = function (damage) {
    if(this.state == Tank_State.Live) {
        this.hp = Math.max(0, this.hp - damage);
        if (this.hp <= 0) {         //如果伤害后没有了hp生命值，则：
            this.canFire = false;   //死亡后不允许再开火
            this.state = Tank_State.Dying; //坦克开始死亡（坦克从开始死亡到完全死亡有一个很短的时间，用于等待爆炸效果动画）
        }
    }
};

/**
 * 更新显示当前的动画帧图片
 */
Sprite_Tank.prototype.updateCurrentFrame = function () {
    var frame=this.currentAnimFrames[this._currentAnimFrameIndex];  //取得当前要绘制的帧图片的帧信息
    this.setFrame(frame.x, frame.y, frame.width, frame.height);     //绘制指定帧的图片：根据帧信息，找到精灵表中对应帧信息坐标、宽高的帧图片，并绘制到屏幕
};

Sprite_Tank.prototype.update = function () {
    Sprite_Base.prototype.update.call(this);

    switch (this.state) {
        case Tank_State.Live: //如果坦克状态是：活着
            this._moveTick++;
            if (this._moveTick >= this._desireMoveTick) {//当流逝时间到达指定的时间后更新坦克的帧图片（用于展示坦克的行驶动画）
                this._moveTick = 0;
                this._currentAnimFrameIndex = this._currentAnimFrameIndex % this.currentAnimFrames.length;
                this.updateCurrentFrame();
                this._currentAnimFrameIndex++;
            }

            if (!this.canFire) { //如果坦克当前不能开火
                this._fireTick++;
                if (this._fireTick >= this._desireFireTick) {//当流逝时间到达指定的时间后，重新允许坦克可开火（模拟开火冷却效果）
                    this._fireTick = 0;
                    this.canFire = true;
                }
            }
            break;
        case Tank_State.Dying: //如果坦克状态是：正在死亡
            this._dieTick++;
            if (this._dieTick >= this._desireDieTick) {//当流逝时间到达指定时间后，“正在死亡”的状态结束，坦克变成“已经死亡”
                this.state = Tank_State.Dead;
            }
            break;
        case Tank_State.Dead: //如果坦克状态是：已经死亡
            break;
        default:
            break;
    }
};

//-----------------------------------------------------------------------------
/**
 * 敌人坦克类，继承自坦克类，相对于坦克类，主要是添加了简单AI功能
 * @constructor
 */
function Sprite_Enemy() {
    this.initialize.apply(this, arguments);
};

Sprite_Enemy.prototype = Object.create(Sprite_Tank.prototype);
Sprite_Enemy.prototype.constructor = Sprite_Enemy;

/**
 * 改变坦克的前进方向
 */
Sprite_Enemy.prototype.changeRoute=function () {
    this._routeTick=0;
    this.look(Math.randomInt(4));
    this._desireRouteTick=Math.randomInt(40)+100;
};

Sprite_Enemy.prototype.initialize = function (texture, frameWidth, frameHeight, hp) {
    Sprite_Tank.prototype.initialize.apply(this, arguments);

    this.isStop=false;          //是否停止行动
    this._desireMoveTick=30;    //坦克的移动动画二帧间隔的时间
    this._desireFireTick=60;    //坦克开火后二次开火间的间隔时间
    this._desireRouteTick=100;  //坦克每次改变前进路线所需要的时间
    this._routeTick=0;          //从坦克上次改变前进路线开始流逝的时间
    this._desireDieTick = 40;   //坦克从死亡到已经死亡所需要的时间
}

Sprite_Enemy.prototype.update = function () {
    Sprite_Tank.prototype.update.call(this);

    if (this.state == Tank_State.Live && !this.isStop) { //如果坦克还活着，且没有要求停止行动（如果玩家被消灭，所有敌人坦克会被要求停止行动）
        //检测坦克是否碰上了场景的上、下、左、右边界，如果是，则自动转向（不论上次转向开始后流逝时间是否到达指定时间）
        if (this.x <= this.width / 2) {
            this.x = this.width / 2;
            this.changeRoute();
        }
        if (this.x >= Graphics.boxWidth - this.width / 2) {
            this.x = Graphics.boxWidth - this.width / 2;
            this.changeRoute();
        }
        if (this.y <= this.height / 2) {
            this.y = this.height / 2;
            this.changeRoute();
        }
        if (this.y >= Graphics.boxHeight - this.height / 2) {
            this.y = Graphics.boxHeight - this.height / 2;
            this.changeRoute();
        }

        //当上次转向后流逝的时间到达指定时间后开始转向
        this._routeTick++;
        if (this._routeTick >= this._desireRouteTick) this.changeRoute();
        this.move();
    }
};

//-----------------------------------------------------------------------------
/**
 * 爆炸火球（效果）类
 * @constructor
 */
function Sprite_Explode() {
    this.initialize.apply(this, arguments);
};

Sprite_Explode.prototype = Object.create(Sprite_Base.prototype);
Sprite_Explode.prototype.constructor = Sprite_Explode;

Sprite_Explode.prototype.initialize = function (texture) {
    Sprite_Base.prototype.initialize.call(this);

    this._animFrames = makeAnimFrames(texture, 128, 128)[0];　//爆炸效果使用精灵表Explode.png，其尺寸1024x128，共1行8帧图片，所以每帧的宽高为128x128
    this._desireTick = 6;   //爆炸动画二帧之间的间隔时间
    this._tick = 0;         //爆炸动画绘制上一帧之后流逝的时间
    this._currentAnimFrameIndex = 0; //当前的动画帧索引
    this.isFinished = false;    //爆炸动画是否播放完毕（8帧）
    this.bitmap = texture;      //设置精灵的纹理图片
    this.updateCurrentFrame();  //更新当前的帧图片
};

/**
 * 更新显示当前的动画帧图片
 */
Sprite_Explode.prototype.updateCurrentFrame = function () {
    var frame = this._animFrames[this._currentAnimFrameIndex];
    this.setFrame(frame.x, frame.y, frame.width, frame.height);
};

Sprite_Explode.prototype.update = function () {
    Sprite_Base.prototype.update.call(this);

    this._tick++;
    if(this._currentAnimFrameIndex>=this._animFrames.length-1){ //如果8帧都播放完毕，则：
        this.isFinished=true; //标记为动画结束
    }else { //否则当流逝时间到达指定时间后更新下一帧图片
        if (this._tick >= this._desireTick) {
            this._tick = 0;
            this.updateCurrentFrame();
            this._currentAnimFrameIndex++;
        }
    }
};