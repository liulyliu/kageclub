/*
 * @author myluluy@gmail.com
 * 第三方服务
 *
 * */

(function() {
    //TODO
    return ;
    function SNSServices() {
        this.snsList = {};

        this.config = {
            pre: 'sns_login_',
            callbackUrl: '/oauth2callbck'
        }

    };


    SNSServices.prototype.register = function(snsName, SNS, opts) {
        if (!this.snsList[snsName]) {
            this.snsList[snsName] = new SNS(opts || {});

            var sns = this.snsList[snsName];
        }
        return this.snsList[snsName];

    };

    SNSServices.prototype.init = function(container) {
        container.innerHTML = '';
        var _t = this;
        for (var sns in this.snsList) {
            var _sns = this.snsList[sns];
            if (!_sns.active) {
                continue;
            }
            container.innerHTML += '<a href="javascript:;" id="' + this.config.pre + sns + '">' + _sns.render() + '</a>';
            _sns.container = document.getElementById(this.config.pre + sns);
            _sns.connect();
            _sns.container.onclick = function(){
                if(_sns.active) {
                    _t.signin(_sns);
                } 
            }
        }
    }

    SNSServices.prototype.active = function(snsName) {};

    SNSServices.prototype.disable = function(snsName) {};

    SNSServices.prototype.signin = function(sns) {
            return sns.login();
    };

    SNSServices.prototype.signout = function(snsName, callback) {};

    function activeSns(sns) {

    }


    var snsSever = new SNSServices();

    snsSever.register('gplus', function(opts) {
        var callbackName = 'google_log' + +new Date();
        this.active = true;
        window[callbackName] = function(res) {

            console.info(res['access_token'])
            this.callback && this.callback.call(this, res);

        }
        
        this.bindTo = function(snsServer){
            
        
        }

        this.callback = function(authResult) {
                console.info(authResult['access_token'])

            if (authResult['access_token']) {
                // 已成功授权
            } else if (authResult['error']) {
                // 存在错误。
                // 可能的错误代码：
                //   “access_denied” - 用户拒绝访问您的应用
                //   “immediate_failed”- 无法自动登录用户帐户
                // console.log('存在错误：' + authResult['error']);
            }


        }

        this.render = function() {
            return ['<span style="cursor:pointer;background:#cc3732;color:#ffffff;width:auto;display:inline-block;border-radius:5px;">'
                ,'<span style="display:inline-block;vertical-align:middle;width:40px;height:34px;background:url(\'/public/img/btn_red_32.png\') transparent 5px 50% no-repeat;">','</span>'
                    ,'<span style="background:rgb(221, 75, 57);display:inline-block;border-radius: 0 5px 5px 0;width:75px;text-align:center;height:34px;line-height:34px;border-left:1px solid  #bb3f30;">登录</span>'
                ,'</span>'].join('');

        };
        
        this.login = function(){
            
        
        }
        
        this.connect = function() {
            this.jsConf = 'https://apis.google.com/js/client:plus.js?lang=zh-CN';
            var po = document.createElement('script');
            po.type = 'text/javascript';
            po.async = true;
            po.src = this.jsConf;
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(po, s);
            
        };


    }, {
        clientid: '211713583907-1dmqbrfdvm0tits1raponk8keqtvdqt4.apps.googleusercontent.com',
        'data-cookiepolicy': 'single_host_origin'
    });

    snsSever.init(document.getElementById('snsSign'));

})()
