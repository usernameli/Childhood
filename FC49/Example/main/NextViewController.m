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

@interface NextViewController () <NESViewDelegate>
@property (nonatomic) NESView* nesView;
@property (nonatomic) MPVolumeView* volumeView;
@property (nonatomic, strong) UISlider *volumeViewSlider;
@property (nonatomic) NSArray<NESKey*>* nesKeys;
@property (atomic) NSInteger playSpeed;
@property (nonatomic) NSData* state;
@property (nonatomic) UIImage* captureImage;
@end

@implementation NextViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    MPVolumeView *volumeView =  [[MPVolumeView alloc] init];
   
    volumeView.showsRouteButton = NO;
    
    volumeView.showsVolumeSlider = NO;
    
    [self.view addSubview:volumeView];
    _volumeView = volumeView;
    
    [self initNesView];
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
    
    
//    NSURL* romURL = [[NSBundle mainBundle] URLForResource:@"example" withExtension:@"nes"];
//    NSLog(@"rom: %@", romURL);
//    NSData* romData = [NSData dataWithContentsOfFile:romURL.path];
//    [_nesView loadRom:romData];
}
- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)nesView:(NESView*)nesView didDetectVsyncWithFrameCount:(NSInteger)frameCount
{
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

- (void) viewWillAppear:(BOOL)animated
{
//    [super viewDidAppear:animated];
//    [self.navigationController setNavigationBarHidden:YES animated:NO];

}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

//- (IBAction)goBack:(id)sender {
//    [_nesView destroy];
//    [self.navigationController popViewControllerAnimated:NO];
//}


- (IBAction)OperADown:(id)sender {
    _nesKeys[0].player1.a = YES;
}

- (IBAction)OperABDown:(id)sender {
    _nesKeys[0].player1.a = YES;
    _nesKeys[0].player1.b = YES;
}

- (IBAction)OperBDown:(id)sender {
    _nesKeys[0].player1.b = YES;
    
}

- (IBAction)GameReset:(id)sender {
    
    [_nesView reset];
}

- (IBAction)OperUpDown:(id)sender {
    _nesKeys[0].player1.up = YES;
}

- (IBAction)OperLeftDown:(id)sender {
    _nesKeys[0].player1.left = YES;
}

- (IBAction)OperDownDown:(id)sender {
    _nesKeys[0].player1.down = YES;
}

- (IBAction)OperRightDown:(id)sender {
    _nesKeys[0].player1.right = YES;
}

- (IBAction)GameStartPauseDown:(id)sender {

    _nesKeys[0].player1.start = YES;
}

- (IBAction)GameSelectDown:(id)sender {
    _nesKeys[0].player1.select = YES;
    
}
- (IBAction)GameSelectUp:(id)sender {
    _nesKeys[0].player1.select = NO;
}

- (IBAction)OperUpUp:(id)sender {
    _nesKeys[0].player1.up = NO;
}

- (IBAction)OperRightUp:(id)sender {
    _nesKeys[0].player1.right = NO;
}

- (IBAction)OperLeftUp:(id)sender {
    _nesKeys[0].player1.left = NO;
}

- (IBAction)OperDownUp:(id)sender {
    _nesKeys[0].player1.down = NO;
}

- (IBAction)GameStartPauseUp:(id)sender {
    _nesKeys[0].player1.start = NO;
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
    NSURL* romURL = [[NSBundle mainBundle] URLForResource:@"example" withExtension:@"nes"];
    NSLog(@"rom: %@", romURL);
    NSData* romData = [NSData dataWithContentsOfFile:romURL.path];
    [_nesView loadRom:romData];
}
@end
