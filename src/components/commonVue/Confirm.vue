<template>
  <div class="hello">
      <div class="bgpop" v-if="alertShow" style="z-index:1110;"></div>
      <div class="com_div" v-if="alertShow" style="z-index:1111;">
        <div class="com_tit">确认<span class="com_close" v-on:click="closeAlertX()"></span></div>
        <div class="com_bg">
          <div class="com_content"><span>{{ alertText }}</span></div>
          <div class="com_btn">
            <span class="btn-blue-s" v-on:click="closeAlert()">确定</span>
            <span class="btn-yellow-s" v-on:click="closeAlertX()">取消</span>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'Alert',
  data () {
    return {
      alertText: '',
      alertShow: false,
      backFn: ''
    }
  },
  methods: {
    show: function(txt, backfn){
      this.backFn = '';
      this.alertShow = true;
      this.alertText = txt;
      if(backfn){
        this.backFn = backfn;
      }
    },
    closeAlert: function(){
      this.alertShow = false;
      this.alertText = "";
      if(this.backFn){
        this.backFn();
      }
    },
    closeAlertX: function(){
      this.alertShow = false;
      this.alertText = "";
    }
  }
}
</script>


