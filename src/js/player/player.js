let APP_ID = 'IyMYfkHYfmI0gDAbyioJlqKW-gzGzoHsz';
let APP_KEY = 'YW3c1V2tAOpqaVKWrzyJnsP3';
AV.init({
    appId: APP_ID,
    appKey: APP_KEY
}); 
{
    let view = {
        el: '.page',
        template: `
        <audio loop preload = "auto" src={{url}}>{{name}}</audio>
        <div class="disc-container">
                    <img class="pointer" src="//s3.music.126.net/m/s/img/needle-ip6.png?be4ebbeb6befadfcae75ce174e7db862 " alt="">
                    <div class="disc">
                        <div class="icon-wrapper">
                            <svg class="icon icon-play">
                                <use xlink:href="#icon-play"></use>
                            </svg>
                            <svg class="icon icon-pause">
                                <use xlink:href="#icon-pause"></use>
                            </svg>
                        </div>
                        <img class="ring" src="//s3.music.126.net/m/s/img/disc-ip6.png?69796123ad7cfe95781ea38aac8f2d48" alt="">
                        <img class="light" src="//s3.music.126.net/m/s/img/disc_light-ip6.png?996fc8a2bc62e1ab3f51f135fc459577" alt="">
                        <img src="//p1.music.126.net/_ZIyHUML8sXBvJXqLdQDOg==/105553116278617.jpg?imageView&thumbnail=360x0&quality=75&tostatic=0" alt="" class="cover">
                    </div>
                </div>
                <div class="song-description">
                    <h1>{{name}}</h1>
                    <div class="lyric">
                        <div class="lines">
                        </div>
                    </div>
                </div>
                <div class="links">
                    <a href="#">打开</a>
                    <a class="main" href="#">下载</a>
                </div>
        `,
        init() {
            this.$el = $(this.el);
        },
        render(data) {
            //link = encodeURI(data.song.link)
            link = encodeURI(`/src/Guns N' Roses - Sweet Child O' Mine.mp3`) //本地mock数据
            let playstatus = data.playing
            if (!(this.$el.find('audio').html())) {
                this.$el.html(this.template
                    .replace('{{url}}', link)
                    .replace(/{{name}}/g, data.song.name.replace('.mp3', '')))
            }
            if(playstatus){
                this.$el.find('.disc-container').addClass('playing')
            }else{
                this.$el.find('.disc-container').removeClass('playing')
            }
        },
        load(){
            let audio = this.$el.find('audio')[0]
            audio.load()
        }
        ,
        play() {
            let audio = this.$el.find('audio')[0]
            audio.play()
        },
        pause() {
            let audio = this.$el.find('audio')[0]
            audio.pause()
        }
    }
    let model = {
        data: {
            song:{
                id: '',
                name: '',
                singer: '',
                link: ''
            },
            playing: true
        },
        getSong(id) {
            var query = new AV.Query('song');
            return query.get(id).then((song) => {
                Object.assign(this.data.song, {
                    id: id,
                    ...song.attributes
                })
                //console.log(this.data);
            }, function (error) {
                alert('获取播放器页面失败，请返回重试');
            });
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            let id = this.getSongId()
            this.model.getSong(id).then(() => {
                this.view.render(model.data)
                this.view.load()
                let playPromise = this.view.play()
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        this.view.play()
                    }).catch(() => {
                    })
                }
            })
            this.bindEvents()
        },
        getSongId() {
            var param = window.location.search
            if (param) {
                if (param.indexOf('?') === 0) {
                    let songid = param.substring(4)
                    return songid
                }
            }
        },
        bindEvents() {
            this.view.$el.on('click', '.icon-wrapper', () => {
                if (this.model.data.playing) {
                    this.model.data.playing = !this.model.data.playing
                    this.view.render(this.model.data)
                    this.view.pause()
                } else {
                    this.model.data.playing = !this.model.data.playing
                    this.view.render(this.model.data)
                    this.view.play()
                }
            })
        }
    }
    controller.init(view, model)
}