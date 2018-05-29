//
//  ViewController.m
//  Example
//
//  Created by Yoji Suzuki on 2018/03/03.
//  Copyright © 2018年 SUZUKI PLAN. All rights reserved.
//

#import "ViewController.h"
//#import "ZMJoystick.h"
#import "NextViewController.h"
@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"NextViewController" bundle:nil];
    NSLog(@"hahahah %@", storyboard);
    
    NextViewController *vc = [storyboard instantiateViewControllerWithIdentifier:@"NextViewController"];
//    self.window.rootViewController = vc;
    [vc setTitle:@"B"];
    [self presentViewController:vc animated:YES completion:nil];
//    [self.navigationController pushViewController:vc animated:YES];
}


- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
}

@end
