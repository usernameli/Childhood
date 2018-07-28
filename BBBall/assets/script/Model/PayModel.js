cc.Class({
    extends:cc.Component,
    statics:{
        mPurchaseList:[],
        mExchangeList:[],
        parseInfo : function(params) {
            var purchase_list = [];
            var exchange_list = [];

            params.tabs.forEach(tab => {
                if (tab.subStore == 'diamond2coin') {
                    exchange_list = tab.items;
                }

                if (tab.subStore == 'diamond') {
                    purchase_list = tab.items;
                }
            });

            this.mPurchaseList = purchase_list;
            this.mExchangeList = exchange_list;
        },

        parseExchange : function(params) {

        },
    }
})