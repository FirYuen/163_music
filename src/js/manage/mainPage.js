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
        reset(data) {
            this.render(data)
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
               //邓福如 - Nothing on you.mp3
               if(data.singer){
               }else{
                var split = data.name.split(` - `)
                data.name = split[1]
                data.singer = split[0]
               }
                this.view.reset(data)
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
                if ($(this.view.el).find('span:eq(1)').html()) {
                    window.eventHub.emit('uploadSong', '')
                    this.model.create(data)
                        .then(() => {
                            window.AV.Object.destroyAll()
                            window.eventHub.emit('create', this.model.data)
                        }, () => {
                            // $('#storageStatus').html('保存失败').addClass('success').removeClass('hidden')
                        })
                    
                }else{
                    alert(`外链为空时属于无效上传\n请选择或上传歌曲再试！`)
                }
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