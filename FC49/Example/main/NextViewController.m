//
//  NextViewController.m
//  CustomTarBar
//
//  Created by 点点 on 2017/11/18.
//  Copyright © 2017年 DD. All rights reserved.
//

#import "NextViewController.h"
#import <NESView/NESView.h>

@interface NextViewController () <NESViewDelegate>
@property (nonatomic) NESView* nesView;
@property (nonatomic) NSArray<NESKey*>* nesKeys;
@property (atomic) NSInteger playSpeed;
@property (nonatomic) NSData* state;
@property (nonatomic) UIImage* captureImage;
@end

@implementation NextViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    [self initNesView];
}
- (void) initNesView {
    
    NSMutableArray* keys = [NSMutableArray arrayWithCapacity:8];
    for (int i = 0; i < 8; i++) {
        keys[i] = [[NESKey alloc] init];
    }
    self.nesKeys = keys;
    _playSpeed = 1;
    _nesView = [[NESView alloc] initWithFrame:CGRectMake(0, 0, 256, 240)];
    _nesView.delegate = self;
    [self.NesViewContainer addSubview:_nesView];
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

- (IBAction)goBack:(id)sender {
    [_nesView destroy];
    [self.navigationController popViewControllerAnimated:NO];
}
@end
