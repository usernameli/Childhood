//
//  HomeViewController.m
//  CustomTarBar
//
//  Created by 点点 on 2017/11/18.
//  Copyright © 2017年 DD. All rights reserved.
//

#import "HomeViewController.h"
#import "NextViewController.h"
#import "UIView+QKExtension.h"

@interface HomeViewController ()

@end

@implementation HomeViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    
    UIButton *centerBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [centerBtn setTitle:@"下一页" forState:UIControlStateNormal];
    [centerBtn setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
    centerBtn.size = CGSizeMake(80, 30);
    centerBtn.center = self.view.center;
//    centerBtn.layer.borderWidth = 0.5f;
//    centerBtn.layer.cornerRadius = 5.f;
//    centerBtn.layer.masksToBounds = YES;
    [centerBtn addTarget:self action:@selector(pushNextVC) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:centerBtn];
    
    
    NSFileManager * fileManger = [NSFileManager defaultManager];
    NSString *appPath = [[NSBundle mainBundle] bundlePath];
    NSString *CNXHPath = [NSString stringWithFormat:@"%@/roms/CNXH",appPath];
    NSLog(@"CNXHPath %@",CNXHPath);
//    BOOL isExist = [fileManger fileExistsAtPath:CNXHPath isDirectory:&isDir];
    NSDirectoryEnumerator *myDirectoryEnumerator=[fileManger enumeratorAtPath:CNXHPath];
    NSLog(@"用enumeratorAtPath:显示目录%@的内容：",CNXHPath);
    NSString *filePath;
    while((filePath=[myDirectoryEnumerator nextObject])!=nil)
    {
        
        NSLog(@"%@",filePath);
        
    }
//    NSURL* romURL = [[NSBundle mainBundle] URLForResource:@"roms/CNXH/CJHDL" withExtension:@"nes"];
//    //当前项目的路径
//    NSLog(@"rom: %@", [[NSBundle mainBundle] bundlePath] );
}

- (void)pushNextVC
{
    
    UIStoryboard *board = [UIStoryboard storyboardWithName: @"NextViewController" bundle: nil];
    
    UIViewController *childController = [board instantiateViewControllerWithIdentifier: @"nextViewController"];
//    NextViewController *nextVC = [[NextViewController alloc] init];
    [self.navigationController setNavigationBarHidden:YES animated:NO];
    [self.navigationController pushViewController:childController animated:YES];
}


@end
