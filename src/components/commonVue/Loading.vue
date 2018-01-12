<template>
  <div class="hello">
      <div class="bgpop" v-if="loadShow" style="z-index:11111;"></div>
      <div v-if="loadShow" class="load_div"><Icon type="load-a"></Icon></div>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  data () {
    return {
      loadShow: false
    }
  },
  methods: {
    show: function(){
      this.loadShow = true;
    },
    hide: function(){
      this.loadShow = false;
    }
  }
}
</script>


