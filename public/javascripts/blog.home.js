(function() {



    var ToolImage = function() {
        var self = this,
            $body = $('body');
        this.$win = $([
            '<div class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="editorToolImageTitle" aria-hidden="true">',
            '<div class="modal-header">',
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>',
            '<h3 id="editorToolImageTitle">图片</h3>',
            '</div>',
            '<div class="modal-body">',
            '<div class="upload-img">',
            '<div class="button">上传图片</div>',
            '<span class="tip"></span>',
            '<div class="alert alert-error hide"></div>',
            '</div>',
            '</div>',
            '</div>'
        ].join('')).appendTo($body);

        this.$upload = this.$win.find('.upload-img').css({
            height: 50,
            padding: '60px 0',
            textAlign: 'center',
            border: '4px dashed#ddd'
        });

        this.$uploadBtn = this.$upload.find('.button').css({
            width: 86,
            height: 40,
            margin: '0 auto'
        });

        this.$uploadTip = this.$upload.find('.tip').hide();

        this.file = false;
        var _csrf = $('[name=_csrf]').val();

        this.uploader = window.WebUploader.create({
            swf: '/public/libs/webuploader/Uploader.swf',
            server: '/upload?_csrf=' + _csrf,
            pick: this.$uploadBtn[0],
            paste: document.body,
            dnd: this.$upload[0],
            auto: true,
            fileSingleSizeLimit: 2 * 1024 * 1024,
            //sendAsBinary: true,
            // 只允许选择图片文件。
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
            }
        });

        this.uploader.on('beforeFileQueued', function(file) {
            if (self.file !== false) {
                return false;
            }
            console.info(self.file)
        });

        this.uploader.on('uploadProgress', function(file, percentage) {
            // console.log(percentage);
            self.showProgress(file, percentage * 100);
        });

        this.uploader.on('uploadSuccess', function(file, res) {
            if (res.success) {
                console.info(res);
                self.$win.modal('hide');
                $.ajax({
                    url: '/blog/api/modify',
                    type: 'post',
                    data: {
                        headpic: res.url
                    },

                    success: function(data) {
                        console.info(data);
                        $('#topbg,#topblur').css({
                            backgroundImage: 'url(' + res.url + ')'
                        });
                    }
                });

            } else {
                self.removeFile();
                self.showError(res.msg || '服务器走神了，上传失败');
            }
        });

        this.uploader.on('uploadComplete', function(file) {
            self.uploader.removeFile(file);
            self.removeFile();
        });

        this.uploader.on('error', function(type) {
            self.removeFile();
            switch (type) {
                case 'Q_EXCEED_SIZE_LIMIT':
                case 'F_EXCEED_SIZE':
                    self.showError('文件太大了, 不能超过2M');
                    break;
                case 'Q_TYPE_DENIED':
                    self.showError('只能上传图片');
                    break;
                default:
                    self.showError('发生未知错误');
            }
        });

        this.uploader.on('uploadError', function() {
            self.removeFile();
            self.showError('服务器走神了，上传失败');
        });
    };
    ToolImage.prototype.removeFile = function() {
        //var self = this;
        this.file = false;
        this.$uploadBtn.show();
        this.$uploadTip.hide();
    };

    ToolImage.prototype.showFile = function(file) {
        //var self = this;
        this.file = file;
        this.$uploadBtn.hide();
        this.$uploadTip.html('正在上传: ' + file.name).show();
        this.hideError();
    };

    ToolImage.prototype.showError = function(error) {
        this.$upload.find('.alert-error').html(error).show();
    };

    ToolImage.prototype.hideError = function(error) {
        this.$upload.find('.alert-error').hide();
    };

    ToolImage.prototype.showProgress = function(file, percentage) {
        this.$uploadTip
            .html('正在上传: ' + file.name + ' ' + percentage + '%')
            .show();
    };

    ToolImage.prototype.bind = function($btn) {

        this.$btn = $btn, self = this;
        this.$btn.on('click', function(e) {
            e.preventDefault();
            self.$win.modal('show');
        })
    };

    var toolImage = new ToolImage();
    toolImage.bind($('#btn_change_headbg'));
})();
