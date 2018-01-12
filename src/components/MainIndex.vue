  <template>
    <div class="hello">
        <div class="top">
          <div class="top_left">北京学为教育集团OA系统</div>
          <div class="top_right">
            <span v-for="e in creditEduObj" style="margin-left:20px;">
              <span class="ps">{{ e.name }}</span>
              <span class="ps">&nbsp;:&nbsp;</span>
              <span class="ps">{{ OACommon.formatCurrency(e.money) }}</span>
            </span>
            <span class="sx" v-if="creditEduObj.length>0">&nbsp;</span>
            <span class="ps">{{ positionName?positionName:'' }}</span>
            <div class="top_yh_div">
              <span class="top_yh">{{ userName }}</span>
              <span class="top_yh_xj"></span>
              <ul class="top_yh_ul">
                <li v-on:click="updatePassword">修改密码</li>
                <li v-on:click="loginout">退出</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="x_body">
          <div class="x_left" id="x_left">
            <div class="leftList" v-for="(list,k) in wyLeftList">
                 <div class="firstLevel"  v-bind:class="[wyLeftList[k]['menuj'],list.permissionIconUrl]" v-on:click="parentClick(k)">
                    <a v-bind:href="list.url" v-if="list.url" style="display:inline-block;width:100px;" v-bind:style="{'color':(list.sonShow||winUrl.indexOf(list.url)!=-1)?'#2DC3E8':'#FFF'}">{{ list.name }}</a>
                    <i v-if="!list.url" v-bind:style="{'color':list.sonShow?'#2DC3E8':'#FFF'}">{{ list.name }}</i>
                    <span class='shang' v-if="wyLeftList[k]['sonShow']">&nbsp;</span>
                    <span class='xia' v-if="!wyLeftList[k]['sonShow']">&nbsp;</span>
                  </div>
                
                 <ul v-if="list.sonShow">
                    <li v-for="(secondList,v) in list.child" v-bind:class="[secondList.permissionIconUrl]" class="secondLevel menuj">
                      <a v-bind:class="{'point': winUrl.indexOf(secondList.childData.permissionUrl)!=-1}" 
                        style="display:inline-block;width:100%" :href="secondList.childData.permissionUrl">
                        {{ secondList.childData.permissionName }}
                      </a>
                      <span v-if="secondList.children">&nbsp;</span>
                    </li>                    
                </ul>
            </div>
          </div>
          <div class="x_right">
            <router-view/>
          </div>
        </div>

        <oa-update-pass ref="childUpdatePassword"></oa-update-pass>
    </div>
  </template>

  <script>
  import $ from 'jquery'
  import oaUpdatePassword from '@/components/commonVue/UpdatePass'

  export default {
    name: 'MainIndex',
    components: {
      'oa-update-pass': oaUpdatePassword
    },
    data () {
      return {
        userName: localStorage.getItem("userName"),
        creditEduObj: [],
        positionName: '',
        path: this.OACommon["publicDef"]["qpath"],
        leftList: "",
        check: "",
        wyLeftList: [
          {
            "sonShow": false,
            "menuj" : "menuj",
            "name": '',
            "url": '',
            "child": []
          }
        ],
        data: [],
        winUrl: window.location.href

      }
    },
    created: function(){
      if(!this.OACommon.getCookie("userId")){
        this.$router.push('/'); 
      }
      this.getTreeData();

      //顶部可用额度和职位
      var positionList = localStorage.getItem("positionList");
      positionList = JSON.parse(localStorage.getItem("positionList"));
      if(positionList){
        this.positionName = positionList[0]["positionName"];
      }

      //var positionListTwo = localStorage.getItem("positionListTwo");
      //positionListTwo = JSON.parse(localStorage.getItem("positionListTwo"));
      //this.creditEduObj = this.OACommon.formatCurrency(positionList[0]["creditMoney"]);
      //this.creditEduObj = positionListTwo;
      //开课费用右上角显示
      //if(positionList[0]["deptId"]==2 || positionList[0]["positionId"]==2){
        //this.creditEduObj.push({"money": localStorage.getItem("creditMoney"), "name": "开课费用额度"});
      //}

      //修改个人额度
      $.ajax({
        url: this.path + "findUserActualUsableMoney",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa")
        },
        success: function(edata){
          this.creditEduObj = edata["data"];
          localStorage.setItem("positionListTwo", JSON.stringify(edata["data"]));
        }.bind(this),
        error: function(){
          console.log("查询个人额度异常");
        }
      });
    },
    updated: function(){
      this.winUrl = window.location.href;
    },
    methods: {
      updatePassword: function(){
        this.$refs.childUpdatePassword.show();
      },
      parentClick: function(k){
        if(this.wyLeftList[k]["sonShow"]){
          for(var i=0;i<this.wyLeftList.length;i++){
            this.wyLeftList[i]["sonShow"] = false;
          }
        }else{
          for(var i=0;i<this.wyLeftList.length;i++){
            this.wyLeftList[i]["sonShow"] = false;
          }
          this.wyLeftList[k]["sonShow"] = true;
        }
      },
      childrenClick: function(k,ki){
          var wyList = this.wyLeftList;
          for(var i=0;i<wyList.length;i++){
            if(wyList[i]["child"].length>0){
              for(var j=0;j<wyList[i]["child"].length;j++){
                wyList[i]["child"][j]["point"] = false;
              }
            }
          }
          wyList[k]["child"][ki]["point"] = true;
      },
      loginout: function(){
        $.ajax({
          url: this.path + "loginOut",
          type: "get",
          dataType: "json",
          data: {
            "jobNumber": localStorage.getItem("jobNumber"),
            "sessionIdOa": localStorage.getItem("sessionIdOa") 
          },
          success: function(data){
            localStorage.clear();
            this.OACommon.delCookie("userId");
            this.$router.push('/');
          }.bind(this),
          error: function(err){
            console.log("退出登录异常");
          }
        });
      },
      getTreeData: function(){

        var leftPermissionList = localStorage.getItem("leftPermissionList");

        this.leftList = JSON.parse(localStorage.getItem("leftPermissionList"));
        var wl = this.leftList.length;
        this.wyLeftList = [];
        for(var i=0;i<wl;i++){
          if(this.leftList[i]["permissionName"]=="首页虚拟"){
            break;
          }
          this.wyLeftList.push({
            "sonShow": false,
            "menuj" : "menuj",
            "name": this.leftList[i]["permissionName"],
            "url": this.leftList[i]["permissionUrl"],
            "permissionIconUrl": this.leftList[i]["permissionIconUrl"],
            "child": []
          });
        }
        for(var j=0;j<wl;j++){
          if(this.leftList[j]["children"]&&this.leftList[j]["children"].length>0){
            if(this.leftList[j]["permissionName"] == "首页虚拟"){
              break;
            }
            for(var n=0;n<this.leftList[j]["children"].length;n++){
              this.wyLeftList[j]["child"].push({
                "point": false,
                "permissionIconUrl": this.leftList[j]["children"][n]["permissionIconUrl"],
                "childData": this.leftList[j]["children"][n] 
              });
              //判断当前点中url子节点
              if(window.location.href.indexOf(this.leftList[j]["children"][n]["permissionUrl"]) != -1){
                this.wyLeftList[j]["sonShow"] = true;
              }
            }
          }
        }
      }
    }
  }
  </script>
  <style>
    .x_left .secondLevel a.point{color:#2dc3e8;border-left: 3px solid #2dc3e8;padding-left: 52px;}
  </style>


