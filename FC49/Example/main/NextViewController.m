//
//  NextViewController.m
//  CustomTarBar
//
//  Created by 点点 on 2017/11/18.
//  Copyright © 2017年 DD. All rights reserved.
//

#import "NextViewController.h"
#import <NESView/NESView.h>
#import <MediaPlayer/MediaPlayer.h>
#import <AVFoundation/AVFoundation.h>
#import <MediaPlayer/MediaPlayer.h>

@interface NextViewController () <NESViewDelegate>
@property (nonatomic) NESView* nesView;
@property (nonatomic) MPVolumeView* volumeView;
@property (nonatomic, strong) UISlider *volumeViewSlider;
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

@property (nonatomic) NSString  *GameNesPath;
@end

@implementation NextViewController

- (void)viewDidLoad {
    [super viewDidLoad];
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
    MPVolumeView *volumeView =  [[MPVolumeView alloc] init];
   
    volumeView.showsRouteButton = NO;
    
    volumeView.showsVolumeSlider = NO;
    
    [self.view addSubview:volumeView];
    _volumeView = volumeView;
    
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
   _nesView = [[NESView alloc] initWithFrame:CGRectMake(0, 0, 320, 300)];
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

//- (IBAction)goBack:(id)sender {
//    [_nesView destroy];
//    [self.navigationController popViewControllerAnimated:NO];
//}


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
//    [_nesView destroy];
    
//    NSURL* romURL = [[NSBundle mainBundle] URLForResource:@"example" withExtension:@"nes"];
//    NSLog(@"rom: %@", romURL);
//    NSData* romData = [NSData dataWithContentsOfFile:romURL.path];
//    [_nesView loadRom:romData];
    
//    [_nesView reset];
}


- (void) setGameChioceList:(BOOL) up{
    if(up)
    {
        CGRect origionRect = self.GameChioceRow.frame;
        CGPoint origin = origionRect.origin;
        if(origin.y - 30 < 8)
        {
            origin.y = 278 + 30;
        }
        CGRect newRect = CGRectMake(origin.x, origin.y - 30, origionRect.size.width, origionRect.size.height);
        
        
        self.GameChioceRow.frame = newRect;
        
    }
    else
    {
        CGRect origionRect = self.GameChioceRow.frame;
        CGPoint origin = origionRect.origin;
        if(origin.y + 30 > 278)
        {
            origin.y = 8 - 30;
        }
        CGRect newRect = CGRectMake(origin.x, origin.y + 30, origionRect.size.width, origionRect.size.height);
        
        
        self.GameChioceRow.frame = newRect;
        
        
        
    }
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
        int gamePos = (origin.y - 8 ) / 30;
        NSString *gameName = @"KDXF";
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
    for (UIView *view in [_volumeView subviews]){
        if ([view.class.description isEqualToString:@"MPVolumeSlider"]){
            _volumeViewSlider = (UISlider*)view;
            break;
        }
    }
    [_volumeViewSlider setValue:0.0f animated:NO];
}

- (IBAction)Shop:(id)sender {
//    _nesViewIsDestoryFlg = FALSE;
//    NSURL* romURL = [[NSBundle mainBundle] URLForResource:@"roms/CNXH/YY2" withExtension:@"nes"];
//    NSLog(@"rom: %@", romURL);
//    NSData* romData = [NSData dataWithContentsOfFile:romURL.path];
//    [_nesView loadRom:romData];
}
@end
