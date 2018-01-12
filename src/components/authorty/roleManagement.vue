<template>
   
   <div class="roleManagement">
      <div class="gonggao_bread">
        <a href="#/mainIndex/index" class="fa">首页</a>
        &gt;
        <span>权限管理</span>
        &gt;
        <span>角色管理</span>
      </div>
      <div class="search_div">
                <label>角色名称：</label>
                <input type="text" v-model="roleName" class="s_time"/>
                <span class="btn-blue-s" id="seacherDept" v-on:click="getRole(1,10)" >查询</span>
                <span class="btn-yellow-s" style="margin-left:0;" v-on:click="addRole" >新增</span>
      </div>
      <div class="gonggao_body table_body" style="padding-top: 20px">
        <div class="money_table">
          <table cellpadding="0" cellspacing="0" border="1" style="text-align: center">
              <thead>
              <tr>
                <td width="30%">ID</td>
                <td width="30%">角色名称</td>
                <td width="30%">操作</td>
              </tr>
              </thead>
              <tbody>
                 <tr v-if="roleData.length!=0" v-for="role in roleData">
                   <td>{{ role.roleId }}</td>
                   <td>{{ role.roleDescription }}</td>
                   <td>
                     <span class="roleEdit" v-on:click="roleEdit(role.roleDescription,role.roleId,role.roleCode)" style="margin-right: 8px;cursor: pointer"><Icon title="编辑" style="color: #00a1e9;font-size: 20px"  type="android-create"></Icon></span>
                     <span class="roleDelete" v-on:click="roleDelete(role.roleDescription,role.roleId)" style="margin-right: 8px;cursor: pointer"><Icon title="删除" style="color: #FF6666;font-size: 20px"  type="android-delete"></Icon></span>
                     <span class="roleSet" v-on:click="roleSet(role.roleDescription,role.roleId)" style="margin-right: 8px;cursor: pointer"><Icon title="分配权限" style="color: #FE7A0E;font-size: 20px"  type="android-settings"></Icon></span>
   
                   </td>
                 </tr>

                 <tr v-if="roleData.length==0" class="data_table_body" style="text-align: center;line-height: 100px;color: #FF6666">
                      <td colSpan="3">暂无此角色</td>
                 </tr>
                 
              </tbody>
              
            </table>
        </div>
      </div>

      
      <div class="bgpop" v-if="isShowCover" v-on:click="closeMenu"></div>
      <div class="view_area lookDiv" style="width: 450px;height: 200px;padding: 5px 20px" v-if="isShowDetail">
           <div class="roleMen" >{{ listName }}</div>
           <div class="roleMenEdit"><span><Icon style="color: #FF6666" type="android-star" ></Icon>角色名称：</span><input class="textType" type="text" v-model="editRoleName" /></div>
           <div class="roleMenEdit"><span><Icon style="color: #FF6666" type="android-star" ></Icon>权限信息：</span><input class="textType" type="text" v-model="editRoleCode" /></div>
           <div class="view_btn" style="margin-top: 20px">
                <span class="btn-blue-s" v-on:click="submitRole">提交</span>
                <span class="btn-yellow-s" v-on:click="closePop">取消</span>
           </div>
      </div>

      <div class="view_area lookDiv" style="width: 450px;height: 500px;padding: 5px 20px" v-if="isShowMenu">
      <div class="roleMen" >{{ editRoleName }}<span style="font-size: 15px;font-weight: 100">{{ listName }}</span> <span class="closexx"  v-on:click="closeMenu"><Icon type="android-cancel"></Icon></span></div>
           <Tree :data="menuData" @on-check-change="getCheckedNodes" style="width: 400px" show-checkbox  ></Tree>        
     
           <div class="view_btn" style="margin-top: 20px">
                <span class="btn-blue-s" v-on:click="submitTree">提交</span>
                <span class="btn-yellow-s" v-on:click="closeMenu">取消</span>
           </div>
      </div>


      <oa-alert ref="childAlert"></oa-alert>
      <oa-confirm ref="childConfirm"></oa-confirm>

      <oa-page ref="childPage"></oa-page>


    </div>




</template>
<style>
.roleMen {
  font-size: 20px;
  font-weight: 700;
  text-align: center;  
}
.roleMenEdit {
  font-size: 14px;
  margin-top: 15px 
}
.roleMenEdit #deptChoose {
  width: 300px;
  
}
.roleMenEdit .textType {
  width: 300px;
  padding-left: 10px;
  margin-left: 5px;
}

</style>

<script>
  import $ from 'jquery'
  import oaPage from '@/components/commonVue/Page'
  import oaAlert from '@/components/commonVue/Alert'
  import oaConfirm from '@/components/commonVue/Confirm'
    export default {
        name: 'PositionManagement',
        components: {
          'oa-alert': oaAlert,
          'oa-page': oaPage,
          'oa-confirm': oaConfirm
        },
        data () {
            return {
                roleName: '',
                roleId:'',
                editRoleName: '',
                editRoleCode: '',
                pageNum: 1,
                pageSize: 10,
                isShowCover: false,  //是否显示遮盖层
                isShowDetail: false, //是否显示详情弹层
                isShowMenu: false,//是否显示权限管理
                path: this.OACommon["publicDef"]["qpath"],
                roleData: [],
                menuData: [],
                treeArr:[]
            }
        },
        created: function(){
            this.getRole();
        },
        methods:{
           getRole: function(pn,ps){   //获取角色数据
              if(pn){
                this.pageNum = pn;
              }
              if(ps){
                this.pageSize = ps;
              }
              $.ajax({
                  url: this.path + "findAllRoleByPage",
                  type: 'get',  
                  dataType: 'json',
                  data: {
                     "jobNumber": localStorage.getItem("jobNumber"),
                     "sessionIdOa": localStorage.getItem("sessionIdOa"),
                     "roleDescription": this.roleName,
                     "pageNum": this.pageNum,
                     "pageSize": this.pageSize
                  },
                  success: function(data){ 
                      if(data.code == 200){
                         this.roleData = data["data"]["list"];
                         this.$refs.childPage.setArg(data["data"]["pages"],this.pageNum,this.pageSize,this.getRole);
                      }else {
                         this.$refs.childAlert.show(data.msg);
                      }

                      
                  }.bind(this),
                  error: function(err){
                    console.log("登录异常");
                  }
              }) 
           },
           addRole: function(){ //新增角色
              this.listName = '新增角色';
              this.editRoleName = '';
              this.roleId = '';
              this.editRoleCode = '';
              this.isShowCover = true;
              this.isShowDetail = true;
           },
           roleEdit: function(editRoleName,roleId,roleCode){ //编辑角色
              this.listName = '编辑角色';
              this.editRoleName = editRoleName;
              this.roleId = roleId;
              this.editRoleCode = roleCode;
              this.isShowCover = true;
              this.isShowDetail = true;  
           },
           roleDelete: function(roleDescription,roleId){ //是否删除角色弹窗提示
              var roleName = roleDescription;
              this.roleId = roleId;
              this.$refs.childConfirm.show("你确定删除"+ roleName +"角色吗？",this.removeRole);
           },
           removeRole: function(){ //删除角色
               $.ajax({
                  url: this.path + "deleteRoleByRoleId",
                  type: 'post',  
                  dataType: 'json',
                  data: {
                     "jobNumber": localStorage.getItem("jobNumber"),
                     "sessionIdOa": localStorage.getItem("sessionIdOa"),
                     "roleId": this.roleId
                  },
                  success: function(data){ 
                        if(data.code == 200){
                          this.$refs.childAlert.show("成功删除该角色",this.getRole);
                        }else{
                          this.$refs.childAlert.show(data["msg"]);
                        }
                      
                  }.bind(this),
                  error: function(err){
                    console.log("登录异常");
                  }
                }) 
           },
           closePop: function(){ //取消按钮
              this.isShowCover = false;
              this.isShowDetail = false;
           },
           submitRole: function(){
              if(!this.editRoleName){
                     this.$refs.childAlert.show("请输入角色名称");
                     return false;
                 }
              if(!this.editRoleCode){
                  this.$refs.childAlert.show("请输入权限信息");
                  return false;
              }
            
              $.ajax({
                  url: this.path + "saveOrUpdateRole",
                  type: 'post',  
                  dataType: 'json',
                  data: {
                     "jobNumber": localStorage.getItem("jobNumber"),
                     "sessionIdOa": localStorage.getItem("sessionIdOa"),
                     "roleId": this.roleId,
                     "roleCode": this.editRoleCode,
                     "roleDescription": this.editRoleName
                  },
                  success: function(data){
                    if(data.code == 200){
                        if(this.roleId){
                          this.$refs.childAlert.show("修改成功");
                        }else {
                          this.$refs.childAlert.show("新增成功");
                        }
                        this.isShowCover = false;
                        this.isShowDetail = false;
                        this.getRole();
                    }else {
                        this.$refs.childAlert.show(data.msg);
                    }
                           
                    
                  }.bind(this),
                  error: function(err){
                    console.log("登录异常");
                  }
              }) 
           },
           roleSet: function(editRoleName,roleId){
              this.listName = '分配权限';
              this.editRoleName = editRoleName;
              this.roleId = roleId;
              this.getTreeData();
              this.isShowCover = true;
              this.isShowMenu = true;
           },
           closeMenu: function(){ //取消权限按钮
              this.isShowCover = false;
              this.isShowMenu = false;
           },
           getTreeData: function(){ //获取权限树
              $.ajax({
                  url: this.path + "findAllPermissionAndRolePermission",
                  type: 'post',  
                  dataType: 'json',
                  data: {
                     "jobNumber": localStorage.getItem("jobNumber"),
                     "sessionIdOa": localStorage.getItem("sessionIdOa"),
                     "roleId": this.roleId
                  },
                  success: function(tdata){  
                    if(tdata.code == 200){
                      this.menuData = tdata["data"];
                    }else {
                      this.$refs.childAlert.show(data.msg);
                    }          
                    
                  }.bind(this),
                  error: function(err){
                    console.log("登录异常");
                  }
              }) 
           },
           getCheckedNodes: function(aData){
              var tArr = [];
              for(var i=0;i<aData.length;i++){
                if(aData[i].pids){
                  if(aData[i].pids.charAt(0) == ","){
                    aData[i].pids = aData[i].pids.slice(1);
                    }
                  tArr.push(aData[i].pids)
                }
               
              }
              this.treeArr = tArr.toString();
            
              

           },
           submitTree: function(){
              if(this.treeArr == ''){
                 this.$refs.childAlert.show("请先分配权限");
                 return false;
              }
              $.ajax({
                  url: this.path + "saveOrUpdateRolePermission",
                  type: 'post',  
                  dataType: 'json',
                  data: {
                     "jobNumber": localStorage.getItem("jobNumber"),
                     "sessionIdOa": localStorage.getItem("sessionIdOa"),
                     "roleId": this.roleId,
                     "permissionIds": this.treeArr
                  },
                  success: function(data){
                    if(data.code == 200){
                        this.isShowCover = false;
                        this.isShowMenu = false;
                        this.$refs.childAlert.show("分配权限成功");
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