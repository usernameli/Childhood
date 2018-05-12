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
@property (weak, nonatomic) IBOutlet UIView *GameChioceScene;
@property (weak, nonatomic) IBOutlet UIImageView *GameChioceRow;

@property (weak, nonatomic) IBOutlet UIView *OpView;

@property (weak, nonatomic) IBOutlet UIButton *OperUpBtn;
@property (weak, nonatomic) IBOutlet UIButton *OperRightBtn;
@property (weak, nonatomic) IBOutlet UIButton *OperDownBtn;
@property (weak, nonatomic) IBOutlet UIButton *OperLeftBtn;


- (IBAction)SoundOnOff:(id)sender;
- (IBAction)Shop:(id)sender;
//按钮按下操作
- (IBAction)GameSelectDown:(id)sender;
- (IBAction)OperADown:(id)sender;
- (IBAction)OperABDown:(id)sender;
- (IBAction)OperBDown:(id)sender;
- (IBAction)GameReset:(id)sender;
- (IBAction)GameStartPauseDown:(id)sender;

//按钮放开
- (IBAction)GameSelectUp:(id)sender;
- (IBAction)GameStartPauseUp:(id)sender;
- (IBAction)OperAUp:(id)sender;
- (IBAction)OperBUp:(id)sender;
- (IBAction)OperABUp:(id)sender;

- (IBAction)OperUp:(id)sender;
- (IBAction)OperDown:(id)sender;
- (IBAction)OperLeft:(id)sender;
- (IBAction)OperRight:(id)sender;

@end
