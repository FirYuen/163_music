//eventHub
window.eventHub = {
    events: {},
    emit(eventName, data) {
        for (let key in this.events) {
            if (key === eventName) {
                this.events[key].map((fn) => {
                    fn.call(undefined, data)
                })
            }
        }
    },
    on(eventName, fn) {
        if (this.events[eventName] === undefined) {
            this.events[eventName] = []
        }
        this.events[eventName].push(fn)
    }
}
let APP_ID = 'IyMYfkHYfmI0gDAbyioJlqKW-gzGzoHsz';
let APP_KEY = 'YW3c1V2tAOpqaVKWrzyJnsP3';
AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});
//mainPage
{
    let view = {
        el: '.songInfo',
        template: `
        <h1>保存歌曲信息到数据库</h1> 
            <form>
                <div class="row">
                    <label for="">
                        歌名                     
                    </label>
                    <input  type="text" name="name" autocomplete="off" value="__name__">
                </div>
                <div class="row">
                <label for="">
                    歌手
                </label>
                <input  type="text" name="singer" autocomplete="off" value="__singer__" >
            </div>
                <div class="row">
                    <label for="">
                        文件大小
                    </label>
                    <span>__size__</span>
                    <!--<input  type="text" name="" id="" readonly="readonly"  value="__size__">-->
                </div>
                <div class="row">
                    <label for="">
                        外链
                    </label>
                    <span id="link">__link__</span>
                    <!-- <input type="text" name="" id="" readonly="readonly" value="__link__">-->
                </div>
                <div class="row actions">
                    <button type="submit">保存</button>
                    <span id="storageStatus" class = "hidden"  >保存成功</span>
                </div>
            </form>
        `,
        render(data = {}) {
            let placeholders = ['name', 'size', 'link', 'singer']
            let html = this.template
            placeholders.map((str) => {
                html = html.replace(`__${str}__`, controller.humanizeFileSize(data[str]))
            })
            $(this.el).html(html)
        },
        reset() {
            this.render({})
        }
    }
    let model = {
        data: {
            name: '',
            singer: '',
            link: '',
            id: ''
        },
        create(data) {
            var Song = AV.Object.extend('song');
            var song = new Song();
            return song.save({
                name: data.name,
                singer: data.singer,
                description: "test",
                link: data.link
            }).then((newSong) => {
                let {
                    id,
                    attributes
                } = newSong
                this.data = {
                    id: id,
                    name: attributes.name,
                    singer: attributes.singer,
                    link: attributes.link
                }
                // Object.assign(this.data,{
                //     id:id,
                //     name:attributes.name,
                //     singer:attributes.singer,
                //     link:attributes.link
                // })
                // Object.assign(this.data,{
                //     id:id,
                //     ...attributes,
                // })
                console.log(this.data);
            }, () => {})
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            window.eventHub.on('file', (data) => {
                console.log(data);
                this.reset(data)
            })
            this.saveStatus()
        },
        reset(data) {
            this.view.render(data)
        },
        humanizeFileSize(str) {
            if (str) {
                if (typeof (str) === "number") {
                    return humanize.filesize(str)
                }
                return str
            } else {
                return ''
            }
        },
        bindEvents() {
            $(this.view.el).on('submit', 'form', (e) => {
                e.preventDefault()
                let needs = 'name singer'.split(' ')
                let data = {}
                needs.map((str) => {
                    data[str] = $(this.view.el).find(`[name = "${str}"]`).val()
                })
                data.link = $(this.view.el).find('span:eq(1)').html()
                window.eventHub.emit('uploadSong', '')
                this.model.create(data)
                    .then(() => {
                        window.AV.Object.destroyAll()
                        window.eventHub.emit('create', this.model.data)
                    }, () => {
                        // $('#storageStatus').html('保存失败').addClass('success').removeClass('hidden')
                    })
            })
        },
        saveStatus(){
            window.eventHub.on('saveStatus',(data)=>{
                $('#storageStatus').addClass('success').removeClass('hidden')
                setTimeout(()=>{
                    this.view.reset()
                },1000)
            })
        }
    }
    controller.init(view, model)
}
//newSong
{
    let view = {
        el: '.newSong',
        template: `
        新建歌曲
        `,
        render(data) {
            $(this.el).html(this.template)
        }
    }
    let model = {}
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            window.eventHub.on('upload', (data) => {
                // console.log("song")
                // console.log(data);
                this.active(this.view.el)
            })
        },
        active(el) {
            $(el).addClass('active')
        }
    }
    controller.init(view, model)
}
//songList
{
    let view = {
        el: '#songList-container',
        template: `
        <ul class="songList" >
        </ul>
        `,
        render(data) {
            $(this.el).html(this.template)
            let {
                songs
            } = data
            let liList = songs.map((song) => {
                return $('<li></li>').text(song.name)
            })
            $(this.el).find('ul').empty()
            liList.map((domLi) => {
                $(this.el).find('ul').append(domLi)
            })
        },
        clearActive() {
            $(this.el).find('.active').removeClass('active')
        },
        activeItem(li){
            let $li = $(li)
            $li.addClass('active').siblings('.active').removeClass('active')
        }
    }
    let model = {
        data: {
            songs: []
        },
        find(){
            let query = new AV.Query('song')
            return query.find().then((songs) => {
                this.data.songs = songs.map((song)=>{
                    return {id:song.id,...song.attributes}
                })
                return songs
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEventHub()
            this.getAllSongs()
            this.bindevent()

        },
        bindevent(){
            $(this.view.el).on('click','li',(e)=>{

                
               this.view.activeItem(e.currentTarget)
            })
        },
        getAllSongs(){
            this.model.find().then(()=>{
                this.view.render(this.model.data)
            })
        },
        bindEventHub(){
            window.eventHub.on('create', (data) => {
                this.model.data.songs.push(data)
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view, model)
}
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
        }
    }
    let model = {
        kUptokenUrl: 'http://192.168.0.21:1337/sts'
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.uploadButton()
            this.uploadBar()
            window.eventHub.on('uploadSong', (data) => {
                    uploader.start();
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
                            controller.bar.animate(progress);
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
                        }
                    }
                });
            })
        },
        uploadButton() {
            $("#btnUpload").on("click", () => {
                console.log("clicked");
                uploader.start();
            })
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
    controller.init(view, model)
    controller.initUploader(model)
}