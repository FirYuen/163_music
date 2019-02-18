{
    let view = {
        el: '#hotList',
        template: `
        <li>
            <div class="cover">
                <img width=105 src="./img/1.png" alt="封面">
            </div>
            <p>时间让我们成为更好的人 也成为更冷漠的人</p>
        </li>
        <li>
        <div class="cover">
            <img width=105 src="./img/2.png" alt="封面">
        </div>
        <p>低吟浅唱丨我温暖的忧郁</p>
    </li>
    <li>
    <div class="cover">
        <img width=105 src="./img/3.png" alt="封面">
    </div>
    <p>北欧后摇氛围,如梦似幻的落寞之旅</p>
</li>
<li>
<div class="cover">
    <img width=105 src="./img/4.png" alt="封面">
</div>
<p>情人节特辑 | 为你，我准备了这份浪漫</p>
</li>
<li>
<div class="cover">
    <img width=105 src="./img/5.png" alt="封面">
</div>
<p>一周日语新歌推荐（02/09~02/15)</p>
</li>
<li>
<div class="cover">
    <img width=105 src="./img/6.png" alt="封面">
</div>
<p>听歌最怕应景，睹物最怕思人</p>
</li>
        
        `,
        init() {
            this.$el = $(this.el);
        },
        render(data) {
            this.$el.html(this.template)
        }
    }
    let model = {
        data: {},
        fetchHotList: function (params) {
            let randomid = []

            for (let i = 0; i < 40; i++) {
                let id = 2430321511 + Math.floor((Math.random() * 10000))
                randomid.push(id)
                console.log(id);
                if (randomid.length > 5) {
                    break
                } else {
                    // $.get(`https://api.mlwei.com/music/api/wy/?key=523077333&cache=1&type=songlist&id=${id}`, function (data) {
                    //     console.log(data);
                    // })
                }

            }

            console.log(randomid);



        }

    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.model.fetchHotList()
            this.view.init()
            this.view.render(model)
        }
    }
    controller.init(view, model)
}