<template>
    <div>
          <Tree :data="data3" :render="renderContent" style="width: 400px"  multiple></Tree>        
          <div class="bgpop" v-if="isShowCover"></div>  
          <div class="view_area lookDiv" style="width:550px;height: 440px;padding: 5px 20px" v-if="isShowDetail">
               <div class="menContent" >{{ detailData.permissionName }}功能的编辑</div>
               <div class="menEdit"><span><Icon style="color: #FF6666" type="android-star" ></Icon>功能名称：</span><input class="textType" type="text" v-model="detailData.permissionName" /></div>
               <div class="menEdit"><span><Icon style="color: #FFFFFF" type="android-star" ></Icon>链接地址：</span><input class="textType" type="text" v-model="detailData.permissionUrl" /></div>
               <div class="menEdit"><span><Icon style="color: #FFFFFF" type="android-star" ></Icon>权限信息：</span><input class="textType" type="text" v-model="detailData.permissionCode" /></div>
               <div class="menEdit"><span><Icon style="color: #FFFFFF" type="android-star" ></Icon>功能图标：</span><input class="textType" type="text" v-model="detailData.permissionIconUrl" /></div>
               <div class="menEdit">
                     <span><Icon style="color: #FF6666" type="android-star" ></Icon>功能状态：</span>
                     <input class="radioType" type="radio" name="state" value="1" v-model="detailData.permissionState" style="width: 13px;height: 13px;margin-left: 5px;"/>启用
                     <input class="radioType" type="radio" name="state" value="-1" v-model="detailData.permissionState" style="width: 13px;height: 13px;margin-left: 5px;"/>禁用
               </div>
               <div class="menEdit" style="font-size: 14px;margin-top: 15px">
                     <span><Icon style="color: #FF6666" type="android-star" ></Icon>功能类型：</span>
                     <input class="radioType" type="radio" name="type" value="3" v-model="detailData.permissionType" />功能
                     <input class="radioType" type="radio" name="type" value="2" v-model="detailData.permissionType" />菜单
                     <input class="radioType" type="radio" name="type" value="1" v-model="detailData.permissionType" />包
               </div>
               <div class="menEdit"><span><Icon style="color: #FF6666" type="android-star" ></Icon>排列序号：</span><input class="textType" type="text" v-model="detailData.permissionSort" /></div>

               <div class="view_btn" style="margin-top: 20px">
                    <span class="btn-blue-s" v-on:click="savePop">保存</span>
                    <span class="btn-yellow-s" v-on:click="closePop">取消</span>
               </div>
  
          </div>

          <oa-alert ref="childAlert"></oa-alert>
          <oa-confirm ref="childConfirm"></oa-confirm>
          
    </div>

</template>
<style>
.menContent {
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  margin-top: 10px  
}
.menEdit {
  font-size: 14px;
  margin-top: 15px 
}
.menEdit .radioType {
  width: 13px;
  height: 13px;
  margin-left: 5px;
}
.menEdit .textType {
  width: 400px;
  padding-left: 5px
}

</style>

<script>
  import $ from 'jquery'
  import oaAlert from '@/components/commonVue/Alert'
  import oaConfirm from '@/components/commonVue/Confirm'
  import 'iview/dist/styles/iview.css'
    export default {
        name: 'MenuOuthorty',
        components: {
          'oa-alert': oaAlert,
          'oa-confirm': oaConfirm
        },
        data () {
            return {
                shCheck: true,
                root:'',
                node:'',
                rdata:'',
                groundFatherId: '',
                isShowCover: false,  //是否显示遮盖层
                isShowDetail: false, //是否显示详情弹层
                path: this.OACommon["publicDef"]["qpath"],
                pids: '',
                detailData:{
                  permissionId: '',
                  parentId: '',
                  permissionName: '',
                  permissionUrl: '',
                  permissionCode: '',
                  permissionIconUrl: '',
                  permissionState: '',
                  permissionType: '',
                  permissionSort: ''
                },
                data3:[
                    {
                        title: 'ROOT',
                        expand: true,
                        selected: true,
                        children: []
                    }
                ]
            }
        },
        created: function(){
            this.getTreeData();
        },
        methods: {
            getTreeData: function(){
              $.ajax({
                  url: this.path + "findAllPermission",
                  type: 'get',  
                  dataType: 'json',
                  data: {
                     "jobNumber": localStorage.getItem("jobNumber"),
                     "sessionIdOa": localStorage.getItem("sessionIdOa")
                  },
                  success: function(tdata){ 
                    if(tdata.code == 200){
                      this.data3[0].children = tdata["data"];
                    }else {
                      this.$refs.childAlert.show(data.msg);
                    }
                    
                  }.bind(this),
                  error: function(err){ 
                    console.log("登录异常");
                  }
              }) 
            },
            renderContent (h, { root, node, data }) {
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                }, [
                    h('span', [
                        h('Icon', {
                            props: {
                                type: 'android-folder-open'
                            },
                            style: {
                                marginRight: '8px'
                            }
                        }),
                        h('span', data.title)
                    ]),
                    h('span', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '40px'
                        }
                    }, [
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                icon: 'android-add'
                            }),
                            style: {
                                display: data.permissionType==3?'none':'inline-block',
                                padding: '4px 10px',
                                marginRight: '8px',
                                backgroundColor:"#00a1e9"
                            },
                            on: {
                                click: () => { this.append(data) }
                            }
                        }),
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {                   
                                icon: 'android-create'
                            }),
                             style: {
                                padding: '4px 10px',
                                marginRight: '8px',
                                backgroundColor:"#FC9037"
                            },
                            on: {
                                click: () => { this.edit(data) }
                            }
                        }),
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                icon: 'android-close'
                            }),
                            style: {
                                padding: '4px 10px',
                                marginRight: '8px',
                                backgroundColor:"#FF6666"
                            },
                            on: {
                                click: () => { this.remove(root, node, data) }
                            }
                        })
                    ])
                ]);
            },
            append (data) {
                const children = data.children || [];
                this.groundFatherId = data.parentId;
                children.push({
                    title: '新建文件夹',
                    parentId:data.permissionId,
                    expand: true
                });
                this.$set(data, 'children', children);
            },
            remove (root, node, data) {
                var texTname = data.title;
                this.root = root;
                this.node = node;
                this.rdata = data;
                this.detailData.permissionId = data.permissionId;

                this.$refs.childConfirm.show("你确定删除"+ texTname+"吗？",this.removeOR);
            },
            removeOR () {  
                if( this.detailData.permissionId == '' || typeof(this.detailData.permissionId) == 'undefined'){
                     const parentKey = this.root.find(el => el === this.node).parent;
                     const parent = this.root.find(el => el.nodeKey === parentKey).node;
                     const index = parent.children.indexOf(this.rdata);
                     parent.children.splice(index, 1);
                } else {
                        var delData = '';
                        delData = {
                                 "jobNumber": localStorage.getItem("jobNumber"),
                                 "sessionIdOa": localStorage.getItem("sessionIdOa"),
                                 "permissionId": this.detailData.permissionId
                        };
                        $.ajax({
                             url: this.path + "deletePermissionByPermissionId",
                             type: 'post',
                             dataType: 'json',
                             data: delData,
                             success: function(data){
                               if(data["code"] == 200){
                                 this.getTreeData();
                               }else{
                                 this.$refs.childAlert.show(data.msg);
                               }
                             }.bind(this),
                             error: function (err) {
                               console.log('系统异常');
                             }
                        }) 

                }
    
            },
            edit (data){
              this.detailData.permissionId = data.permissionId;
              this.detailData.parentId = data.parentId;             
              this.detailData.permissionName = data.title;
              this.detailData.permissionUrl = data.permissionUrl;
              this.detailData.permissionCode = data.permissionCode;
              this.detailData.permissionIconUrl = data.permissionIconUrl;
              this.detailData.permissionState = data.permissionState;
              this.detailData.permissionType = data.permissionType;
              this.detailData.permissionSort = data.permissionSort;
              this.pids = data.pids;

              this.isShowCover = true;
              this.isShowDetail = true;
            },
            canelPop: function(){
              this.shCheck = true;
              this.title = "";
            },
            closePop: function(){
              this.isShowCover = false;
              this.isShowDetail = false;
            },
            savePop: function(){
                if(!this.detailData.permissionName){
                     this.$refs.childAlert.show("请输入功能名称");
                     return false;
                 }
                 if(!this.detailData.permissionState){
                     this.$refs.childAlert.show("请选择功能状态");
                     return false;
                 }
                 if(!this.detailData.permissionType){
                     this.$refs.childAlert.show("请选择功能类型");
                     return false;
                 }
                 if(!this.detailData.permissionSort){
                     this.$refs.childAlert.show("请输入排列序号");
                     return false;
                 }
                 
                 var subData = '';
                 if(this.detailData.permissionId){  //修改
                     if(this.detailData.parentId == ''){
                        this.detailData.parentId = 0;
                     }
                     subData = {
                         "jobNumber": localStorage.getItem("jobNumber"),
                         "sessionIdOa": localStorage.getItem("sessionIdOa"),
                         "permissionId": this.detailData.permissionId,
                         "permissionName": this.detailData.permissionName,
                         "parentId": this.detailData.parentId,
                         "permissionCode": this.detailData.permissionCode,
                         "permissionType": this.detailData.permissionType,
                         "permissionUrl": this.detailData.permissionUrl,
                         "permissionState": this.detailData.permissionState,
                         "permissionSort": this.detailData.permissionSort,
                         "permissionIconUrl": this.detailData.permissionIconUrl,
                         "title": this.detailData.permissionName,
                         "pids": this.pids
                     };
                 }else{  
                       var permissionCode = this.detailData.permissionCode;
                       if(typeof(permissionCode) == 'undefined' || permissionCode == ''){
                           permissionCode = 'permissionCode'
                       }
                       if(this.groundFatherId == 0){
                          this.pids = [this.detailData.parentId].toString();
                       }else{
                          this.pids = [this.groundFatherId,this.detailData.parentId].toString();
                       }
                       if(this.detailData.parentId == ''){
                         this.detailData.parentId = 0;
                       }
                       if(typeof(this.detailData.parentId) == 'undefined'){
                         this.pids = '';
                       }
                       subData = {
                         "jobNumber": localStorage.getItem("jobNumber"),
                         "sessionIdOa": localStorage.getItem("sessionIdOa"),
                         "permissionName": this.detailData.permissionName,
                         "parentId": this.detailData.parentId,
                         "permissionCode": permissionCode,
                         "permissionType": this.detailData.permissionType,
                         "permissionUrl": this.detailData.permissionUrl,
                         "permissionState": this.detailData.permissionState,
                         "permissionSort": this.detailData.permissionSort,
                         "permissionIconUrl": this.detailData.permissionIconUrl,
                         "title": this.detailData.permissionName,
                         "pids": this.pids
                      };
                     
                 }
                 
                 $.ajax({
                     url: this.path + "saveOrUpdatePermission",
                     type: 'post',
                     dataType: 'json',
                     data: subData,
                     success: function(data){
                       if(data["code"] == 200){
                         this.isShowCover = false;
                         this.isShowDetail = false;
                         if(this.detailData.permissionId){
                            this.$refs.childAlert.show("修改成功");
                         }else {
                            this.$refs.childAlert.show("新增成功");
                         }
                         this.getTreeData();
                       }else{
                         this.$refs.childAlert.show(data.msg);
                       }
                     }.bind(this),
                     error: function (err) {
                       console.log('获取列表内容异常');
                     }
                 })        
            }

        }
    }
</script>