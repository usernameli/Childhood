//
//  RechargeVC.h
//  Example
//
//  Created by sumingliang on 2018/4/19.
//  Copyright © 2018年 SUZUKI PLAN. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <StoreKit/StoreKit.h>
enum{IAP0p20=20,
    IAP1p100,
    IAP4p600,
    IAP9p1000,
    IAP24p6000,
}buyCoinsTag;

@interface RechargeVC : UIViewController
{
    int buyType;
}

@end
