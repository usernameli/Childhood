//
//  NextViewController.m
//  CustomTarBar
//
//  Created by 点点 on 2017/11/18.
//  Copyright © 2017年 DD. All rights reserved.
//

#import "NextViewController.h"
#import <NESView/NESView.h>
#import <sys/utsname.h>

@interface NextViewController () <NESViewDelegate>
@property (nonatomic) NESView* nesView;
@property (nonatomic) NSArray<NESKey*>* nesKeys;
@property (atomic) NSInteger playSpeed;
@property (nonatomic) NSData* state;
@property (nonatomic) UIImage* captureImage;
@property (nonatomic, strong) AVAudioPlayer *player;

@property (nonatomic) BOOL  upTouchFlg;
@property (nonatomic) BOOL  downTouchFlg;
@property (nonatomic) BOOL  leftTouchFlg;
@property (nonatomic) BOOL  rightTouchFlg;

@property (nonatomic) BOOL  nesViewIsDestoryFlg;
@property (nonatomic) BOOL bIsiPad;
@property (nonatomic) NSString  *GameNesPath;
@end

@implementation NextViewController


// 2.获取方法
// 获取设备名称
- (NSString *)deviceModel {
    struct utsname systemInfo;
    uname(&systemInfo);
    NSString *deviceModel = [NSString stringWithCString:systemInfo.machine
                                               encoding:NSUTF8StringEncoding];
    
    NSLog(@"deviceModel 1111= %@",deviceModel);
    // 模拟器
    if ([deviceModel isEqualToString:@"i386"])         return @"Simulator";
    if ([deviceModel isEqualToString:@"x86_64"])       return @"Simulator";
    
    // iPhone 系列
    if ([deviceModel isEqualToString:@"iPhone1,1"])    return @"iPhone SE";
    if ([deviceModel isEqualToString:@"iPhone1,2"])    return @"iPhone SE";
    if ([deviceModel isEqualToString:@"iPhone2,1"])    return @"iPhone SE";
    if ([deviceModel isEqualToString:@"iPhone3,1"])    return @"iPhone SE";
    if ([deviceModel isEqualToString:@"iPhone3,2"])    return @"iPhone SE";
    if ([deviceModel isEqualToString:@"iPhone3,3"])    return @"iPhone SE";
    if ([deviceModel isEqualToString:@"iPhone4,1"])    return @"iPhone SE";
    if ([deviceModel isEqualToString:@"iPhone5,1"])    return @"iPhone SE";
    if ([deviceModel isEqualToString:@"iPhone5,2"])    return @"iPhone SE";
    if ([deviceModel isEqualToString:@"iPhone5,3"])    return @"iPhone SE";
    if ([deviceModel isEqualToString:@"iPhone5,4"])    return @"iPhone SE";
    if ([deviceModel isEqualToString:@"iPhone6,1"])    return @"iPhone SE";
    if ([deviceModel isEqualToString:@"iPhone6,2"])    return @"iPhone SE";
    if ([deviceModel isEqualToString:@"iPhone7,1"])    return @"iPhone 6 Plus";
    if ([deviceModel isEqualToString:@"iPhone7,2"])    return @"iPhone 6";
    if ([deviceModel isEqualToString:@"iPhone8,1"])    return @"iPhone 6s";
    if ([deviceModel isEqualToString:@"iPhone8,2"])    return @"iPhone 6s Plus";
    if ([deviceModel isEqualToString:@"iPhone8,4"])    return @"iPhone SE";
    if ([deviceModel isEqualToString:@"iPhone9,1"])    return @"iPhone 7 (CDMA)";
    if ([deviceModel isEqualToString:@"iPhone9,3"])    return @"iPhone 7 (GSM)";
    if ([deviceModel isEqualToString:@"iPhone9,2"])    return @"iPhone 7 Plus (CDMA)";
    if ([deviceModel isEqualToString:@"iPhone9,4"])    return @"iPhone 7 Plus (GSM)";
    if ([deviceModel isEqualToString:@"iPhone10,1"])    return @"iPhone 8 (CDMA)";
    if ([deviceModel isEqualToString:@"iPhone10,4"])    return @"iPhone 8 (GSM)";
    if ([deviceModel isEqualToString:@"iPhone10,2"])    return @"iPhone 8 Plus (CDMA)";
    if ([deviceModel isEqualToString:@"iPhone10,5"])    return @"iPhone 8 Plus (GSM)";
    if ([deviceModel isEqualToString:@"iPhone10,3"])    return @"iPhone X (CDMA)";
    if ([deviceModel isEqualToString:@"iPhone10,6"])    return @"iPhone X (GSM)";
    
    // iPod 系列
    if ([deviceModel isEqualToString:@"iPod1,1"])      return @"iPod Touch 1G";
    if ([deviceModel isEqualToString:@"iPod2,1"])      return @"iPod Touch 2G";
    if ([deviceModel isEqualToString:@"iPod3,1"])      return @"iPod Touch 3G";
    if ([deviceModel isEqualToString:@"iPod4,1"])      return @"iPod Touch 4G";
    if ([deviceModel isEqualToString:@"iPod5,1"])      return @"iPod Touch 5G";
    if ([deviceModel isEqualToString:@"iPod7,1"])      return @"iPod Touch 6G";
    
    // iPad 系列
    if ([deviceModel isEqualToString:@"iPad1,1"])      return @"iPad";
    if ([deviceModel isEqualToString:@"iPad1,2"])      return @"iPad 3G";
    
    if ([deviceModel isEqualToString:@"iPad2,1"])      return @"iPad 2 (WiFi)";
    if ([deviceModel isEqualToString:@"iPad2,2"])      return @"iPad 2 (GSM)";
    if ([deviceModel isEqualToString:@"iPad2,3"])      return @"iPad 2 (CDMA)";
    if ([deviceModel isEqualToString:@"iPad2,4"])      return @"iPad 2 (32nm)";
    if ([deviceModel isEqualToString:@"iPad2,5"])      return @"iPad Mini (WiFi)";
    if ([deviceModel isEqualToString:@"iPad2,6"])      return @"iPad Mini (GSM)";
    if ([deviceModel isEqualToString:@"iPad2,7"])      return @"iPad Mini (CDMA)";
    
    if ([deviceModel isEqualToString:@"iPad3,1"])      return @"iPad 3(WiFi)";
    if ([deviceModel isEqualToString:@"iPad3,2"])      return @"iPad 3(CDMA)";
    if ([deviceModel isEqualToString:@"iPad3,3"])      return @"iPad 3(4G)";
    if ([deviceModel isEqualToString:@"iPad3,4"])      return @"iPad 4 (WiFi)";
    if ([deviceModel isEqualToString:@"iPad3,5"])      return @"iPad 4 (4G)";
    if ([deviceModel isEqualToString:@"iPad3,6"])      return @"iPad 4 (CDMA)";
    
    if ([deviceModel isEqualToString:@"iPad4,1"])      return @"iPad Air";
    if ([deviceModel isEqualToString:@"iPad4,2"])      return @"iPad Air";
    if ([deviceModel isEqualToString:@"iPad4,3"])      return @"iPad Air";
    if ([deviceModel isEqualToString:@"iPad4,4"])      return @"iPad Mini 2";
    if ([deviceModel isEqualToString:@"iPad4,5"])      return @"iPad Mini 2";
    if ([deviceModel isEqualToString:@"iPad4,6"])      return @"iPad Mini 2";
    if ([deviceModel isEqualToString:@"iPad4,7"])      return @"iPad Mini 3";
    if ([deviceModel isEqualToString:@"iPad4,8"])      return @"iPad Mini 3";
    if ([deviceModel isEqualToString:@"iPad4,9"])      return @"iPad Mini 3";
    
    if ([deviceModel isEqualToString:@"iPad5,1"])      return @"iPad Mini 4";
    if ([deviceModel isEqualToString:@"iPad5,2"])      return @"iPad Mini 4";
    if ([deviceModel isEqualToString:@"iPad5,3"])      return @"iPad Air 2";
    if ([deviceModel isEqualToString:@"iPad5,4"])      return @"iPad Air 2";
    
    if ([deviceModel isEqualToString:@"iPad6,3"])      return @"iPad PRO (12.9)";
    if ([deviceModel isEqualToString:@"iPad6,4"])      return @"iPad PRO (12.9)";
    if ([deviceModel isEqualToString:@"iPad6,7"])      return @"iPad PRO (9.7)";
    if ([deviceModel isEqualToString:@"iPad6,8"])      return @"iPad PRO (9.7)";
    if ([deviceModel isEqualToString:@"iPad6,11"])      return @"iPad 5";
    if ([deviceModel isEqualToString:@"iPad6,12"])      return @"iPad 5";
    
    if ([deviceModel isEqualToString:@"iPad7,1"])      return @"iPad PRO 2 (12.9)";
    if ([deviceModel isEqualToString:@"iPad7,2"])      return @"iPad PRO 2 (12.9)";
    if ([deviceModel isEqualToString:@"iPad7,3"])      return @"iPad PRO (10.5)";
    if ([deviceModel isEqualToString:@"iPad7,4"])      return @"iPad PRO (10.5)";
    
    return deviceModel;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    [self GameCenterLogin];
    _bIsiPad = FALSE;
    _upTouchFlg = FALSE;
    
    _downTouchFlg = FALSE;
    _leftTouchFlg = FALSE;
    _rightTouchFlg = FALSE;
    _nesViewIsDestoryFlg = TRUE;
    // Do any additional setup after loading the view.
    
//    UITapGestureRecognizer * tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(OperTouchEvent:)];
//    [self.OpView addGestureRecognizer:tapGesture];
    
    self.GameChioceScene.hidden = NO;
    self.GameScene.hidden = YES;
    NSString *  nsStrIpad=@"iPad";
    
    _bIsiPad=[self checkDevice:nsStrIpad];
    
    NSError *err;
    NSURL *url = [[NSBundle mainBundle] URLForResource:@"choiceGame" withExtension:@"mp3"];
    _player = [[AVAudioPlayer alloc] initWithContentsOfURL:url error:&err];
    
    [_player prepareToPlay];
    
    NSFileManager * fileManger = [NSFileManager defaultManager];
    NSString *appPath = [[NSBundle mainBundle] bundlePath];
    NSString *CNXHPath = [NSString stringWithFormat:@"%@/roms/CNXH",appPath];
    NSLog(@"CNXHPath %@",CNXHPath);
    //    BOOL isExist = [fileManger fileExistsAtPath:CNXHPath isDirectory:&isDir];
    NSDirectoryEnumerator *myDirectoryEnumerator=[fileManger enumeratorAtPath:CNXHPath];
    NSLog(@"用enumeratorAtPath:显示目录%@的内容：",CNXHPath);
    _GameNesPath = CNXHPath;
    
    NSString *filePath;
    while((filePath=[myDirectoryEnumerator nextObject])!=nil)
    {
        
        NSLog(@"%@",filePath);
        
    }
    
    
    [self initNesView];
    
    self.OperLeftBtn.userInteractionEnabled = TRUE;
    self.OperDownBtn.userInteractionEnabled = TRUE;
    self.OperRightBtn.userInteractionEnabled = TRUE;
    self.OperUpBtn.userInteractionEnabled = TRUE;
}
-(bool)checkDevice:(NSString*)name
{
    NSString* deviceType = [UIDevice currentDevice].model;
    NSLog(@"deviceType = %@", deviceType);
    
    NSRange range = [deviceType rangeOfString:name];
    return range.location != NSNotFound;
}

//一根或者多根手指开始触摸View：
- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event;
{
    NSLog(@"touchesBegan");
    if(_nesViewIsDestoryFlg)
    {
        return;
    }
    CGPoint point = [[touches anyObject] locationInView:self.view];
    CGPoint pointView = [self.OpView.layer convertPoint:point fromLayer:self.view.layer];
    if ([self.OpView.layer containsPoint:pointView]) {
        NSLog(@"touch oper view On");
        [self judgeTouchInOperBtn:point];
    }
    else
    {
        [self operBtnTouchReset];
    }

}
- (void) operBtnTouchReset
{

    _nesKeys[0].player1.up = NO;
    _nesKeys[0].player1.down = NO;
    _nesKeys[0].player1.left = NO;
    _nesKeys[0].player1.right = NO;
    self.OperUpBtn.highlighted = NO;
    self.OperLeftBtn.highlighted = NO;
    self.OperRightBtn.highlighted = NO;
    self.OperDownBtn.highlighted = NO;
}
- (void) judgeTouchInOperBtn:(CGPoint) point
{
    CGPoint pointOrgin = point;
    CGPoint pointBtn = [self.OperUpBtn.layer convertPoint:pointOrgin fromLayer:self.view.layer];
    if ([self.OperUpBtn.layer containsPoint:pointBtn]) {
        NSLog(@"touch operUpBtn On");
        _upTouchFlg = YES;

    }
    else
    {
        _upTouchFlg = NO;
    }
    
    pointBtn = [self.OperDownBtn.layer convertPoint:pointOrgin fromLayer:self.view.layer];
    if ([self.OperDownBtn.layer containsPoint:pointBtn]) {
        NSLog(@"touch OperDownBtn On");
        _downTouchFlg = YES;
    }
    else
    {
        _downTouchFlg = NO;
    }
    
    pointBtn = [self.OperLeftBtn.layer convertPoint:pointOrgin fromLayer:self.view.layer];
    if ([self.OperLeftBtn.layer containsPoint:pointBtn]) {
        NSLog(@"touch OperLeftBtn On");
        _leftTouchFlg = YES;
    }
    else
    {
        _leftTouchFlg = NO;
    }
    
    pointBtn = [self.OperRightBtn.layer convertPoint:pointOrgin fromLayer:self.view.layer];
    if ([self.OperRightBtn.layer containsPoint:pointBtn]) {
        NSLog(@"touch OperRightBtn On");

        _rightTouchFlg = YES;
    }
    else
    {
        _rightTouchFlg = NO;
    }
    
    if(_upTouchFlg || _rightTouchFlg || _downTouchFlg || _leftTouchFlg)
    {
        if(_upTouchFlg)
        {
            _nesKeys[0].player1.up = YES;
            self.OperUpBtn.highlighted = YES;
        }
        else
        {
            _nesKeys[0].player1.up = NO;
            self.OperUpBtn.highlighted = NO;
        }
        
        if(_rightTouchFlg)
        {
            _nesKeys[0].player1.right = YES;
            self.OperRightBtn.highlighted = YES;
        }
        else
        {
            _nesKeys[0].player1.right = NO;
            self.OperRightBtn.highlighted = NO;
        }
        
        if(_downTouchFlg)
        {
            _nesKeys[0].player1.down = YES;
            self.OperDownBtn.highlighted = YES;
            
        }
        else
        {
            _nesKeys[0].player1.down = NO;
            self.OperDownBtn.highlighted = NO;
        }
        
        if(_leftTouchFlg)
        {
            _nesKeys[0].player1.left = YES;
            self.OperLeftBtn.highlighted = YES;
        }
        else
        {
            _nesKeys[0].player1.left = NO;
            self.OperLeftBtn.highlighted = NO;
        }
    }
    
    
}
//一根或者多根手指在View移动，随着手指的移动，系统会不断调用此方法：
- (void)touchesMoved:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event;
{
    NSLog(@"touchesMoved");
    if(_nesViewIsDestoryFlg)
    {
        return;
    }
    CGPoint point = [[touches anyObject] locationInView:self.view];
    CGPoint pointView = [self.OpView.layer convertPoint:point fromLayer:self.view.layer];
    if ([self.OpView.layer containsPoint:pointView]) {
        NSLog(@"touch oper view On");
        [self judgeTouchInOperBtn:point];
    }
    else
    {
//        [self operBtnTouchReset];
    }
}

//一根或者多根手指离开View：
- (void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event;
{
    NSLog(@"touchesEnded");
    if(_nesViewIsDestoryFlg)
    {
        return;
    }
    [self operBtnTouchReset];
}

//触摸结束之前，某个系统事件(例如电话呼入)打断触摸过程
- (void)touchesCancelled:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event;
{
    NSLog(@"touchesCancelled");
    [self operBtnTouchReset];
}

- (void)OperTouchEvent:(UITapGestureRecognizer *)gesture
{
    NSLog(@"OperTouchEvent");
}
- (void) initNesView {
    
    NSMutableArray* keys = [NSMutableArray arrayWithCapacity:8];
    for (int i = 0; i < 8; i++) {
        keys[i] = [[NESKey alloc] init];
    }
    self.nesKeys = keys;
    _playSpeed = 1;
    CGRect origionRect = self.GameScene.frame;
    _nesView = [[NESView alloc] initWithFrame:CGRectMake(0, 0, origionRect.size.width, origionRect.size.height)];
    

    _nesView.delegate = self;
    [self.GameScene addSubview:_nesView];

}
- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)nesView:(NESView*)nesView didDetectVsyncWithFrameCount:(NSInteger)frameCount
{
    if(_nesViewIsDestoryFlg)
    {
        return;
    }
    NSInteger playSpeed = _playSpeed;
    if (1 == playSpeed) {
        [nesView tick:_nesKeys[0]];
    } else {
        NSInteger code = _nesKeys[0].code;
        for (int i = 1; i < playSpeed; i++) {
            [_nesKeys[i] setCode:code];
        }
        [nesView ticks:_nesKeys count:playSpeed];
    }
}

- (IBAction)OperADown:(id)sender {
    NSLog(@"A Down");
    _nesKeys[0].player1.a = YES;
}

- (IBAction)OperABDown:(id)sender {
    _nesKeys[0].player1.a = YES;
    _nesKeys[0].player1.b = YES;
}

- (IBAction)OperBDown:(id)sender {
    NSLog(@"B Down");
    _nesKeys[0].player1.b = YES;
    
}

- (IBAction)GameReset:(id)sender {
    _nesViewIsDestoryFlg = TRUE;
    self.GameScene.hidden = TRUE;
    self.GameChioceScene.hidden = FALSE;
    self.OperLeftBtn.userInteractionEnabled = TRUE;
    self.OperDownBtn.userInteractionEnabled = TRUE;
    self.OperRightBtn.userInteractionEnabled = TRUE;
    self.OperUpBtn.userInteractionEnabled = TRUE;
}
- (NSString *)getGameName:(int)gamePos {
    NSString *gameName = @"KDXF";
    NSLog(@"gamePos = %d\n",gamePos);
    if( gamePos == 1)
    {
        gameName = @"CSYSWDB";
    }
    else if( gamePos == 2)
    {
        gameName = @"HDLSWDB";
    }
    else if( gamePos == 3)
    {
        gameName = @"JNZJ";
    }
    else if( gamePos == 4)
    {
        gameName = @"LSBT";
    }
    else if( gamePos == 5)
    {
        gameName = @"MXD";
    }
    else if( gamePos == 6)
    {
        gameName = @"QBK";
    }
    else if( gamePos == 7)
    {
        gameName = @"SMTZ";
    }
    else if( gamePos == 8)
    {
        gameName = @"SJL2";
    }
    else if( gamePos == 9)
    {
        gameName = @"XYJ";
    }
    return gameName;
}

- (void) setGameChioceList:(BOOL) up{
    int sub = 26;
    int maxSub = 242;
    
    if(_bIsiPad)
    {
        sub = sub + 14;
        maxSub = 368;
    }
    else
    {
        NSString *deviceModel = [self deviceModel];
        if([deviceModel isEqualToString:@"iPhone SE"])
        {
            sub = 20;
            maxSub = 188;
        }
    }
    if(up)
    {
        CGRect origionRect = self.GameChioceRow.frame;
        CGPoint origin = origionRect.origin;
        if(origin.y - sub < 8)
        {
            origin.y = maxSub + sub;
        }
        CGRect newRect = CGRectMake(origin.x, origin.y - sub, origionRect.size.width, origionRect.size.height);
        
        
        self.GameChioceRow.frame = newRect;
        
    }
    else
    {
        CGRect origionRect = self.GameChioceRow.frame;
        CGPoint origin = origionRect.origin;
        if(origin.y + sub > maxSub)
        {
            origin.y = 8 - sub;
        }
        CGRect newRect = CGRectMake(origin.x, origin.y + sub, origionRect.size.width, origionRect.size.height);
        self.GameChioceRow.frame = newRect;
    }
    CGRect origionRect = self.GameChioceRow.frame;
    CGPoint origin = origionRect.origin;
    NSLog(@"origin y= %f",origin.y);
    int gamePos = (origin.y - 8) / sub;
    self.GameImgeShow.image = [UIImage imageNamed:[self getGameName:gamePos]];
    [_player play];
}
- (IBAction)GameSelectDown:(id)sender {
    if(_nesViewIsDestoryFlg)
    {
        [self setGameChioceList:FALSE];
    }
    else
    {
        _nesKeys[0].player1.select = YES;
    }
    
    
    
}
- (IBAction)GameSelectUp:(id)sender {
    _nesKeys[0].player1.select = NO;
    
}

- (IBAction)GameStartPauseDown:(id)sender {
    
    _nesKeys[0].player1.start = YES;
    if(_nesViewIsDestoryFlg)
    {
        
        CGRect origionRect = self.GameChioceRow.frame;
        CGPoint origin = origionRect.origin;
        int sub = 26;
        if(_bIsiPad)
        {
            sub = sub + 14;
        }
        else
        {
            NSString *deviceModel = [self deviceModel];
            if([deviceModel isEqualToString:@"iPhone SE"] == FALSE)
            {
                sub = 20;
            }
        }
        int gamePos = (origin.y - 8 ) / sub;
        
        NSString *gameName = [self getGameName:gamePos];
        
        NSLog(@"gameName: %@", gameName);
        _nesViewIsDestoryFlg = FALSE;
        NSURL* romURL = [[NSBundle mainBundle] URLForResource:gameName withExtension:@"nes"];
        NSLog(@"rom: %@", romURL);
        NSData* romData = [NSData dataWithContentsOfFile:romURL.path];
        [_nesView loadRom:romData];
        self.GameScene.hidden = NO;
        self.GameChioceScene.hidden = YES;
        self.OperLeftBtn.userInteractionEnabled = FALSE;
        self.OperDownBtn.userInteractionEnabled = FALSE;
        self.OperRightBtn.userInteractionEnabled = FALSE;
        self.OperUpBtn.userInteractionEnabled = FALSE;
        
    }
}

- (IBAction)GameStartPauseUp:(id)sender {
    
    _nesKeys[0].player1.start = NO;

    if(_nesViewIsDestoryFlg)
    {
        self.OperLeftBtn.userInteractionEnabled = TRUE;
        self.OperDownBtn.userInteractionEnabled = TRUE;
        self.OperRightBtn.userInteractionEnabled = TRUE;
        self.OperUpBtn.userInteractionEnabled = TRUE;
    }
    else
    {
        self.OperLeftBtn.userInteractionEnabled = FALSE;
        self.OperDownBtn.userInteractionEnabled = FALSE;
        self.OperRightBtn.userInteractionEnabled = FALSE;
        self.OperUpBtn.userInteractionEnabled = FALSE;
    }
    
    
}

- (IBAction)OperAUp:(id)sender {
    _nesKeys[0].player1.a = NO;
}

- (IBAction)OperBUp:(id)sender {
    _nesKeys[0].player1.b = NO;
}

- (IBAction)OperABUp:(id)sender {
    _nesKeys[0].player1.a = NO;
    _nesKeys[0].player1.b = NO;
}

- (IBAction)OperUp:(id)sender {
    [self setGameChioceList:TRUE];
    
}
- (IBAction)OperRight:(id)sender {
//    [self setGameChioceList:TRUE];
    
}
- (IBAction)OperLeft:(id)sender {
//    [self setGameChioceList:TRUE];
    
}
- (IBAction)OperDown:(id)sender {
    [self setGameChioceList:FALSE];
    
}

- (IBAction)SoundOnOff:(id)sender {
   
}

- (IBAction)Shop:(id)sender {
//    _nesViewIsDestoryFlg = FALSE;
//    NSURL* romURL = [[NSBundle mainBundle] URLForResource:@"roms/CNXH/YY2" withExtension:@"nes"];
//    NSLog(@"rom: %@", romURL);
//    NSData* romData = [NSData dataWithContentsOfFile:romURL.path];
//    [_nesView loadRom:romData];
}

-(BOOL)isSupport
{
    Class gcClass = (NSClassFromString(@"GKLocalPlayer"));
    NSString *reqSysVer = @"4.1";
    NSString *currSysVer = [[UIDevice currentDevice] systemVersion];
    BOOL osVersionSupported = ([currSysVer compare:reqSysVer options:NSNumericSearch] != NSOrderedAscending);
    return (gcClass && osVersionSupported);
}

- (BOOL)IsLogin
{
    return [GKLocalPlayer localPlayer].authenticated;
}

- (void)GameCenterLogin
{
    if (![self isSupport])
    {
        return;
    }
    if ([self IsLogin])
    {
        return;
    }
    
    GKLocalPlayer *localPlayer = [GKLocalPlayer localPlayer];
    localPlayer.authenticateHandler = ^(UIViewController *viewController, NSError *error)
    {
        if (viewController != nil)
        {
            
            [self presentViewController:viewController animated:YES completion:nil];
            NSLog(@"game center show suceess view");
            
        }
        else
        {
            if ([GKLocalPlayer localPlayer].authenticated)
            {
                // Get the default leaderboard identifier.
                [[GKLocalPlayer localPlayer] loadDefaultLeaderboardIdentifierWithCompletionHandler:^(NSString *leaderboardIdentifier, NSError *error)
                 {
                     if (error != nil)
                     {
                         NSLog(@"game center load default leaderboard fail :%@", [error localizedDescription]);
                     }
                 }];
                NSLog(@"game center authenticat success");
            }
            else
            {
                NSLog(@"game center authenticat failed");
            }
        }
    };
}

@end
