<template>
  <div class="hello">
      <div class="page_div" v-if="allPageNum>0">
        <div v-bind:class="{page_o:bigType, page_c:!bigType}">
          <a v-bind:class="{nod: nopStart}" v-on:click="prevGo2Page"><img src="/static/img/page-left.png"/></a>
          <a v-for="(p, pi) in groupListArray" v-bind:class="{cur:p.text==nowPage, point:p.text=='...'}" v-on:click="go2TargetPage(p.text)">{{ p.text }}</a>
          <a v-bind:class="{nod: nopEnd}" v-on:click="nextGo2Page"><img src="/static/img/page-right.png"/></a>
        </div>
        <div class="page_t" v-if="bigType">
          <span class="ty" v-on:mouseenter="showSelectEvePage();" v-on:mouseleave="hideSelectEvePage">
            <span ref="evepageNumVue">10条/页</span>
            <i></i>

            <ul class="page_sect_ul" v-if="selectEvePagePause">
              <li epage="10" v-on:click="selectEvePage">10条/页</li>
              <li epage="15" v-on:click="selectEvePage">15条/页</li>
              <li epage="20" v-on:click="selectEvePage">20条/页</li>
            </ul>
          </span>
          跳至<input type="text" v-model="go2PageNum" v-on:keyup="go2InputKeyup"/>页
          <span class="page_btn" v-on:click="sureGo2Page">确定</span>
          
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'Page',
  data () {
    return {
      allPageNum: 0,     //算出共几页
      nowPage: 1,        //当前是第几页
      evePageNum: 0,     //每页多少条
      go2PageNum: 1,     //要跳到哪一页,
      groupListArray: [],
      selectEvePagePause: false,
      backFn: '',
      nopStart: false,  //不可点击样式
      nopEnd: false,     //不可点击样式,
      bigType: true     //如果传2表示，只要页码
    }
  },
  methods: {
    //需要得到当前要分页数据的1、总页数 2、当前页数 3、每页多少条   4、回调父页面的获取列表方法
    setArg: function(allPageNum, nowPage, pageSize, backfn, bigType){
      this.allPageNum = allPageNum;
      this.nowPage = nowPage;
      this.evePageNum = pageSize;
      this.groupList();

      if(allPageNum == 1){
        this.nopStart = true;
        this.nopEnd = true;
      }else{
        if(nowPage == 1){
          this.nopStart = true;
          this.nopEnd = false;
        }else if(nowPage == allPageNum){
          this.nopStart = false;
          this.nopEnd = true;
        }else{
          this.nopStart = false;
          this.nopEnd = false;
        }
      }
      this.backFn = backfn;

      if(bigType){
        this.bigType = false;
      }
    },
    sureGo2Page: function(){
      //如果输入的值是当前页，不做处理
      //如果输入框没有值，不做处理
      if(this.go2PageNum!='' && (Number(this.nowPage) != Number(this.go2PageNum))){
        this.backFn(this.go2PageNum, this.evePageNum);  
      }
    },
    go2InputKeyup: function(){
      var num = Number(this.go2PageNum);
      var regu = /^[0-9]\d*$/;
      if(this.go2PageNum){
        if(!regu.test(num)){
          this.go2PageNum = 1;
          return false;
        }
        if((num>Number(this.allPageNum)) || num==0){
          this.go2PageNum = 1;
          return false;
        }
      }
    },
    groupList: function(){ //获取分页页码
      this.groupListArray = [];
      if(Number(this.allPageNum) <= 8){
        for(var i=1;i<=this.allPageNum;i++){
          this.groupListArray.push({"text": i});
        }
      }else{
        //根据当前所在页数添加...
        if(Number(this.nowPage) < 4){
          this.groupListArray.push({"text": 1}, {"text": 2}, {"text": 3}, {"text": 4}, {"text": "..."}, {"text": this.allPageNum});
        }else if(Number(this.nowPage) >= 4 && Number(this.nowPage) < (Number(this.allPageNum)-2)){
          this.groupListArray.push({"text": 1}, {"text": "..."}, {"text": Number(this.nowPage)-1}, {"text": this.nowPage}, {"text": Number(this.nowPage)+1}, {"text": "..."}, {"text": this.allPageNum});
        }else if(Number(this.nowPage) == (Number(this.allPageNum)-2)){
          this.groupListArray.push({"text": 1}, {"text": "..."}, {"text": Number(this.nowPage)-1}, {"text": this.nowPage}, {"text": Number(this.nowPage)+1}, {"text": this.allPageNum});
        }else if(Number(this.nowPage) == Number(this.allPageNum)){
          this.groupListArray.push({"text": 1}, {"text": "..."}, {"text": Number(this.nowPage)-2}, {"text": Number(this.nowPage)-1}, {"text": this.nowPage});
        }else{
          this.groupListArray.push({"text": 1}, {"text": "..."}, {"text": Number(this.nowPage)-1}, {"text": this.nowPage}, {"text": this.allPageNum});
        }
      }
    },
    showSelectEvePage: function(){  //选择XX条每页
      this.selectEvePagePause = true;
    },
    hideSelectEvePage: function(){
      this.selectEvePagePause = false;
    },
    selectEvePage: function(event){
      this.selectEvePagePause = false;
      
      if(Number(this.evePageNum) != Number(event.target.getAttribute("epage"))){   //不能选中现在的那一条
        this.evePageNum = Number(event.target.getAttribute("epage"));
        this.$refs.evepageNumVue.innerText = event.target.innerText;
        this.backFn(1, this.evePageNum);
      }
    },
    go2TargetPage: function(i){
      if(i == "..."){
        return false;
      }
      if(Number(i) != this.nowPage){
        this.backFn(i, this.evePageNum);
      }
    },
    prevGo2Page: function(){
      var nowPage = Number(this.nowPage);
      if(nowPage == 1){
        return false;
      }else{
        nowPage -= 1;
        this.backFn(nowPage, this.evePageNum);
      }
    },
    nextGo2Page: function(){
      var nowPage = Number(this.nowPage);
      if(nowPage == Number(this.allPageNum)){
        return false;
      }else{
        nowPage += 1;
        this.backFn(nowPage, this.evePageNum);
      }
    }
  }
}
</script>
<style>
  .page_o>a.nod, .page_c>a.nod{background:#FFF;color: #FFF;cursor:not-allowed;}
  .page_t, .page_o span, .page_c span{-webkit-user-select:none;user-select:none;}
</style>


