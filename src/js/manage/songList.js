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
                if (song.singer) {
                    return $('<li></li>').text(`${song.singer} - ${song.name}`).attr('data-id',song.id)
                }else{
                    return $('<li></li>').text(song.name).attr('data-id',song.id)

                }

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
               let id = e.currentTarget.getAttribute('data-id')
               for (let i = 0; i< this.model.data.songs.length;i++) {
                  if(id === this.model.data.songs[i].id){
                    //   console.log(this.model.data.songs[i]);
                      window.eventHub.emit('file',JSON.parse(JSON.stringify(this.model.data.songs[i])))
                      break
                  }
               }
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