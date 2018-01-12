<template>
  <div class="hello">
      <div class="gonggao_bread">
        <a href="#/mainIndex/index" class="fa">首页</a>
        &gt;
        <span>行政管理</span>
        &gt;
        <span>资产添加</span>
      </div>
      <div class="gonggao_body">
        <div class="fbtong_div new_eve_mk">
          <div class="form_eve">
            <label class="label_tit-1">资产名称：</label>
            <input type="text" class="form_input-2" placeholder="最多输入15个字" v-model="assetsName" maxlength="15" />
          </div>
          <div class="form_eve">
            <label class="label_tit-1">资产种类：</label>
            <select class="form_input-2" v-model="assetsTypeId">
              <option v-for="t in assetsTypeArr" v-bind:value="t.assetTypeId">{{ t.assetTypeName }}</option>
            </select>
          </div>
          <div class="form_eve">
            <label class="label_tit-1">资产型号：</label>
            <input type="text" class="form_input-2" placeholder="请输入资产型号" v-model="assetModel"/>
          </div>
          <div class="form_eve">
            <label class="label_tit-1">资产单价：</label>
            <input type="text" class="form_input-2" placeholder="最多输入两位小数" v-model="assetOnePrice" v-on:blur="priceBlur"/>
          </div>
          <div class="form_eve">
            <label class="label_tit-1">资产数量：</label>
            <input type="text" class="form_input-2" placeholder="请输入整数" v-model="assetNumber" v-on:blur="numBlur"/>
          </div>
          <div class="form_eve" style="overflow:visible;">
            <label class="label_tit-1">使用部门：</label>
            <div class="form_input-2 asset_tsdiv" v-on:mouseenter="showDepart" v-on:mouseleave="hideDepart">
                <span class="asset_bm" v-if="assetDeptModel.length==0">--请选择--</span>
                <span class="asset_bm" style="position:relative;top:3px;margin-left:10px;color:#333;" v-if="assetDeptModel.length>0">{{ assetDeptModel.join(",") }}</span>
                <ul class="person_ul edu" style="width:100%;top:27px;height:240px;overflow-y:auto;" v-if="isShowDepart">
                  <li v-for="(d, di) in assetDeptArr">
                    <input type="checkbox" v-bind:id="'edu'+di" v-bind:value="d.deptName" style="margin-left:20px;" v-model="assetDeptModel"/>
                    <label v-bind:for="'edu'+di" style="width:60%;">{{ d.deptName }}</label>
                  </li>
              </ul>
            </div>
          </div>
          <div class="form_eve">
            <label class="label_tit-1">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</label>
            <textarea class="form_input-3" style="height:100px;" maxlength="200" placeholder="最多输入200个字" v-model="remark"></textarea>
          </div>
        </div>
        <div style="width:100%;text-align:center;color:red;height:20px;">{{ errTip }}</div>
        <div style="padding-bottom:30px;margin-left: 10%">
          <span class="btn-blue" v-on:click="subAssets">提交</span>
        </div>
      </div>

      <oa-alert ref="childAlert"></oa-alert>
  </div>
</template>

<script>
import $ from 'jquery'
import oaAlert from '@/components/commonVue/Alert'

export default {
  name: 'ExtraApply',
  components: {
      'oa-alert': oaAlert
  },
  data () {
    return {
      path: this.OACommon["publicDef"]["qpath"],
      assetsName: '',
      assetsTypeArr: [],
      assetsTypeId: 0,
      assetModel: '',
      assetOnePrice: 0,
      assetNumber: 0,
      assetId: 0,
      assetDeptArr: [],     //部门model值
      assetDeptModel: [],   
      assetDeptString: '',  //部门id用,隔开
      remark: '',
      isShowDepart: false,
      subPause: true,
      errTip: ''
    }
  },
  created: function () {
    this.assetId = this.OACommon.getUrlPara("id");   //如果能获取到id值就是修改重提
    this.assetId = this.assetId?this.assetId:0;
    if(this.assetId){
      this.getOldData();
    }
    this.getAssetsType();
    this.getDepart();     //获取部门
  },
  methods: {
    getOldData: function(){
      $.ajax({
        url: this.path + "Asset/findAssetById",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "assetId": this.assetId
        },
        success: function(data){
          data = data["data"];
          this.assetsName = data["assetName"];
          this.assetsTypeId = data["assetTypeId"];
          this.assetModel = data["assetModel"];
          this.assetOnePrice = data["assetOnePrice"];
          this.assetNumber = data["assetNumber"];
          this.remark = data["remark"];

          var deptList = data["deptList"], l = deptList.length;
          for(var i=0;i<l;i++){
            this.assetDeptModel.push(deptList[i]["dept_name"]);
          }
        }.bind(this),
        error: function(){
          console.log("获取详情信息异常");
        }
      });
    },
    subAssets: function(){
      if(!this.assetsName){
        this.errTip = "请输入资产名称";
        return false;
      }
      if(!this.assetsTypeId){
        this.errTip = "请选择资产种类";
        return false;
      }
      if(!this.assetModel){
        this.errTip = "请输入资产型号";
        return false;
      }
      if(!this.assetOnePrice){
        this.errTip = "请输入资产单价";
        return false;
      }
      if(!this.assetNumber){
        this.errTip = "请输入资产数量";
        return false;
      }
      if(this.assetDeptModel.length==0){
        this.errTip = "请选择使用部门";
        return false;
      }
      /*if(!this.remark){
        this.errTip = "请输入备注";
        return false;
      }*/
      this.errTip = "";

      //部门id集合
      //assetDeptArr: [],     //部门model值
      //assetDeptModel: [],  assetDeptString
      this.assetDeptString = '';
      for(var i=0;i<this.assetDeptArr.length;i++){
        for(var j=0;j<this.assetDeptModel.length;j++){
          if(this.assetDeptArr[i]["deptName"] == this.assetDeptModel[j]){
            this.assetDeptString += this.assetDeptArr[i]["deptId"] + ",";
            break;
          }
        }
      }
      this.assetDeptString = this.assetDeptString.slice(0, -1);
      
      //防止冲突提交
      if(!this.subPause){
        return false;
      }
      this.subPause = false;

      $.ajax({
        url: this.path + "Asset/insertOrUpdateAsset",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "assetName": this.assetsName,
          "assetTypeId": this.assetsTypeId,
          "assetModel": this.assetModel,
          "assetOnePrice": this.assetOnePrice,
          "assetNumber": this.assetNumber,
          "remark": this.remark,
          "assetDeptString": this.assetDeptString,
          "assetId": this.assetId
        },
        success: function(data){
          this.subPause = true;
          if(data["code"] == 200){
            this.$refs.childAlert.show("提交成功", function(){
              this.$router.push('/mainIndex/assets/assetsList');
            });
          }else{
            this.$refs.childAlert.show(data["msg"]);
          }
        }.bind(this),
        error: function(){
          this.subPause = true;
          console.log("新增资产异常");
        }
      });
    },
    hideDepart: function(){
      this.isShowDepart = false;
    },
    showDepart: function(){
      this.isShowDepart = true;
    },
    getDepart: function(){
      $.ajax({
        url: this.path + "findDeptList",
        type: "get",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "deptName": ""
        },
        success: function(data){
          this.assetDeptArr = data["data"];
        }.bind(this),
        error: function(){
          console.log("获取部门列表异常");
        }
      });
    },
    numBlur: function(){
      var num = this.assetNumber;
      if(isNaN(num) || Number(num)%1!=0 || Number(num)<=0 || num.indexOf(".")!=-1){
        this.assetNumber = 0;
      }
    },
    priceBlur: function(){
      var reg = /(^[0-9]*$)|(^[0-9]*[\.]{1}[0-9]{1,2}$)/;
      var edvalNum = 0;
      if(!reg.test(this.assetOnePrice)){
        if(!isNaN(this.assetOnePrice) && this.assetOnePrice.indexOf(".")!=-1 && this.assetOnePrice.split(".")[1].length>2){
          edvalNum = this.assetOnePrice.split(".")[0] + "." + t.c9.edval.split(".")[1].substring(0, 2);
          this.assetOnePrice = Number(edvalNum).toFixed(2);
        }else{
          this.assetOnePrice = "0.00";
        }
      }else{
        if(this.assetOnePrice){
          this.assetOnePrice = Number(this.assetOnePrice).toFixed(2);
        }else{
          this.assetOnePrice = "0.00";
        }
      }
    },
    getAssetsType: function(){
      var typeData = [{"assetTypeId": 0, "assetTypeName": "--请选择--"}];
      $.ajax({
        url: this.path +　"Asset/findAssetTypeList",
        type: "post",
        dataType: "json",
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa")
        },
        success: function(data){
          this.assetsTypeArr = typeData.concat(data["data"]);
        }.bind(this),
        error: function(){
          console.log("获取资产种类异常");
        }
      });
    }
  }
}
</script>
<style>
  
</style>

