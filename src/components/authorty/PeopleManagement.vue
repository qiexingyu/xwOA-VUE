<template>
   
      <div class="PeopleManagement">
           <div class="gonggao_bread">
             <a href="#/mainIndex/index" class="fa">首页</a>
             &gt;
             <span>权限管理</span>
             &gt;
             <span>人员管理</span>
           </div>
           <div class="search_div">
             <label>部门：</label>
             <select name="" id="deptChoose" v-model="deptType" >
                  <option  value="">请选择</option>
                  <option v-for="dept in deptChooseData"  v-bind:value="dept.deptId">{{ dept.deptName }}</option>
             </select>
             <label>姓名：</label>
             <input class="textType" type="text" v-model="peopleName" />

             <span class="btn-blue-s" v-on:click="getPeople(1,10)">查询</span>
             <span class="btn-yellow-s" style="margin-left:0;" v-on:click="addPeople">新增</span>
           </div>
           <div class="gonggao_body table_body">
             <div class="data_table_head">
               <ul>
                 <li class="td10 xh">姓名</li>
                 <li class="td16 xh">部门</li>
                 <li class="td16 xh">角色</li>
                 <li class="td22 xh">账号</li>
                 <li class="td22 xh">联系方式</li>
                 <li class="td14 xh">操作</li>
               </ul>
             </div>
             <div v-if="peopleData.length!=0" class="data_table_body" v-for="people in peopleData">
               <ul>
                 <li class="td10 xh">{{ people.userName }}</li>
                 <li class="td16 xh">{{ people.deptName }}</li>
                 <li class="td16 xh"><span v-for="k in people.positionList">{{ k.positionName }}</span></li>
                 <li class="td22 xh">{{ people.jobNumber }}</li>
                 <li class="td22 xh">{{ people.userPhone }}</li>
                 <li class="td14 xh">
                      <span class="changgeDept table_edit" v-on:click="changgePeople(people)">修改</span>
                 </li>
               </ul>
             </div>
             <div v-if="peopleData.length==0" class="data_table_body" style="text-align: center;line-height: 100px;color: #FF6666">
                 暂无此人员
             </div>
           </div>


           <div class="bgpop" v-if="isShowCover"></div>
           <div class="view_area lookDiv" style="width: 880px;height: 450px;padding: 5px 20px" v-if="isShowDetail">
               <div class="peoMen" >
                  {{ listName }}
                  <span class="closexx"  v-on:click="closePop"><Icon type="android-cancel"></Icon></span>
               </div>
               <div class="peoMenEdit">
                     <span class="prompt"><Icon style="color: #FF6666" type="android-star" ></Icon>账号：</span>
                     <input class="textType" type="text" v-model="account" />
                     <span class="prompt"><Icon style="color: #FF6666" type="android-star" ></Icon>姓名：</span>
                     <input class="textType" type="text" v-model="userName" />
                     <span class="prompt"><Icon style="color: #FF6666" type="android-star" ></Icon>手机号：</span>
                     <input class="textType" type="text" v-model="userPhone" v-on:keyup="inputKey()" />
                </div>

                <div class="peoMenEdit">
                     <span class="prompt"><Icon style="color: #FF6666" type="android-star" ></Icon>角色：</span>
                     
                     <Select v-model="roleList" multiple style="width:170px">
                         <Option v-for="role in roleData" :value="role.roleId" :key="role.roleId">{{ role.roleDescription }}</Option>
                     </Select>

                     <span class="prompt">邮箱：</span>
                     <input class="textType" type="text" v-model="email" />
                     <span class="prompt"><Icon style="color: #FF6666" type="android-star" ></Icon>用户状态：</span>
                     <input class="radioType" type="radio" name="userState" value="1" v-model="userState" style="width: 13px;height: 13px;margin-left: 20px;"/>启用
                     <input class="radioType" type="radio" name="userState" value="0" v-model="userState" style="width: 13px;height: 13px;margin-left: 20px;"/>禁用
                </div>

                <div class="peoMenEdit">
                     <span class="prompt"><Icon style="color: #FF6666" type="android-star" ></Icon>密码：</span>
                     <input class="textType" type="password" v-model="loginPassword" />
                     <span class="prompt"><Icon style="color: #FF6666" type="android-star" ></Icon>确认密码：</span>
                     <input class="textType" type="password" v-model="againPassword" />
                     <span class="prompt"><Icon style="color: #FF6666" type="android-star" ></Icon>所在部门：</span>
                     <select name="" v-on:change="getPosition" class="deptChoose" v-model="deptId" >
                          <option  value="">请选择</option>
                          <option v-for="dept in deptChooseData"  v-bind:value="dept.deptId">{{ dept.deptName }}</option>
                     </select>
                </div>

                <div class="peoMenEdit" style="width: 102%;margin-top: 0px">
                     <div class="peoMenEdit" style="position: relative;" v-for="(k,v) in poList">
                         <div title="添加职位" v-if="v==(poList.length-1)" v-on:click="addPoList" style="position: absolute;top: 50%;margin-top: -14px;left:5px;cursor: pointer;"><Icon style="color: #00a1e9;font-size:25px" type="android-add-circle"></Icon></div>
                       
                         <span class="prompt"><Icon style="color: #FF6666" type="android-star" ></Icon>职位：</span>
                         <select name="" class="deptChoose" v-model="k.pointerModel" v-on:change="findIsAlready(k.pointerModel)" >
                              <option  value="">请选择</option>
                              <option v-for="dep in poList[v].deptData"  v-bind:value="dep.positionId">{{ dep.positionName }}</option>
                         </select>
                         <span class="prompt">区域：</span>

                         <Select v-model="poList[v].areaList" multiple @on-change="areaChange(v)" style="width:170px">
                             <Option v-for="area in poList[v].findArea" :value="area.areaId" :key="area.areaId">{{ area.areaName }}</Option>
                         </Select>
                         
                         <span class="prompt">省份：</span>
                         <select name="" class="deptChoose" v-model="k.provinceModel" v-on:change="provinceChange(v)" >
                              <option  value="xw-qxz">请选择</option>
                              <option  value="">全部</option>
                              <option v-for="province in poList[v].province"  v-bind:value="province.provinceId">{{ province.province }}</option>
                         </select>
     
                         <div title="删除职位" v-if="v!=0" v-on:click="removePoList(v)" style="position: absolute;top: 50%;margin-top: -14px;left:810px;cursor: pointer;"><Icon  style="color: #FF6666;font-size:25px" type="android-remove-circle"></Icon></div>
                     </div>

                </div>

            
                <div class="view_btn" style="margin-top: 20px">
                     <span class="btn-blue-s" v-on:click="submitPeople">提交</span>
                     <span class="btn-yellow-s" v-on:click="closePop">取消</span>
                </div>
           </div>



           <oa-alert ref="childAlert"></oa-alert>

           <oa-page ref="childPage"></oa-page>

    </div>



</template>
<style>
.peoMen {
  font-size: 20px;
  font-weight: 700;
  text-align: center;  
}
.peoMenEdit {
  font-size: 14px;
  margin-top: 15px 
}
.peoMenEdit .deptChoose {
  width: 170px;
}
.peoMenEdit .prompt {
  display: inline-block;
  width: 90px;
  text-align: right;
}
.peoMenEdit .textType {
  width: 170px;
  padding-left: 10px;
}

</style>

<script>
  import $ from 'jquery'
  import oaPage from '@/components/commonVue/Page'
  import oaAlert from '@/components/commonVue/Alert'
    export default {
        name: 'PositionManagement',
        components: {
          'oa-page': oaPage,
          'oa-alert': oaAlert
        },
        data () {
            return {
                deptType:'', //搜索部门
                peopleName: '', //搜索姓名
                userName: '', //姓名
                userId: '', //用户ID
                userPhone: '', //手机号
                account: '', //账号
                email: '', //邮箱
                loginPassword: '', //密码
                againPassword: '', //确认密码
                deptId: '', //部门
                userState: '', //用户状态
                pageNum: 1,
                pageSize: 10,
                isShowCover: false,  //是否显示遮盖层
                isShowDetail: false, //是否显示详情弹层
                path: this.OACommon["publicDef"]["qpath"],
                roleList: [], //角色
                positionIds:'',
                roleData: [], 
                deptChooseData: [],
                poList: [
                   {
                    "pointerModel": "", //职位
                    "areaList": [],  //区域
                    "provinceModel": "xw-qxz", //省份
                    "deptData": [],
                    "findArea": [],
                    "province": []
                  }                
                ],
                peopleData: []
            }
        },
        created: function(){
            this.getPeople();
            this.getDivision();
        },
        methods:{
           getPeople: function(pn,ps){ //获取人员数据
              if(pn){
                this.pageNum = pn;
              }
              if(ps){
                this.pageSize = ps;
              }
              $.ajax({
                  url: this.path + "findUserPageList",
                  type: 'get',  
                  dataType: 'json',
                  data: {
                     "jobNumber": localStorage.getItem("jobNumber"),
                     "sessionIdOa": localStorage.getItem("sessionIdOa"),
                     "deptId":this.deptType,
                     "userName": this.peopleName,
                     "pageNum": this.pageNum,
                     "pageSize": this.pageSize
                  },
                  success: function(data){ 
                   
                      if(data.code == 200){
                        this.peopleData = data["data"]["list"];
                        this.$refs.childPage.setArg(data["data"]["pages"],this.pageNum,this.pageSize,this.getPeople);
                      }else {
                        this.$refs.childAlert.show(data.msg);
                      }

                  }.bind(this),
                  error: function(err){
                    console.log("登录异常");
                  }
              }) 
            },
           getRole: function(){   //获取角色数据
              $.ajax({
                  url: this.path + "findAllRoleList",
                  type: 'get',  
                  dataType: 'json',
                  data: {
                     "jobNumber": localStorage.getItem("jobNumber"),
                     "sessionIdOa": localStorage.getItem("sessionIdOa"),
                     "roleDescription": this.roleName
                  },
                  success: function(data){ 

                    if(data.code == 200){
                      this.roleData = data["data"];
                    }else {
                      this.$refs.childAlert.show(data.msg);
                    }


                      
                  }.bind(this),
                  error: function(err){
                    console.log("登录异常");
                  }
              }) 
           },
           getDivision: function(newNub){ //获取部门数据
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
                    }else {
                      this.$refs.childAlert.show(data.msg);
                    }

                  }.bind(this),
                  error: function(err){
                    console.log("登录异常");
                  }
              }) 
            },
           getPosition: function(){ //获取职位数据 
              // this.poList = [
              //   {
              //    "pointerModel": "", //职位
              //    "areaList": [],  //区域
              //    "provinceModel": "xw-qxz", //省份
              //    "deptData": [],
              //    "findArea": [],
              //    "province": []
              //   }
              // ]; 
              this.getArea();            
              $.ajax({
                  url: this.path + "findPositionListByDeptId",
                  type: 'get',  
                  dataType: 'json',
                  data: {
                     "jobNumber": localStorage.getItem("jobNumber"),
                     "sessionIdOa": localStorage.getItem("sessionIdOa"),
                     "deptId": this.deptId
                  },
                  success: function(data){ 

                      if(data.code == 200){
                        for(var i=0;i<this.poList.length;i++){
                           this.poList[i].deptData = data["data"];
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
           getArea: function(){ //获取区域数据
              $.ajax({
                  url: this.path + "findAreaByCondition",
                  type: 'get',  
                  dataType: 'json',
                  data: {
                     "jobNumber": localStorage.getItem("jobNumber"),
                     "sessionIdOa": localStorage.getItem("sessionIdOa")
                  },
                  success: function(data){ 
                    if(data.code == 200){
                        for(var i=0;i<this.poList.length;i++){
                          this.poList[i].findArea = data["data"];
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
           areaChange: function(v){ //获取省份数据

               for(var i=0;i<this.poList.length;i++){
                  this.poList[i].areaList = this.poList[v].areaList;
               }

               if(this.poList[v].areaList.length == 1){
                    var areaId = (this.poList[v].areaList).toString();
                    this.poList[v].province = this.OACommon.findProvinceList(areaId);
                    this.poList[v].province.splice(0,1);
               }else{
                    this.poList[v].province = '';
               }
            },
           addPeople: function(){
              this.listName = '新增员工';
              this.userName = ''; //姓名
              this.userId = ''; //用户ID
              this.userPhone = ''; //手机号
              this.account = ''; //账号
              this.email = ''; //邮箱
              this.loginPassword = ''; //密码
              this.againPassword = ''; //确认密码
              this.deptId = ''; //部门
              this.userState = ''; //用户状态
              this.roleList = []; //角色
              this.positionIds = '';
              this.roleData = [];
              this.deptChooseData = [];
              this.poList = [
                 {
                  "pointerModel": "", //职位
                  "areaList": [],  //区域
                  "provinceModel": "xw-qxz", //省份
                  "deptData": [],
                  "findArea": [],
                  "province": []
                }
              ];
              this.isShowCover = true;
              this.isShowDetail = true;
              this.getRole();
              this.getDivision();
              this.getArea();
           },
           addPoList: function(){             
              this.poList.push(
                {
                  "pointerModel": this.poList[0]["pointerModel"], //职位
                  "areaList": this.poList[0]["areaList"],  //区域
                  "provinceModel": 'xw-qxz', //省份
                  "deptData": this.poList[0]["deptData"],
                  "findArea": this.poList[0]["findArea"],
                  "province": this.poList[0]["province"]
                })
              
              this.getArea();
           },
           removePoList: function(v){
              this.poList.splice(v,1);
           },
           changgePeople: function(people){
              this.listName = '修改员工';
              this.userId = people.userId;
              $.ajax({
                  url: this.path + "findUserByUserId",
                  type: 'get',  
                  dataType: 'json',
                  data: {
                     "jobNumber": localStorage.getItem("jobNumber"),
                     "sessionIdOa": localStorage.getItem("sessionIdOa"),
                     "userId": this.userId
                  },
                  success: function(data){ 

                    if(data.code == 200){
                      var changePeople = data.data;
                      this.account = changePeople.jobNumber; //账号
                      this.userName = changePeople.userName; //姓名
                      this.userPhone = changePeople.userPhone; //手机号
                      var roleList = changePeople.roleListByEdit;
                      this.roleData = roleList;
                      var role = [];
                      for(var i = 0;i< roleList.length;i++){
                          if(roleList[i].selected == true){
                              role.push(roleList[i].roleId)
                          } 
                      }
                      this.roleList = role; //角色
                      this.email = changePeople.userEmail; //邮箱
                      this.userState = changePeople.userState; //用户状态
                      this.loginPassword = changePeople.userPassword; //密码
                      this.againPassword = changePeople.userPassword;
                      this.deptId = changePeople.deptId; // 所在部门


                      var userPositon = changePeople.userPositonProvinceVoList;

                      this.poList = [];


                      for(var i=0;i<userPositon.length;i++){

                        //区域
                        var areaList = userPositon[i].areaList;
                        var are = [];
                        if(areaList){
                          for(var j = 0;j< areaList.length;j++){
                            if(areaList[j].selected == true){
                                are.push(areaList[j].areaId)
                            } 
                          }
                        }
                        
                        //职位
                        var posList = userPositon[i].positionList;
                        var pos = '';
                        if(posList){
                            for(var j = 0;j< posList.length;j++){
                              if(posList[j].selected == true){
                                  pos = posList[j].positionId;
                              } 
                            }
                        }
                        
                        //省份
                        var proList = userPositon[i].provinceList;
                        var pro = '';                      
                        if(proList){
                          for(var j = 0;j< proList.length;j++){
                              if(proList[j].selected == true){
                                  pro = proList[j].provinceId;
                              } 
                          }
                        }
                        
                        this.poList.push({
                              "pointerModel": pos, //职位
                              "areaList": are,  //区域
                              "provinceModel": pro, //省份
                              "deptData": posList,
                              "findArea": areaList,
                              "province": proList
                        })
                        
                      };
                    }else {
                      this.$refs.childAlert.show(data.msg);
                    }     

                  }.bind(this),
                  error: function(err){
                    console.log("登录异常");
                  }
              })

              this.isShowCover = true;
              this.isShowDetail = true;
              
           },
           closePop: function(){
              this.isShowCover = false;
              this.isShowDetail = false;
            },
            submitPeople: function(){

              if(!this.account){
                     this.$refs.childAlert.show("请输入账号");
                     return false;
              }
              if(!this.userName){
                     this.$refs.childAlert.show("请输入姓名");
                     return false;
              }
              if(!this.userPhone){
                     this.$refs.childAlert.show("请输入手机号");
                     return false;
              }
              if(this.userPhone.length != 11){
                     this.$refs.childAlert.show("请输入正确的手机号");
                     return false;
              }
              if(this.roleList == ''){
                     this.$refs.childAlert.show("请输入角色");
                     return false;
              }
              if(this.email){
                this.emailTest();                  
              }
              if(!this.userState){
                     this.$refs.childAlert.show("请选择用户状态");
                     return false;
              }
              if(!this.loginPassword){
                     this.$refs.childAlert.show("请输入密码");
                     return false;
              }
              if(!this.againPassword){
                     this.$refs.childAlert.show("请再次输入密码");
                     return false;
              }
              if(this.loginPassword != this.againPassword){
                     this.$refs.childAlert.show("两次密码不一致");
                     return false;
              }
              if(!this.deptId){
                     this.$refs.childAlert.show("请选择部门");
                     return false;
              }

              if(!this.poList[0].pointerModel){
                     this.$refs.childAlert.show("请选择职位");
                     return false;
              }
                          

              var str = '';
              var poList = this.poList, l = poList.length;

              for(var i = 0; i < l;i++){
                
                 if(!poList[i].areaList || poList[i].areaList.length == 0){
                     str +=poList[i].pointerModel;
                 }else{
                     str +=poList[i].pointerModel+'@';

                 }
                  var areaL = poList[i].areaList.length;

                    for(var j = 0; j < areaL;j++){
                    if(!poList[i].provinceModel || poList[i].provinceModel.length == 0){
                      if(areaL == 1) {
                         
                         str +=poList[i].areaList[j];
                       }else{
                            if(j == (areaL-1)){
                               str +=poList[i].areaList[j];
                            }else{
                            str +=poList[i].areaList[j]+',';
                            }
                       }
                    }else{

                      if(areaL == 1) {
                         str +=poList[i].areaList[j]+'@';
                       }else{
                            if(j == (areaL-1)){
                               str +=poList[i].areaList[j]+'@';
                            }else{
                            str +=poList[i].areaList[j]+',';
                            }
                       }                      
                    }
                    
                 }
                 if(poList[i].provinceModel == "xw-qxz"){

                 }else {
                    str +=poList[i].provinceModel;
                 }
                 if(i != (l-1)){
                   str += '&';
                 }
                 
              }

              this.positionIds = str;
              
                       
              $.ajax({
                  url: this.path + "insertOrUpdateUser",
                  type: 'post',  
                  dataType: 'json',
                  data: {
                     "jobNumber": localStorage.getItem("jobNumber"),
                     "sessionIdOa": localStorage.getItem("sessionIdOa"),
                     "userId": this.userId,
                     "userJobNumber": this.account,
                     "userPassword": this.loginPassword,
                     "deptId": this.deptId,
                     "positionIds": this.positionIds,
                     "userName": this.userName,
                     "roleIds": this.roleList.toString(),
                     "userPhone": this.userPhone,
                     "userEmail": this.email,
                     "userState": this.userState
                  },
                  success: function(data){
                    if(data.code == 200){
                      
                      this.isShowCover = false;
                      this.isShowDetail = false;
                      if(!this.userId){
                        this.$refs.childAlert.show("新增成功");
                      }else {
                        this.$refs.childAlert.show("修改成功");
                      }
                      this.getPeople();
                    }else {
                        this.$refs.childAlert.show(data.msg);
                    }
                           
                    
                  }.bind(this),
                  error: function(err){
                    console.log("登录异常");
                  }
              }) 
            },
            findIsAlready: function(pointerModel){
              for(var i=0;i<this.poList.length;i++){
                  this.poList[i].pointerModel = pointerModel;
              }
              $.ajax({
                  url: this.path + "findPositioinIsAlreadyByPositionId",
                  type: 'post',  
                  dataType: 'json',
                  data: {
                     "jobNumber": localStorage.getItem("jobNumber"),
                     "sessionIdOa": localStorage.getItem("sessionIdOa"),
                     "deptId": this.deptId,
                     "positionId": pointerModel
                  },
                  success: function(data){ 
                    if(data.code == 200){
                        
                    }else{
                      this.$refs.childAlert.show(data.msg);
                      for(var i=0;i<this.poList.length;i++){
                          this.poList[i].pointerModel = "";
                      }
                      return false;
                    }
                      
                  }.bind(this),
                  error: function(err){
                    console.log("登录异常");
                  }
              }) 
            },
            provinceChange: function(v){

              for(var i=0;i<this.poList.length;i++){
                  if(this.poList[i].provinceModel==""){
                    if(this.poList[0].pointerModel==6 || this.poList[0].pointerModel==10){
                      this.$refs.childAlert.show("该职位不能选择全部省份");
                      this.poList[i].provinceModel = "xw-qxz";
                      return false;
                    }
                  }
              }
            
              if(!this.poList[v].provinceModel){

              }else {
                for(var i=0;i<this.poList.length;i++){
                    if(v!=i){
                      if(this.poList[v].provinceModel==this.poList[i].provinceModel){
                          this.$refs.childAlert.show("省份不能重复");
                          this.poList[v].provinceModel = "xw-qxz";
                          return false;
                      }
                    }
                }

                $.ajax({
                    url: this.path + "findProvinceIsAlreadyUser",
                    type: 'post',  
                    dataType: 'json',
                    data: {
                       "jobNumber": localStorage.getItem("jobNumber"),
                       "sessionIdOa": localStorage.getItem("sessionIdOa"),
                       "provinceId": this.poList[v].provinceModel
                    },
                    success: function(data){ 
                      if(data.code == 200){
                          
                      }else{
                        this.$refs.childAlert.show(data.msg);
                        this.poList[v].provinceModel = "xw-qxz";
                        return false;
                      }
                        
                    }.bind(this),
                    error: function(err){
                      console.log("登录异常");
                    }
                }) 

              }

            },
            inputKey: function(){ //输入框手机号校验
              if(isNaN(this.userPhone)){
                  this.userPhone = '';
              }            
            },
            emailTest: function(){
            //对电子邮件的验证
            var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            if(!myreg.test(this.email)){
              this.$refs.childAlert.show("请输入正确的邮箱");
                 myreg.focus();
                 return false;
            }





            }


        }
        
    }
</script>