<template>
   
      <div class="PositionManagement">
          <div class="gonggao_bread">
            <a href="#/mainIndex/index" class="fa">首页</a>
            &gt;
            <span>权限管理</span>
            &gt;
            <span>省份管理</span>
          </div>
          <div class="search_div">
            <label>省份名称：</label>
            <input type="text" v-model="provinceName" class="s_time"/>
            <span class="btn-blue-s" v-on:click="getPosition(1,10)">查询</span>
            <span class="btn-yellow-s" style="margin-left:0;" v-on:click="addPositon">新增</span>
          </div>
          <div class="gonggao_body table_body">
            <div class="data_table_head">
              <ul>
                <li class="td10 xh">编号</li>
                <li class="td25 xh">省份</li>
                <li class="td35 xh">包含地区</li>
                <li class="td25 xh">操作</li>
              </ul>
            </div>
            <div v-if="deptData.length!=0" class="data_table_body" v-for="position in deptData">
              <ul>
                <li class="td10 xh">{{ position.provinceId }}</li>
                <li class="td25 xh">{{ position.province }}</li>
                <li class="td35 xh">
                    <span v-for="(k,n) in position.citiesVoList" v-if="n!=(position.citiesVoList.length-1)">{{ k.cityName }}、</span>
                    <span v-for="(k,n) in position.citiesVoList" v-if="n==(position.citiesVoList.length-1)">{{ k.cityName }}</span>
                </li>
                <li class="td25 xh">
                  <span class="changgeDept table_edit" v-on:click="changgePositon(position.provinceId)">修改</span>
                </li>
              </ul>
            </div>

            <div v-if="deptData.length==0" class="data_table_body" style="text-align: center;line-height: 100px;color: #FF6666">
                暂无省份
            </div>

          </div>


          <div class="bgpop" v-if="isShowCover"></div>
           <div class="view_area lookDiv" style="width: 580px;height: 220px;padding: 5px 20px" v-if="isShowDetail">
                <div class="posMen" >{{ listName }}</div>
                <div class="posMenEdit">
                     <span><Icon style="color: #FF6666" type="android-star" ></Icon>所属区域：</span>
                     <select v-if="provinceId==0" name="" class="deptChoose" v-model="areaId" v-on:change="areaChange">
                          <option  value="">请选择</option>
                          <option v-for="area in findArea"  v-bind:value="area.areaId">{{ area.areaName }}</option>
                     </select>
                     <span style="display: inline-block;width: 150px" v-if="provinceId!=0">{{ areaName }}</span>

                     <span style="margin-left: 20px"><Icon style="color: #FF6666" type="android-star" ></Icon>所属省份：</span>
                     <select name="" class="deptChoose" v-model="showProvinceId" v-on:change="provinceChange" >
                          <option  value="">请选择</option>
                          <option v-for="pro in province"  v-bind:value="pro.showProvinceId">{{ pro.provinceName }}</option>
                     </select>
              
                </div>

              
                <div class="posMenEdit">
                    <span><Icon style="color: #FF6666" type="android-star" ></Icon>省份名称：</span>
                    <input class="textType" v-model="provinceSubmitName" type="text" />

                    <span style="margin-left: 20px"><Icon style="color: #FF6666" type="android-star" ></Icon>所属城市：</span>
                     
                    <Select v-model="cityIds" class="deptChoose" multiple >
                        <Option v-for="city in cityChose" :value="city.cityId" :key="city.cityName">{{ city.cityName }}</Option>
                    </Select>

                </div>
               
                <div class="view_btn" style="margin-top: 20px">
                     <span class="btn-blue-s" v-on:click="submitDept">提交</span>
                     <span class="btn-yellow-s" v-on:click="closePop">取消</span>
                </div>
           </div>

           <oa-alert ref="childAlert"></oa-alert>
           <oa-page ref="childPage"></oa-page>
           <oa-confirm ref="childConfirm"></oa-confirm>

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
.posMenEdit .deptChoose {
  width: 150px;  
}
.posMenEdit .textType {
  width: 150px;
  padding-left: 10px;
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
                provinceName: '',
                provinceSubmitName: '',
                showProvinceId: '',
                listName: '',
                addPositionName: '',
                deptType: '',
                deptId: '',
                positionId: '',
                isDeptLeader: '0', //是否为领导
                pageNum: 1,
                pageSize: 10,
                confirm: 0,
                areaName: '',
                isShowCover: false,  //是否显示遮盖层
                isShowDetail: false, //是否显示详情弹层
                path: this.OACommon["publicDef"]["qpath"],
                deptData: [],
                areaId:'',
                provinceId:'',
                cityIds:[],
                findArea:[], //区域
                province:[], //省份
                deptChooseData: [],
                positionData: [],
                cityChose: []
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
                  url: this.path + "findProvincePageList",
                  type: 'post',  
                  dataType: 'json',
                  data: {
                     "jobNumber": localStorage.getItem("jobNumber"),
                     "sessionIdOa": localStorage.getItem("sessionIdOa"),
                     "provinceName": this.provinceName,
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
           addPositon: function(){
              this.listName = '新增省份';
              this.isShowCover = true;
              this.isShowDetail = true;
              this.provinceId = 0;
              this.areaId = '';
              this.showProvinceId = '';
              this.provinceSubmitName = '';
              this.cityIds = [];
              this.confirm = 0;
              this.getArea(); 
           },
           changgePositon: function(provinceId){
              this.listName = '修改省份';
              this.provinceId = provinceId;
              this.confirm = 0;
              this.isShowCover = true;
              this.isShowDetail = true;
              $.ajax({
                  url: this.path + "findProvinceById",
                  type: 'post',  
                  dataType: 'json',
                  data: {
                     "jobNumber": localStorage.getItem("jobNumber"),
                     "sessionIdOa": localStorage.getItem("sessionIdOa"),
                     "provinceId": this.provinceId
                  },
                  success: function(data){
                    if(data.code == 200){
                      this.areaName = data["data"].areaName;
                      this.areaId = data["data"].areaId;
                      this.province = data["data"].showProvinceVoList;
                      for(var i=0;i<this.province.length;i++){
                          if(this.province[i].selected == true){
                             this.showProvinceId = this.province[i].showProvinceId;
                          }
                      }
                      this.provinceSubmitName = data["data"].province;

                      this.cityChose = data["data"].citiesVoList;
                      this.cityIds = [];
                      for(var i=0;i<this.cityChose.length;i++){
                          if(this.cityChose[i].selected == true){
                             this.cityIds.push(this.cityChose[i].cityId)
                          }
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
           closePop: function(){
              this.isShowCover = false;
              this.isShowDetail = false;
           },
           submitDept: function(){
              if(this.provinceId == 0){
                if(!this.areaId){
                  this.$refs.childAlert.show("请选择所属区域");
                  return false;
                }
              }
              if(!this.showProvinceId){
                  this.$refs.childAlert.show("请选择所属省份");
                  return false;
              }
              if(!this.provinceSubmitName){
                  this.$refs.childAlert.show("请输入省份名称");
                  return false;
              }
              if(this.cityIds.length == 0){
                  this.$refs.childAlert.show("请选择所属城市");
                  return false;
              }
              $.ajax({
                  url: this.path + "insertOrUpdateProvinceAndCitys",
                  type: 'post',  
                  dataType: 'json',
                  data: {
                     "jobNumber": localStorage.getItem("jobNumber"),
                     "sessionIdOa": localStorage.getItem("sessionIdOa"),
                     "areaId": this.areaId,
                     "showProvinceId": this.showProvinceId,
                     "provinceName": this.provinceSubmitName,
                     "provinceId": this.provinceId,
                     "cityIds": this.cityIds.toString(),
                     "confirm": this.confirm
                  },
                  success: function(data){
                    if(data.code == 200){
                        this.isShowCover = false;
                        this.isShowDetail = false;
                        if(this.provinceId == 0){
                          this.$refs.childAlert.show("新增成功");
                        }else {
                          this.$refs.childAlert.show("修改成功");
                        }
                        this.getPosition();
                    }else if(data.code == 622){
                        this.$refs.childConfirm.show(data.msg,this.submitDeptAgain);
                    }else {
                        this.$refs.childAlert.show(data.msg);
                    }

                  }.bind(this),
                  error: function(err){
                    console.log("登录异常");
                  }
              }) 
           },
           submitDeptAgain: function(){
              this.confirm = 1;
              $.ajax({
                  url: this.path + "insertOrUpdateProvinceAndCitys",
                  type: 'post',  
                  dataType: 'json',
                  data: {
                     "jobNumber": localStorage.getItem("jobNumber"),
                     "sessionIdOa": localStorage.getItem("sessionIdOa"),
                     "areaId": this.areaId,
                     "showProvinceId": this.showProvinceId,
                     "provinceName": this.provinceSubmitName,
                     "provinceId": this.provinceId,
                     "cityIds": this.cityIds.toString(),
                     "confirm": this.confirm
                  },
                  success: function(data){
                    if(data.code == 200){
                        this.isShowCover = false;
                        this.isShowDetail = false;
                        if(this.provinceId == 0){
                          this.$refs.childAlert.show("新增成功");
                        }else {
                          this.$refs.childAlert.show("修改成功");
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
                        this.findArea = data["data"];
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
              if(!this.areaId){
                return false;
              }
              $.ajax({
                  url: this.path + "findShowProvinceListByAreaId",
                  type: 'post',  
                  dataType: 'json',
                  data: {
                     "jobNumber": localStorage.getItem("jobNumber"),
                     "sessionIdOa": localStorage.getItem("sessionIdOa"),
                     "areaId": this.areaId
                  },
                  success: function(data){ 
                    if(data.code == 200){
                        this.province = data["data"];
                      }else {
                         this.$refs.childAlert.show(data.msg);
                      }                
                      
                  }.bind(this),
                  error: function(err){
                    console.log("登录异常");
                  }
              })
           },
           provinceChange: function(){
              if(!this.showProvinceId){
                return false;
              }
              $.ajax({
                  url: this.path + "findCitysByShowProvinceIds",
                  type: 'post',  
                  dataType: 'json',
                  data: {
                     "jobNumber": localStorage.getItem("jobNumber"),
                     "sessionIdOa": localStorage.getItem("sessionIdOa"),
                     "showProvinceId": this.showProvinceId
                  },
                  success: function(data){ 
                    if(data.code == 200){
                        this.cityChose = data["data"];
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