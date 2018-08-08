cc.Class({
    extends:cc.Component,
    statics:{
        mPurchaseList:[],
        mExchangeList:[],
        mSpecialGiftBagList:[],
        parseInfo : function(params) {
            let purchase_list = [];
            let exchange_list = [];
            let specialGiftBag_list = [];
            params.tabs.forEach(tab => {
                if (tab.subStore === 'diamond_exchange_ball') {
                    exchange_list = tab.items;
                }
                else if (tab.subStore === 'diamond') {
                    purchase_list = tab.items;
                }
                else if(tab.subStore === 'gift_box')
                {
                    specialGiftBag_list = tab.items;
                }

            });

            this.mPurchaseList = purchase_list;
            this.mExchangeList = exchange_list;
            this.mSpecialGiftBagList = specialGiftBag_list;
        },

        parseExchange : function(params) {

        },
    }
})