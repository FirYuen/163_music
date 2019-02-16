{
    let view = {
        el:'#songs',
        template:`
        <li>
        <h3>{{song.name}}</h3>
        <p>
          <svg class="icon icon-sq">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-sq"></use>
          </svg>
          {{song.singer}}
        </p>
        <a class="playButton" href="./player.html?id={{song.id}}">
          <svg class="icon icon-play">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-play"></use>
          </svg>
        </a>
      </li>
        `,
        init(){
            this.$el = $(this.el);
        },
        render(data){
            data.forEach(song => {
                let $li = $(this.template
                    .replace('{{song.name}}',song.name.replace('.mp3',''))
                    .replace('{{song.singer}}',song.singer)
                    .replace('{{song.id}}',song.id))
            this.$el.append($li)
            });
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
    let controller ={
        init(view,model){
            this.view = view
            this.model = model
            this.view.init()
            this.model.find().then((songs)=>{
                this.view.render(this.model.data.songs)
            })
            this.bindEvents()
        },
        bindEvents(){
        }
    }
    controller.init(view,model)
}