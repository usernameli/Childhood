//
//  HallViewController.h
//  Example
//
//  Created by sumingliang on 2018/4/18.
//  Copyright © 2018年 SUZUKI PLAN. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <StoreKit/StoreKit.h>
#import <GameKit/GameKit.h>

@import GoogleMobileAds;

@interface HallViewController : UIViewController<SKPaymentTransactionObserver,SKProductsRequestDelegate>
@property (weak, nonatomic) IBOutlet GADBannerView  *bannerView;
@property (nonatomic,copy) NSString *currentProId;
@property (weak,nonatomic) IBOutlet UIView  *rechargeView;

- (IBAction)closeRecharge:(UIButton *)sender;

- (IBAction)Recharge:(UIButton *)sender;


@end
