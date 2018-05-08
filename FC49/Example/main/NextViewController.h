//
//  NextViewController.h
//  CustomTarBar
//
//  Created by 点点 on 2017/11/18.
//  Copyright © 2017年 DD. All rights reserved.
//

#import "QKBasicViewController.h"

@interface NextViewController : QKBasicViewController
@property (weak, nonatomic) IBOutlet UIView *GameScene;
- (IBAction)SoundOnOff:(id)sender;
- (IBAction)Shop:(id)sender;
//按钮按下操作
- (IBAction)GameSelectDown:(id)sender;
- (IBAction)OperADown:(id)sender;
- (IBAction)OperABDown:(id)sender;
- (IBAction)OperBDown:(id)sender;
- (IBAction)GameReset:(id)sender;
- (IBAction)OperUpDown:(id)sender;
- (IBAction)OperLeftDown:(id)sender;
- (IBAction)OperDownDown:(id)sender;
- (IBAction)OperRightDown:(id)sender;
- (IBAction)GameStartPauseDown:(id)sender;

//按钮放开
- (IBAction)GameSelectUp:(id)sender;
- (IBAction)OperUpUp:(id)sender;
- (IBAction)OperRightUp:(id)sender;
- (IBAction)OperLeftUp:(id)sender;
- (IBAction)OperDownUp:(id)sender;
- (IBAction)GameStartPauseUp:(id)sender;
- (IBAction)OperAUp:(id)sender;
- (IBAction)OperBUp:(id)sender;
- (IBAction)OperABUp:(id)sender;

@end
