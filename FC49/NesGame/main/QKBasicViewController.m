//
//  QKBasicViewController.m
//  CustomTarBar
//
//  Created by 点点 on 2017/11/18.
//  Copyright © 2017年 DD. All rights reserved.
//

#import "QKBasicViewController.h"

#define isIOS9 ([[UIDevice currentDevice].systemVersion intValue]>=9?YES:NO)
#define isIOS10 ([[UIDevice currentDevice].systemVersion intValue]>=10?YES:NO)


@interface QKBasicViewController ()

@end

@implementation QKBasicViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.view.backgroundColor = [UIColor whiteColor];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}






@end
