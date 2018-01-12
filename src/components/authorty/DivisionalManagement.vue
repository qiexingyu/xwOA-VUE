<template>
   
      <div class="DivisionalManagement">
           <div class="gonggao_bread">
                <a href="#/mainIndex/index" class="fa">首页</a>
                &gt;
                <span>权限管理</span>
                &gt;
                <span>部门管理</span>
           </div>
           <div class="search_div">
                <label>部门名称：</label>
                <input type="text" v-model="deptName" class="s_time"/>
                <span class="btn-blue-s" id="seacherDept" v-on:click="getDivision">查询</span>
                <span class="btn-yellow-s" id="addDept" style="margin-left:0;" v-on:click="addDept">新增</span>
           </div>
           <div class="gonggao_body table_body">
                <div class="data_table_head">
                  <ul>
                    <li class="td25 xh">编号</li>
                    <li class="td37 xh">部门名称</li>
                    <li class="td37 xh">操作</li>
                  </ul>
                </div>
                <div v-if="deptData.length!=0" class="data_table_body" id="deptLIst" v-for="dept in deptData">
                  <ul>
                    <li class="td25 xh">{{ dept.deptId}}</li>
                    <li class="td37 xh">{{ dept.deptName}}</li>
                    <li class="td37 xh">
                      <span class="changgeDept table_edit" v-on:click="changgeDept(dept.deptId,dept.deptName)">修改</span>
                    </li>
                  </ul>

                </div>
                <div v-if="deptData.length==0" class="data_table_body" style="text-align: center;line-height: 100px;color: #FF6666">
                    暂无此部门
                </div>
           </div>   

           <div class="bgpop" v-if="isShowCover" v-on:click="closePop"></div>
           <div class="view_area lookDiv" style="width: 450px;height: 150px;padding: 5px 20px" v-if="isShowDetail">
                <div class="divMen" >{{ listName }}</div>
                <div class="divMenfit"><span><Icon style="color: #FF6666" type="android-star" ></Icon>部门名称：</span><input class="textType" type="text" v-model="addDeptName" /></div>
                <div class="view_btn" style="margin-top: 20px">
                     <span class="btn-blue-s" v-on:click="submitDept">提交</span>
                     <span class="btn-yellow-s" v-on:click="closePop">取消</span>
                </div>
           </div>
           <oa-alert ref="childAlert"></oa-alert>


     </div>



</template>
<style>
.divMen {
  font-size: 20px;
  font-weight: 700;
  text-align: center;  
}
.divMenfit {
  font-size: 14px;
  margin-top: 15px 
}
.divMenfit .textType {
  width: 300px;
  padding-left: 5px
}

</style>

<script>
  import $ from 'jquery'
  import oaAlert from '@/components/commonVue/Alert'
    export default {
        name: 'DivisionalManagement',
        components: {
          'oa-alert': oaAlert
        },
        data () {
            return {
                deptName: '',
                addDeptName: '',
                listName: '',
                deptId: '',
                isShowCover: false,  //是否显示遮盖层
                isShowDetail: false, //是否显示详情弹层
                path: this.OACommon["publicDef"]["qpath"],
                deptData: []
            }
        },
        created: function(){
            this.getDivision();
        },
        methods:{
           getDivision: function(){
              
              $.ajax({
                  url: this.path + "findDeptList",
                  type: 'get',  
                  dataType: 'json',
                  data: {
                     "jobNumber": localStorage.getItem("jobNumber"),
                     "sessionIdOa": localStorage.getItem("sessionIdOa"),
                     "deptName": this.deptName
                     
                  },
                  success: function(data){ 

                      if(data.code == 200){
                         this.deptData = data["data"];
                      }else {
                        this.$refs.childAlert.show(data.msg);
                      }
                                 
                  }.bind(this),
                  error: function(err){
                    console.log("登录异常");
                  }
              }) 
            },
           addDept: function(){
              this.listName = '新增部门';
              this.deptID = '';
              this.isShowCover = true;
              this.isShowDetail = true;
           },
           changgeDept: function(deptID,deptName){
              this.listName = '修改部门';
              this.deptID = deptID;
              this.addDeptName = deptName;
              this.isShowCover = true;
              this.isShowDetail = true;
           },
           closePop: function(){
              this.isShowCover = false;
              this.isShowDetail = false;
            },
            submitDept: function(){
              if(!this.addDeptName){
                     this.$refs.childAlert.show("请输入部门名称");
                     return false;
                 }
              $.ajax({
                  url: this.path + "insertDept",
                  type: 'post',  
                  dataType: 'json',
                  data: {
                     "jobNumber": localStorage.getItem("jobNumber"),
                     "sessionIdOa": localStorage.getItem("sessionIdOa"),
                     "deptId": this.deptID,
                     "deptName": this.addDeptName
                  },
                  success: function(data){
                        if(data.code == 200){
                           this.isShowCover = false;
                           this.isShowDetail = false;
                           if(!this.deptID){
                             this.$refs.childAlert.show("新增部门成功");
                           }else {
                            this.$refs.childAlert.show("修改部门成功");
                           }
                           this.addDeptName = '';
                           this.getDivision();
                        }else {
                           this.$refs.childAlert.show(data.msg);
                        }
                        
                                             
                  }.bind(this),
                  error: function(err){
                    console.log("登录异常");
                  }
              }) 
            },


        }
        
    }
</script>