//upload
{
    let view = {
        el: '.uploadArea',
        template: `
        <div class="uploadContainer"> 
            <span id="fileName">歌曲名</span>
            <span id="speed">上传速度</span>
            <div id="progressbar"></div>
            <div class="last">
                <button id="file">选择歌曲</button>
            </div>
        </div>
        `,
        render() {
            $(this.el).html(this.template)
        },

        uploadBar() {
            var bar = new ProgressBar.Line('#progressbar', {
                strokeWidth: 1,
                easing: 'easeInOut',
                duration: 1400,
                color: '#E60026',
                trailColor: '#eee',
                //trailWidth: 1,
                svgStyle: {width: '100%', height: '100%'},
                text: {
                  style: {
                    color: '#999',
                    position: 'absolute',
                    right: '0',
                    //top: '0',
                    padding: '0px',
                    margin: '0px',
                    transform: null
                  },
                  autoStyleContainer: true
                },
                from: {color: '#FFEA82'},
                to: {color: '#ED6A5A'},
                step: (state, bar) => {
                  bar.setText(Math.round(bar.value() * 100) + ' %');
                }
              });
            this.bar = bar
            //bar.animate(1.0);
        }
    }
    let model = {
        kUptokenUrl: 'http://192.168.0.9:1337/sts'
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            
            this.view.uploadBar()
            window.eventHub.on('uploadSong', (data) => {
              if ($('#fileName').html()!=='歌曲名') {
                uploader.start();
                $('body').addClass('disabled')
              }       
            })
        },
        initUploader(model) {
            $.get(this.model.kUptokenUrl, response => {
                var sessionToken = JSON.parse(response)
                // console.log(sessionToken);
                uploader = new baidubce.bos.Uploader({
                    browse_button: '#file',
                    bos_bucket: 'music-163',
                    multi_selection: false,
                    max_file_size: '30Mb',
                    bos_multipart_min_size: '10Mb',
                    bos_task_parallel: 2,
                    bos_multipart_parallel: 5,
                    chunk_size: '30mb',
                    max_retries: 2,
                    // auto_start:true,
                    accept:'mp3',
                    bos_ak: sessionToken.AccessKeyId,
                    bos_sk: sessionToken.SecretAccessKey,
                    uptoken: sessionToken.SessionToken,
                    bos_endpoint: "http://su.bcebos.com",
                    init: {
                        FilesAdded: function (_, files) {
                            for (var i = 0; i < files.length; i++) {
                                var file = files[i]
                                //console.log(file)
                                let {
                                    name,
                                    uuid,
                                    size
                                } = file
                                link = "https://music-163.su.bcebos.com/" + name
                                $('#fileName').html(name)
                                window.eventHub.emit('file', {
                                    name,
                                    uuid,
                                    size,
                                    link
                                })
                            }
                        },
                        UploadProgress: function (_, file, progress, event) {
                            // console.log((progress * 100).toFixed(2) + '%');
                            /* bar.animate(0.5);  */
                            view.bar.animate(progress);
                        },
                        NetworkSpeed: function (_, bytes, time, pendings) {
                            var speed = bytes / (time / 1000);
                            var html = '上传速度：' + humanize.filesize(speed) + '/s';
                            var seconds = pendings / speed;
                            if (seconds > 1) {
                                var dhms = baidubce.utils.toDHMS(~~seconds);
                                html += '，剩余时间：' + [
                                    humanize.pad(dhms.HH, 2, '0'),
                                    humanize.pad(dhms.MM, 2, '0'),
                                    humanize.pad(dhms.SS, 2, '0')
                                ].join(':');
                            }
                            $('#speed').html(html)
                        },
                        UploadComplete:function () {
                            window.eventHub.emit('saveStatus','')
                            $('body').removeClass('disabled')
                        }
                    }
                });
            })
        }
    }
    controller.init(view, model)
    controller.initUploader(model)
}