//
//  AppDelegate.m
//  Example
//
//  Created by Yoji Suzuki on 2018/03/03.
//  Copyright © 2018年 SUZUKI PLAN. All rights reserved.
//

#import "AppDelegate.h"
#import "ViewController.h"
#import "NextViewController.h"
#import <sys/utsname.h>

//@import Firebase;
//@import GoogleMobileAds;

@interface AppDelegate ()

@end

@implementation AppDelegate

-(bool)checkDevice:(NSString*)name
{
    NSString* deviceType = [UIDevice currentDevice].model;
    NSLog(@"deviceType = %@", deviceType);
    
    NSRange range = [deviceType rangeOfString:name];
    return range.location != NSNotFound;
}
// 2.获取方法
// 获取设备名称
- (NSString *)deviceModel {
    struct utsname systemInfo;
    uname(&systemInfo);
    NSString *deviceModel = [NSString stringWithCString:systemInfo.machine
                                               encoding:NSUTF8StringEncoding];
    
    NSLog(@"deviceModel 1111= %@",deviceModel);
    // 模拟器
    if ([deviceModel isEqualToString:@"i386"])         return @"Simulator";
    if ([deviceModel isEqualToString:@"x86_64"])       return @"Simulator";
    
    // iPhone 系列
    if ([deviceModel isEqualToString:@"iPhone1,1"])    return @"iPhone SE";
    if ([deviceModel isEqualToString:@"iPhone1,2"])    return @"iPhone SE";
    if ([deviceModel isEqualToString:@"iPhone2,1"])    return @"iPhone SE";
    if ([deviceModel isEqualToString:@"iPhone3,1"])    return @"iPhone SE";
    if ([deviceModel isEqualToString:@"iPhone3,2"])    return @"iPhone SE";
    if ([deviceModel isEqualToString:@"iPhone3,3"])    return @"iPhone SE";
    if ([deviceModel isEqualToString:@"iPhone4,1"])    return @"iPhone SE";
    if ([deviceModel isEqualToString:@"iPhone5,1"])    return @"iPhone SE";
    if ([deviceModel isEqualToString:@"iPhone5,2"])    return @"iPhone SE";
    if ([deviceModel isEqualToString:@"iPhone5,3"])    return @"iPhone SE";
    if ([deviceModel isEqualToString:@"iPhone5,4"])    return @"iPhone SE";
    if ([deviceModel isEqualToString:@"iPhone6,1"])    return @"iPhone SE";
    if ([deviceModel isEqualToString:@"iPhone6,2"])    return @"iPhone SE";
    if ([deviceModel isEqualToString:@"iPhone7,1"])    return @"iPhone 6 Plus";
    if ([deviceModel isEqualToString:@"iPhone7,2"])    return @"iPhone 6";
    if ([deviceModel isEqualToString:@"iPhone8,1"])    return @"iPhone 6s";
    if ([deviceModel isEqualToString:@"iPhone8,2"])    return @"iPhone 6s Plus";
    if ([deviceModel isEqualToString:@"iPhone8,4"])    return @"iPhone SE";
    if ([deviceModel isEqualToString:@"iPhone9,1"])    return @"iPhone 7 (CDMA)";
    if ([deviceModel isEqualToString:@"iPhone9,3"])    return @"iPhone 7 (GSM)";
    if ([deviceModel isEqualToString:@"iPhone9,2"])    return @"iPhone 7 Plus (CDMA)";
    if ([deviceModel isEqualToString:@"iPhone9,4"])    return @"iPhone 7 Plus (GSM)";
    if ([deviceModel isEqualToString:@"iPhone10,1"])    return @"iPhone 8 (CDMA)";
    if ([deviceModel isEqualToString:@"iPhone10,4"])    return @"iPhone 8 (GSM)";
    if ([deviceModel isEqualToString:@"iPhone10,2"])    return @"iPhone 8 Plus (CDMA)";
    if ([deviceModel isEqualToString:@"iPhone10,5"])    return @"iPhone 8 Plus (GSM)";
    if ([deviceModel isEqualToString:@"iPhone10,3"])    return @"iPhone X (CDMA)";
    if ([deviceModel isEqualToString:@"iPhone10,6"])    return @"iPhone X (GSM)";
    
    // iPod 系列
    if ([deviceModel isEqualToString:@"iPod1,1"])      return @"iPod Touch 1G";
    if ([deviceModel isEqualToString:@"iPod2,1"])      return @"iPod Touch 2G";
    if ([deviceModel isEqualToString:@"iPod3,1"])      return @"iPod Touch 3G";
    if ([deviceModel isEqualToString:@"iPod4,1"])      return @"iPod Touch 4G";
    if ([deviceModel isEqualToString:@"iPod5,1"])      return @"iPod Touch 5G";
    if ([deviceModel isEqualToString:@"iPod7,1"])      return @"iPod Touch 6G";
    
    // iPad 系列
    if ([deviceModel isEqualToString:@"iPad1,1"])      return @"iPad";
    if ([deviceModel isEqualToString:@"iPad1,2"])      return @"iPad 3G";
    
    if ([deviceModel isEqualToString:@"iPad2,1"])      return @"iPad 2 (WiFi)";
    if ([deviceModel isEqualToString:@"iPad2,2"])      return @"iPad 2 (GSM)";
    if ([deviceModel isEqualToString:@"iPad2,3"])      return @"iPad 2 (CDMA)";
    if ([deviceModel isEqualToString:@"iPad2,4"])      return @"iPad 2 (32nm)";
    if ([deviceModel isEqualToString:@"iPad2,5"])      return @"iPad Mini (WiFi)";
    if ([deviceModel isEqualToString:@"iPad2,6"])      return @"iPad Mini (GSM)";
    if ([deviceModel isEqualToString:@"iPad2,7"])      return @"iPad Mini (CDMA)";
    
    if ([deviceModel isEqualToString:@"iPad3,1"])      return @"iPad 3(WiFi)";
    if ([deviceModel isEqualToString:@"iPad3,2"])      return @"iPad 3(CDMA)";
    if ([deviceModel isEqualToString:@"iPad3,3"])      return @"iPad 3(4G)";
    if ([deviceModel isEqualToString:@"iPad3,4"])      return @"iPad 4 (WiFi)";
    if ([deviceModel isEqualToString:@"iPad3,5"])      return @"iPad 4 (4G)";
    if ([deviceModel isEqualToString:@"iPad3,6"])      return @"iPad 4 (CDMA)";
    
    if ([deviceModel isEqualToString:@"iPad4,1"])      return @"iPad Air";
    if ([deviceModel isEqualToString:@"iPad4,2"])      return @"iPad Air";
    if ([deviceModel isEqualToString:@"iPad4,3"])      return @"iPad Air";
    if ([deviceModel isEqualToString:@"iPad4,4"])      return @"iPad Mini 2";
    if ([deviceModel isEqualToString:@"iPad4,5"])      return @"iPad Mini 2";
    if ([deviceModel isEqualToString:@"iPad4,6"])      return @"iPad Mini 2";
    if ([deviceModel isEqualToString:@"iPad4,7"])      return @"iPad Mini 3";
    if ([deviceModel isEqualToString:@"iPad4,8"])      return @"iPad Mini 3";
    if ([deviceModel isEqualToString:@"iPad4,9"])      return @"iPad Mini 3";
    
    if ([deviceModel isEqualToString:@"iPad5,1"])      return @"iPad Mini 4";
    if ([deviceModel isEqualToString:@"iPad5,2"])      return @"iPad Mini 4";
    if ([deviceModel isEqualToString:@"iPad5,3"])      return @"iPad Air 2";
    if ([deviceModel isEqualToString:@"iPad5,4"])      return @"iPad Air 2";
    
    if ([deviceModel isEqualToString:@"iPad6,3"])      return @"iPad PRO (12.9)";
    if ([deviceModel isEqualToString:@"iPad6,4"])      return @"iPad PRO (12.9)";
    if ([deviceModel isEqualToString:@"iPad6,7"])      return @"iPad PRO (9.7)";
    if ([deviceModel isEqualToString:@"iPad6,8"])      return @"iPad PRO (9.7)";
    if ([deviceModel isEqualToString:@"iPad6,11"])      return @"iPad 5";
    if ([deviceModel isEqualToString:@"iPad6,12"])      return @"iPad 5";
    
    if ([deviceModel isEqualToString:@"iPad7,1"])      return @"iPad PRO 2 (12.9)";
    if ([deviceModel isEqualToString:@"iPad7,2"])      return @"iPad PRO 2 (12.9)";
    if ([deviceModel isEqualToString:@"iPad7,3"])      return @"iPad PRO (10.5)";
    if ([deviceModel isEqualToString:@"iPad7,4"])      return @"iPad PRO (10.5)";
    
    return deviceModel;
}

- (BOOL)application:(UIApplication*)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions
{
//    self.window.rootViewController = navigationController
    // Override point for customization after application launch.
//    [FIRApp configure];
//    [GADMobileAds configureWithApplicationID:@"ca-app-pub-9756259708757876~9218350130"];
  
    self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
    self.window.backgroundColor = [UIColor whiteColor];
    [self.window makeKeyAndVisible];
    
    // 设置rootViewController
//    NextViewController *controller = [[NextViewController alloc] init];
//    self.window.rootViewController = controller;
//
    
    
    
    NSString *  nsStrIpad=@"iPad";
    bool  bIsiPad=false;
    bIsiPad=[self checkDevice:nsStrIpad];
    
    NSString *deviceModel = [self deviceModel];
    NSLog(@"deviceModel %@", deviceModel);
    if(bIsiPad)
    {
        UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"NextViewControllerIpadSmall" bundle:nil];
        if([deviceModel isEqualToString:@"iPad PRO (10.5)"])
        {
            storyboard = [UIStoryboard storyboardWithName:@"NextViewControllerIpadMid" bundle:nil];
        }
        else if([deviceModel isEqualToString:@"iPad PRO (12.9)"] || [deviceModel isEqualToString:@"iPad PRO 2 (12.9)"])
        {
            storyboard = [UIStoryboard storyboardWithName:@"NextViewControllerIpadMax" bundle:nil];
        }

        NSLog(@"hahahah %@", storyboard);
        
        NextViewController *vc = [storyboard instantiateViewControllerWithIdentifier:@"NextViewController"];
        self.window.rootViewController = vc;
    }
    else
    {
        UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"NextViewControllerSmall" bundle:nil];
        if([deviceModel isEqualToString:@"iPhone SE"] == FALSE)
        {
            storyboard = [UIStoryboard storyboardWithName:@"NextViewController" bundle:nil];
        }
        
        NSLog(@"hahahah %@", storyboard);
        
        NextViewController *vc = [storyboard instantiateViewControllerWithIdentifier:@"NextViewController"];
        self.window.rootViewController = vc;
    }
    
    return YES;
}


- (void)applicationWillResignActive:(UIApplication*)application
{
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication*)application
{
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}

- (void)applicationWillEnterForeground:(UIApplication*)application
{
    // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication*)application
{
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}

- (void)applicationWillTerminate:(UIApplication*)application
{
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    // Saves changes in the application's managed object context before the application terminates.
    [self saveContext];
}

#pragma mark - Core Data stack

@synthesize persistentContainer = _persistentContainer;

- (NSPersistentContainer*)persistentContainer
{
    // The persistent container for the application. This implementation creates and returns a container, having loaded the store for the application to it.
    @synchronized(self)
    {
        if (_persistentContainer == nil) {
            _persistentContainer = [[NSPersistentContainer alloc] initWithName:@"Example"];
            [_persistentContainer loadPersistentStoresWithCompletionHandler:^(NSPersistentStoreDescription* storeDescription, NSError* error) {
                if (error != nil) {
                    // Replace this implementation with code to handle the error appropriately.
                    // abort() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.

                    /*
                     Typical reasons for an error here include:
                     * The parent directory does not exist, cannot be created, or disallows writing.
                     * The persistent store is not accessible, due to permissions or data protection when the device is locked.
                     * The device is out of space.
                     * The store could not be migrated to the current model version.
                     Check the error message to determine what the actual problem was.
                    */
                    NSLog(@"Unresolved error %@, %@", error, error.userInfo);
                    abort();
                }
            }];
        }
    }

    return _persistentContainer;
}


#pragma mark - Core Data Saving support

- (void)saveContext
{
    NSManagedObjectContext* context = self.persistentContainer.viewContext;
    NSError* error = nil;
    if ([context hasChanges] && ![context save:&error]) {
        // Replace this implementation with code to handle the error appropriately.
        // abort() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
        NSLog(@"Unresolved error %@, %@", error, error.userInfo);
        abort();
    }
}

@end
