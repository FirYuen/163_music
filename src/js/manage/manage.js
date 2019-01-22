
let APP_ID = 'IyMYfkHYfmI0gDAbyioJlqKW-gzGzoHsz';
let APP_KEY = 'YW3c1V2tAOpqaVKWrzyJnsP3';
AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});

//newSong
{
    let view = {
        el: '.newSong',
        template: `
        歌曲列表
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

