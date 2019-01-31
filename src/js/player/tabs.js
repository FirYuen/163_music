//tabs
{
    let view ={
        el:'#tabs',
        init(){
            this.$el =  $(this.el);
        }
    }
    let model={}
    let controller={
       init(view,model){
            this.view = view
            this.model = model
            this.view.init()
            this.bindEvents()
       },
       bindEvents(){
           this.view.$el.on('click', 'li', function(e){
               let $li = $(e.currentTarget)
               //let index = $li.index()
            //    console.log($li.attr('data-tab-name'));
               window.eventHub.emit('changeTab',$li.attr('data-tab-name'))
               $li.addClass('active').siblings().removeClass('active')

           })
       }
    }
    controller.init(view,model)
}