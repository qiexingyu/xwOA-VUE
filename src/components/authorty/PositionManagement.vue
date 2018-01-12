<template>
   
      <div class="PositionManagement">
          <div class="gonggao_bread">
            <a href="#/mainIndex/index" class="fa">首页</a>
            &gt;
            <span>权限管理</span>
            &gt;
            <span>岗位管理</span>
          </div>
          <div class="search_div">
            <label>岗位名称：</label>
            <input type="text" v-model="positionName" class="s_time"/>
            <span class="btn-blue-s" v-on:click="getPosition(1,10)">查询</span>
            <span class="btn-yellow-s" style="margin-left:0;" v-on:click="addPositon">新增</span>
          </div>
          <div class="gonggao_body table_body">
            <div class="data_table_head">
              <ul>
                <li class="td22 xh">编号</li>
                <li class="td25 xh">岗位名称</li>
                <li class="td25 xh">归属人员</li>
                <li class="td25 xh">操作</li>
              </ul>
            </div>
            <div v-if="deptData.length!=0" class="data_table_body" v-for="position in deptData">
              <ul>
                <li class="td22 xh">{{ position.positionId }}</li>
                <li class="td25 xh">{{ position.positionName }}</li>
                <li class="td25 xh" v-if="position.userList" v-bind:title="position.userList['userName']">
                   <span v-for="(k,n) in position.userList" v-if="n!=(position.userList.length-1)">{{ k.userName }}、</span>
                   <span v-for="(k,n) in position.userList" v-if="n==(position.userList.length-1)">{{ k.userName }}</span>
                </li>
                <li class="td25 xh">
                  <span class="changgeDept table_edit" v-on:click="changgePositon(position.deptId,position.positionId,position.positionName)">修改</span>
                </li>
              </ul>
            </div>
            <div v-if="deptData.length==0" class="data_table_body" style="text-align: center;line-height: 100px;color: #FF6666">
                暂无此岗位
            </div>

          </div>

          <div class="bgpop" v-if="isShowCover"></div>
           <div class="view_area lookDiv" style="width: 450px;height: 250px;padding: 5px 20px" v-if="isShowDetail">
                <div class="posMen" >{{ listName }}</div>
                <div class="posMenEdit">
                     <span><Icon style="color: #FF6666" type="android-star" ></Icon>所属部门：</span>
                     <select name="" id="deptChoose" v-model="deptType" >
                          <option  value="">请选择</option>
                          <option v-for="dept in deptChooseData"  v-bind:value="dept.deptId">{{ dept.deptName }}</option>
                     </select>
               
                </div>

              
                <div class="posMenEdit"><span><Icon style="color: #FF6666" type="android-star" ></Icon>岗位名称：</span><input class="textType" type="text" v-model="addPositionName" /></div>
               
               <div class="posMenEdit">
                     <span><Icon style="color: #FF6666" type="android-star" ></Icon>是否领导：</span>
                     <input class="radioType" type="radio" name="leader" value="1" v-model="isDeptLeader" style="width: 13px;height: 13px;margin-left: 20px;"/>是
                     <input class="radioType" type="radio" name="leader" value="0" v-model="isDeptLeader" style="width: 13px;height: 13px;margin-left: 20px;"/>否
                </div>


                <div class="view_btn" style="margin-top: 20px">
                     <span class="btn-blue-s" v-on:click="submitDept">提交</span>
                     <span class="btn-yellow-s" v-on:click="closePop">取消</span>
                </div>
           </div>


           <oa-alert ref="childAlert"></oa-alert>
           <oa-page ref="childPage"></oa-page>




      </div>



</template>
<style>
.posMen {
  font-size: 20px;
  font-weight: 700;
  text-align: center;  
}
.posMenEdit {
  font-size: 14px;
  margin-top: 15px 
}
.posMenEdit #deptChoose {
  width: 300px;
  
}
.posMenEdit .textType {
  width: 300px;
  padding-left: 10px;
  margin-left: 5px;
}

</style>

<script>
  import $ from 'jquery'
  import oaPage from '@/components/commonVue/Page'
  import oaAlert from '@/components/commonVue/Alert'
    export default {
        name: 'PositionManagement',
        components: {
          'oa-alert': oaAlert,
          'oa-page': oaPage
        },
        data () {
            return {
                positionName: '',
                listName: '',
                addPositionName: '',
                deptType: '',
                deptId: '',
                positionId: '',
                isDeptLeader: '0', //是否为领导
                pageNum: 1,
                pageSize: 10,
                isShowCover: false,  //是否显示遮盖层
                isShowDetail: false, //是否显示详情弹层
                path: this.OACommon["publicDef"]["qpath"],
                deptData: [],
                deptChooseData: [],
                positionData: []
            }
        },
        created: function(){
            this.getPosition();
        },
        methods:{
           getPosition: function(pn,ps){
              if(pn){
                this.pageNum = pn;
              }
              if(ps){
                this.pageSize = ps;
              }
              $.ajax({
                  url: this.path + "findPositionList",
                  type: 'get',  
                  dataType: 'json',
                  data: {
                     "jobNumber": localStorage.getItem("jobNumber"),
                     "sessionIdOa": localStorage.getItem("sessionIdOa"),
                     "positionName": this.positionName,
                     "pageNum": this.pageNum,
                     "pageSize": this.pageSize
                  },
                  success: function(data){ 
                    if(data.code == 200){
                      this.deptData = data["data"]["list"];
                      this.$refs.childPage.setArg(data["data"]["pages"],this.pageNum,this.pageSize,this.getPosition);
                    }else {
                      this.$refs.childAlert.show(data.msg);
                    }

                  }.bind(this),
                  error: function(err){
                    console.log("登录异常");
                  }
              }) 
            },
           getDivision: function(newNub){
              $.ajax({
                  url: this.path + "findDeptList",
                  type: 'get',  
                  dataType: 'json',
                  data: {
                     "jobNumber": localStorage.getItem("jobNumber"),
                     "sessionIdOa": localStorage.getItem("sessionIdOa"),
                     "deptName": '',
                     "newNub": newNub
                  },
                  success: function(data){ 
                      if(data.code == 200){
                        this.deptChooseData = data["data"];
                        if(newNub == 1){
                           this.deptType = '';
                           this.addPositionName = '';
                        }else {
                          this.deptType = this.deptId;
                        }
                      }else {
                        this.$refs.childAlert.show(data.msg);
                      }
                      
                  }.bind(this),
                  error: function(err){
                    console.log("登录异常");
                  }
              }) 
            },
           addPositon: function(){
              this.listName = '新增岗位';
              this.isShowCover = true;
              this.isShowDetail = true;
              var newNub = 1; 
              this.getDivision(newNub);
           },
           changgePositon: function(positiondeptId,positionId,positionName){
              this.listName = '修改岗位';
              this.deptId = positiondeptId;
              this.positionId = positionId;
              this.addPositionName = positionName;
              this.isShowCover = true;
              this.isShowDetail = true;
              var newNub = 0; 
              this.getDivision(newNub);
           },
           closePop: function(){
              this.isShowCover = false;
              this.isShowDetail = false;
           },
           submitDept: function(){
              if($("#deptChoose").find("option:selected").text()=="请选择"){
                     this.$refs.childAlert.show("请选择所属部门");
                     return false;
                 }
              if(!this.addPositionName){
                     this.$refs.childAlert.show("请输入岗位名称");
                     return false;
                 }

              this.deptId = $("#deptChoose").find("option:selected").val()

              $.ajax({
                  url: this.path + "insertPosition",
                  type: 'post',  
                  dataType: 'json',
                  data: {
                     "jobNumber": localStorage.getItem("jobNumber"),
                     "sessionIdOa": localStorage.getItem("sessionIdOa"),
                     "deptId": this.deptId,
                     "positionId": this.positionId,
                     "isDeptLeader": this.isDeptLeader,
                     "positionName": this.addPositionName
                  },
                  success: function(data){
                    if(data.code == 200){
                        this.isShowCover = false;
                        this.isShowDetail = false;
                        if(this.positionId){
                          this.$refs.childAlert.show("修改成功");
                        }else {
                          this.$refs.childAlert.show("新增成功");
                        }
                        this.getPosition();
                    }else {
                        this.$refs.childAlert.show(data.msg);
                    }
                           
                    
                  }.bind(this),
                  error: function(err){
                    console.log("登录异常");
                  }
              }) 
           }


        }
        
    }
</script>