// in designing...

// as normal model

let Backbone = require('backbone');

// Systems:
// Storage
// Model-Event in sync success error
// normal listener
let BaseModel = Backbone.Model.extend({
    prefill: true,
    data: {},
    getCacheKey: function(options) {
        // Move to Storage?maybe need keyword implements or @ to throw
        // more than model.json using
    },

    getCache: function() {
        // the same as getCacheKey()
    },
    url: function() {
        // mapping itself
    },
    initialize: function(options) {
        // add listener
        // 可能需要思考一个问题：弹窗的消息队列处理
    },
    fetch: function(options) {
        // 这里有个需求，
        // 在请求得到回应前防止多次请求

        // if (!this.lock) {
        //     this.lock = true;
        //     return Backbone.Model.prototype.fetch.call(this, _.extend({}, options, {
        //         prefill: this.prefill
        //     }));
        // }
    },
    sync: function(method, model, options) {

        // 正常需求
        // options.timeout = 5000;
        // options.type = this.type || 'GET';
        // options.data = signature(_.extend({}, this.data, options.data), this.pltapp); //,model.toJSON()
        // options.data.device = DEVICE;
        // options.data.regionBlockCode = localStorage.getItem('regionBlockCode');
        // options.data = options.type == 'GET' ? options.data : JSON.stringify(options.data);
        // options.beforeSend = (xhr) => {
        //         let token = window.userModel.getToken();
        //         if (token) {
        //             xhr.setRequestHeader('Api-Access-Token', token);
        //         }
        //         xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        //     }
        //     // options.success = (model, result) => {
        //     //     this.trigger('success',model,result,options);
        //     // }
        // return Backbone.Model.prototype.sync.call(this, method, model, options);
    },
    request: function(model, xhr, options) {
        

        // 这里又有个需求2
        // 确保请求响应至少有TIME_LIMIT的时间
        // setTimeout(() => {
        //     this.limitTime = true;
        //     if (this.getRequest) {
        //         if (!this.getRequest.error) {
        //             this.triggerData(this.getRequest.model, this.getRequest.resp, this.getRequest.options);
        //         } else {
        //             this.triggerErrored(this.getRequest.model, this.getRequest.resp, this.getRequest.options);
        //         }
        //     }
        // }, RESPONSE_TIME_LIMIT)
        // this.trigger('showOverlay', this, options.refresh);
    },
    synced: function(model, resp, options) {
        // 对应上述需求2
        // this.getRequest = { model: model, resp: resp, options: options };
        // if (this.limitTime) {
        //     this.triggerData(model, resp, options);
        // }
    },
    triggerData: function(model, resp, options) {
        // 接Storage
        // if (PARSE_CODE.call(this, resp.code)) {
        //     if (this.prefill) {
        //         Storage.updateCache(model, resp);
        //     }
        //     this.trigger('success', model, resp, options);
        // } else {
        //     this.trigger('error:failed', model, resp, options);
        // }
        // this.limitTime = undefined;
        // this.getRequest = undefined;
        // this.trigger('hideOverlay', this);
    },
    errored: function(model, resp, options) {
        // 接ErrorSystem
        // this.getRequest = { model: model, resp: resp, options: options, error: true };
        // if (this.limitTime) {
        //     this.triggerErrored(model, resp, options);
        // }
    },
    triggerErrored: function(model, resp, options) {
        // this.lock = null;
        // this.limitTime = undefined;
        // this.getRequest = undefined;
        // let cache = Storage.getCache(this);
        // if (cache) {
        //     setTimeout(() => {
        //         this.set(cache);
        //         this.trigger('success', this, resp, options);
        //         this.trigger('hideOverlay', this);
        //     }, RESPONSE_TIME_LIMIT);
        // }
        // if (!resp.errors) {
        //     setTimeout(() => {
        //         console.log(`%c ${this.resourceName} model throw the offline error`, 'background: orange; color: black')
        //         this.trigger('error:offline', model, resp, options);
        //         this.trigger('hideOverlay', this);
        //     }, RESPONSE_TIME_LIMIT);
        // }

    },
    //test parse
    parse: function(resp, options) {
        // 有牵涉ErrorSystem
        
        // delete this.lock;
        // if (resp.sysDatetime) {
        //     localStorage.setItem('sysDatetime', resp.sysDatetime);
        //     window.sysDatetime = resp.sysDatetime;
        // }
        // if (resp.code == '0') {
        //     return resp.data;
        // } else {
        //     // this.trigger('error',this,resp,options);
        //     // parse 返回值待商榷
        //     return resp.data;
        // }
    },
})