<template>
  <div class="hello">
      <div class="gonggao_bread">
		<a href="/#/mainIndex/index" class="fa">首页</a>
		&gt;
		<span>客户管理</span>
		&gt;
		<span>学校查询</span>
	</div>
	<div class="search_div">
		<div class="yydo160">
			<label style="margin-left:10px;">开始时间：</label>
			<el-date-picker
		      v-model="pageVal.searchStartDate"
		      type="date"
		      format="yyyy-MM-dd"
      		  value-format="yyyy-MM-dd"
		      placeholder="选择日期">
		    </el-date-picker>

			<label style="margin-left:5px;">结束时间：</label>
			<el-date-picker
		      v-model="pageVal.searchEndDate"
		      type="date"
		      format="yyyy-MM-dd"
      		  value-format="yyyy-MM-dd"
		      placeholder="选择日期">
		    </el-date-picker>
			<label style="margin-left:5px;">区域：</label>
			<select v-model="pageVal.areaValue" v-on:change="pageAreaChange" style="width:160px;">
				<option v-for="a in pageAreaList" v-bind:value="a.areaId">{{ a.areaName }}</option>
			</select>
			<label class="mlgb10" style="width:50px;margin-left:5px;">省份：</label>
			<select v-model="pageVal.proviceValue" v-on:change="pageProviceChange" style="width:160px;">
				<option v-for="p in pageProviceList" v-bind:value="p.provinceId">{{ p.province }}</option>
			</select>
		</div>
		<div class="et">
			<label style="margin-left:10px;">市/区：</label>
			<select v-model="pageVal.cityValue" style="width:160px;">
				<option v-for="c in pageCityList" v-bind:value="c.cityId">{{ c.cityName }}</option>
			</select>
			<label style="margin-left:5px;">客户类型：</label>
			<select v-model="pageVal.customerTypeValue" style="width:160px;">
				<option v-for="t in pageCustomerType" v-bind:value="t.id">{{ t.typeName }}</option>
			</select>
			<label style="margin-left:5px;">客户等级：</label>
			<select v-model="pageVal.customerGroupValue" style="width:160px;">
				<option v-for="g in pageCustomerGroup" v-bind:value="g.id">{{ g.gradeName }}</option>
			</select>
			<span style="display:inline-block;width:215px;text-align:right;">
				<span class="btn-blue-s sear_btn" v-on:click="search2AllList">查询</span>
				<span class="btn-yellow-s sear_btn" v-on:click="addCustomer" style="margin-left:0;margin-right:0;">新增</span>
			</span>
		</div>
	</div>
	<div class="gonggao_body table_body">
		<div class="data_table_head">
			<ul>
				<li class="td13 xh">更新日期</li>
				<li class="td8">区域</li>
				<li class="td8">省份</li>
				<li class="td9">市/区</li>
				<li class="td14">学校</li>
				<li class="td9">客户类型</li>
				<li class="td9">客户等级</li>
				<li class="td7">花费</li>
				<li class="td8">联系人列表</li>
				<li class="td7">操作</li>
			</ul>
		</div>
		<div class="data_table_body">
			<ul v-for="l in cList" v-bind:id="'list-'+l.customerId" v-if="cList.length>=0">
				<li class="td13 xh">{{ l.updateDateString }}</li>
				<li class="td8">{{ l.areaName }}</li>
				<li class="td8">{{ l.province }}</li>
				<li class="td9">{{ l.cityName }}</li>
				<li class="td14">{{ l.customerName }}</li>
				<li class="td9">{{ l.typeName }}</li>
				<li class="td9">{{ l.gradeName }}</li>
				<li class="td7">
					<a v-bind:href="'/#/mainIndex/schoolExpenses?customerId='+l.customerId" class="table_pa">查看</a>
				</li>
				<li class="td8">
					<a href="javascript:void(0);" class="table_pa" v-on:click="go2CustomerLink(l.customerId)">查看</a>
				</li>
				<li class="td7">
					<a href="javascript:void(0);" class="table_pa" v-on:click="updateCustomer(l.customerId)">修改</a>
				</li>
			</ul>
			<ul v-if="cList.length==0">
				<li style="width:100%;text-align:center;color:red;">暂无数据</li>
			</ul>
		</div>
	</div>
	<oa-page ref="childPage"></oa-page>

  	<div class="bgpop" v-bind:class="{'check': shCheck}" v-on:click="canelPop"></div>
	<div class="view_area" v-bind:class="{'check': shCheck}" style="width: 600px;height:350px;padding: 5px 20px" >
		<span class="closexx" style="margin-right:10px;" v-on:click="canelPop"><Icon type="android-cancel"></Icon></span>
		<div style="font-size: 20px;font-weight: 700;text-align: center;margin-top: 10px">{{ title }}</div>
		<div class="view_school" style="margin-top: 10px">
			<label style="display: inline-block;width: 70px;text-align: right">客户类型：</label>
			<select v-model="popVal.customerTypeValue">
				<option v-for="t in customerType" v-bind:value="t.id">{{ t.typeName }}</option>
			</select>
			<label style="display: inline-block;width: 70px;text-align: right;margin-left: 20px">选择区域：</label>
			<select v-model="popVal.areaValue" v-on:change="popAreaChange">
				<option v-for="a in areaList" v-bind:value="a.areaId">{{ a.areaName }}</option>
			</select>
		</div>
		<div class="view_school" style="margin-top: 10px">
			<label style="display: inline-block;width: 70px;text-align: right">省份：</label>
			<select v-model="popVal.proviceValue" v-on:change="popProviceChange">
				<option v-for="p in proviceList" v-bind:value="p.provinceId">{{ p.province }}</option>
			</select>
			<label style="display: inline-block;width: 70px;text-align: right;margin-left: 20px">市/区：</label>
			<select v-model="popVal.cityValue">
				<option v-for="c in cityList" v-bind:value="c.cityId">{{ c.cityName }}</option>
			</select>
		</div>
		<div class="view_school" style="margin-top:10px;">
			<label style="display: inline-block;width: 70px;text-align: right">客户等级：</label>
			<select v-model="popVal.customerGroupValue">
				<option v-for="g in customerGroup" v-bind:value="g.id">{{ g.gradeName }}</option>
			</select>
			<label style="display: inline-block;width: 70px;text-align: right;margin-left: 20px">学校名称：</label>
			<input type="text" class="s_time" v-model="popVal.schoolName" placeholder="最多输入16个字" maxlength="16"/>
		</div>
		<div class="view_school" style="margin-top:10px;font-size:12px;background:#EEE;">
			注：
			<br/>
			客户等级分为三种：分别是A级客户、B级客户和C级客户；
			<br/>
			A级客户：每年考取清北人数5人以上
			<br/>
			B级客户：每年考取清北人数1-5人
			<br/>
			C级客户：每年考取清北人数0人或偶尔有一人
		</div>
		<div style="height:23px;margin-top:8px;">
			<div style="text-align:center;color:red;" v-if="popTip">{{ popTipValue }}</div>
		</div>
		<div class="view_btn" style="margin-top:5px">
			<span class="btn-blue-s" v-on:click="subPopData">提交</span>
			<span class="btn-yellow-s" v-on:click="canelPop">取消</span>
		</div>
	</div>

	<oa-alert ref="childAlert"></oa-alert>
  </div>
</template>

<script>
import $ from 'jquery'
import oaPage from '@/components/commonVue/Page'
import oaAlert from '@/components/commonVue/Alert'

export default {
  name: 'CustomerList',
  components: {
      'oa-page': oaPage,
      'oa-alert': oaAlert
    },
  data () {
    return {
      msg: '',
      cList: [],
      shCheck: true,
      title: '',
      canSubPause: true,
      upOrAdd: 0, //0添加  1修改
      path: this.OACommon["publicDef"]["qpath"],
      customerType: [],
      pageCustomerType: [],
      customerGroup: [],
      pageCustomerGroup: [],
      areaList: [],
      pageAreaList: [],
      proviceList: [{"areaId": "", "province": "--请选择--", "provinceCode": "", "provinceId": 0}],
      pageProviceList: [{"areaId": "", "province": "--请选择--", "provinceCode": "", "provinceId": 0}],
      cityList: [{"cityCode": "", "cityId": 0, "cityName": "--请选择--", "provinceId": ""}],
      pageCityList: [{"cityCode": "", "cityId": 0, "cityName": "--请选择--", "provinceId": ""}],
      popTip: false,
      popTipValue: '',
      pageNum: 1,
      pageSize: 10,
      popVal: {   //弹框数值存储
      	customerTypeValue: 0,
      	areaValue: 0,
      	proviceValue: 0,
      	cityValue: 0,
      	customerGroupValue: '',
      	schoolName: '',
      	customerId: 0
      },
      pageVal: {   //页面数值存储
      	areaValue: 0,
      	proviceValue: 0,
      	cityValue: 0,
      	customerTypeValue: 0,
      	customerGroupValue: 0,
      	searchStartDate: '',
      	searchEndDate: ''
      }
    }
  },
  created: function () {
  	//初始化查询日期赋值
  	//this.pageVal.searchStartDate = this.OACommon.getOADate(new Date()).prevMonthToday;
  	//this.pageVal.searchEndDate = this.OACommon.getOADate(new Date()).todayDate;
  	this.pageAreaList = this.OACommon.findAreaByCondition();
  	//客户类型赋值
	this.pageCustomerType = this.OACommon.findCustomerTypeAll();
  	//客户等级赋值
  	this.pageCustomerGroup = this.OACommon.findCustomerGroupAll();
	this.getAllCustomer();
  },
  methods: {
  	search2AllList: function(){
  		var st = this.pageVal.searchStartDate, et = this.pageVal.searchEndDate;
  		st = st.split("-");
  		st = Number(st.join(""));
  		et = et.split("-");
  		et = Number(et.join(""));
  		if(et < st){
  			this.$refs.childAlert.show("开始时间不能大于结束时间");
  			return false;
  		}
  		this.getAllCustomer();
  	},
  	getAllCustomer: function(pn, ps){
  		//pn: 当前页数  ps：每页条数
	      if(pn && typeof(pn)!='object'){
	        this.pageNum = pn;
	      }
	      if(ps && typeof(ps)!='object'){
	        this.pageSize = ps;
	      }

  		$.ajax({
	  		url: this.path + "findAllCustomer",
		    type: 'post',
		    dataType: 'json',
		    data: {
		      "jobNumber": localStorage.getItem("jobNumber"),
		      "sessionIdOa": localStorage.getItem("sessionIdOa"),
		      "pageNum": this.pageNum,
		      "pageSize": this.pageSize,
		      "startDate": this.pageVal.searchStartDate,
		      "endtDate": this.pageVal.searchEndDate,
		      "areaId": this.pageVal.areaValue,
		      "provinceId": this.pageVal.proviceValue,
		      "citiesId": this.pageVal.cityValue,
		      "typeId": this.pageVal.customerTypeValue,
		      "gradeId": this.pageVal.customerGroupValue
		    },
		    success: function(data){
		      if(data["code"] == 200){
		      	this.cList = data["data"]["list"];

		      	this.$refs.childPage.setArg(data["data"]["pages"], this.pageNum, this.pageSize, this.getAllCustomer);
		      }else{
		      	console.log("服务器异常，请稍后重试");
		      }
		    }.bind(this),
		    error: function (err) {
		      console.log('获取列表内容异常')
		    }
		  })
  	},
  	addCustomer: function(){
  		this.upOrAdd = 0;
  		this.shCheck = false;
  		this.title = "新增学校";

  		//弹框数据清空
  		for(const t in this.popVal){
  			if(t == 'schoolName'){
  				this.popVal[t] = '';
  			}else{
  				this.popVal[t] = 0;
  			}
  		}
  		this.customerType = [];
  		this.areaList = [];
  		this.proviceList = [{"areaId": "", "province": "--请选择--", "provinceCode": "", "provinceId": 0}];
      	this.cityList = [{"cityCode": "", "cityId": 0, "cityName": "--请选择--", "provinceId": ""}];
      	this.customerGroup = [];

  		//客户类型赋值
  		this.customerType = this.OACommon.findCustomerTypeAll();
	  	//客户等级赋值
	  	this.customerGroup = this.OACommon.findCustomerGroupAll();
	  	//区域赋值
	  	this.areaList = this.OACommon.findAreaByCondition();
  	},
  	updateCustomer: function(customerId){
  		this.upOrAdd = 1;
  		
  		this.shCheck = false;
  		this.title = "修改学校";

  		//弹框数据清空
  		for(const t in this.popVal){
  			if(t == 'schoolName'){
  				this.popVal[t] = '';
  			}else{
  				this.popVal[t] = 0;
  			}
  		}
  		this.popVal.customerId = customerId;
  		
  		this.customerType = [];
  		this.areaList = [];
  		this.proviceList = [{"areaId": "", "province": "--请选择--", "provinceCode": "", "provinceId": 0}];
      	this.cityList = [{"cityCode": "", "cityId": 0, "cityName": "--请选择--", "provinceId": ""}];
      	this.customerGroup = [];

  		//客户类型赋值
  		this.customerType = this.OACommon.findCustomerTypeAll();
	  	//区域赋值
	  	this.areaList = this.OACommon.findAreaByCondition();
	  	//客户等级赋值
	  	this.customerGroup = this.OACommon.findCustomerGroupAll();
	  	//查询单条数据，进行赋值
	  	$.ajax({
	  		url: this.path + "findCustomerDetail",
	  		type: "post",
	  		dataType: "json",
	  		data: {
	  			"jobNumber": localStorage.getItem("jobNumber"),
		        "sessionIdOa": localStorage.getItem("sessionIdOa"),
		        "customerId": customerId
	  		},
	  		success: function(data){
	  			data = data["data"];
	  			this.popVal.customerTypeValue = data["typeId"];
	  			this.popVal.areaValue = data["areaId"];
	  			//获取省份
			  	this.proviceList = this.OACommon.findProvinceList(data["areaId"]);
			  	this.popVal.proviceValue = data["provinceId"];
			  	//获取市区
			  	this.cityList = this.OACommon.findCitiesList(data["provinceId"]);
			  	this.popVal.cityValue = data["citiesId"];
			  	//客户等级赋值
	  			this.customerGroup = this.OACommon.findCustomerGroupAll();
	  			this.popVal.customerGroupValue = data["gradeId"];
	  			this.popVal.schoolName = data["customerName"];
	  		}.bind(this),
	  		error: function(){
	  			console.log("查询单条数据异常");
	  		}
	  	});
  	},
  	subPopData: function(){
  		if(!this.popVal.customerTypeValue){
  			this.popTip = true;
  			this.popTipValue = "请选择客户类型";
  			return false;
  		}
  		if(!this.popVal.areaValue){
  			this.popTip = true;
  			this.popTipValue = "请选择区域";
  			return false;
  		}
  		if(!this.popVal.proviceValue){
  			this.popTip = true;
  			this.popTipValue = "请选择省份";
  			return false;
  		}
  		if(!this.popVal.cityValue){
  			this.popTip = true;
  			this.popTipValue = "请选择市/区";
  			return false;
  		}
  		if(!this.popVal.customerGroupValue){
  			this.popTip = true;
  			this.popTipValue = "请选择客户等级";
  			return false;
  		}
  		if(!this.popVal.schoolName){
  			this.popTip = true;
  			this.popTipValue = "请输入学校名称";
  			return false;
  		}
  		this.popTip = false;
  		this.popTipValue = "";

  		if(!this.canSubPause){
  			return false;
  		}
  		this.canSubPause = false;
  		if(this.upOrAdd == 0){   //新增
  			$.ajax({
		        url: this.path + "insertCustomerDetail",
			    type: 'post',
			    dataType: 'json',
		        data: {
		          "jobNumber": localStorage.getItem("jobNumber"),
		          "sessionIdOa": localStorage.getItem("sessionIdOa"),
		          "citiesId": this.popVal.cityValue,
		          "customerName": this.popVal.schoolName,
		          "typeId": this.popVal.customerTypeValue,
		          "gradeId": this.popVal.customerGroupValue
		        },
		        success: function(data){
		          this.canSubPause = true;
		          if(data["code"] == 200){
		            this.shCheck = true;
		            this.$refs.childAlert.show("新增成功");

		            this.getAllCustomer();
		          }else if(data["code"] == 206){
		          	this.popTip = true;
		          	this.popTipValue = "学校输入重复，请修改";
		          }else{
		          	this.popTip = true;
		          	this.popTipValue = data["msg"];
		          }
		        }.bind(this),
		        error: function (err) {
		          this.canSubPause = true;
		          console.log('获取列表内容异常')
		        }
		    })
  		}else{         //修改客户详情
  			$.ajax({
		        url: this.path + "updateCustomerDetail",
			    type: 'post',
			    dataType: 'json',
		        data: {
		          "jobNumber": localStorage.getItem("jobNumber"),
		          "sessionIdOa": localStorage.getItem("sessionIdOa"),
		          "citiesId": this.popVal.cityValue,
		          "customerName": this.popVal.schoolName,
		          "typeId": this.popVal.customerTypeValue,
		          "gradeId": this.popVal.customerGroupValue,
		          "customerId": this.popVal.customerId
		        },
		        success: function(data){
		          this.canSubPause = true;
		          if(data["code"] == 200){
		          	//再查一遍详情，然后更改刚被修改的列表信息
		          	$.ajax({
				  		url: this.path + "findCustomerDetail",
				  		type: "post",
				  		dataType: "json",
				  		data: {
				  			"jobNumber": localStorage.getItem("jobNumber"),
					        "sessionIdOa": localStorage.getItem("sessionIdOa"),
					        "customerId": this.popVal.customerId
				  		},
				  		success: function(gdata){
				  			this.canSubPause = true;
				  			if(gdata["code"] == 200){
					  			gdata = gdata["data"];
					  			$("#list-"+this.popVal.customerId + ">li").eq(0).text(gdata["updateDateString"]);
					  			$("#list-"+this.popVal.customerId + ">li").eq(1).text(gdata["areaName"]);
					  			$("#list-"+this.popVal.customerId + ">li").eq(2).text(gdata["province"]);
					  			$("#list-"+this.popVal.customerId + ">li").eq(3).text(gdata["cityName"]);
					  			$("#list-"+this.popVal.customerId + ">li").eq(4).text(gdata["customerName"]);
					  			$("#list-"+this.popVal.customerId + ">li").eq(5).text(gdata["typeName"]);
					  			$("#list-"+this.popVal.customerId + ">li").eq(6).text(gdata["gradeName"]);
					  			this.shCheck = true;
			            		this.$refs.childAlert.show("修改成功");

			            		this.popVal.customerId = 0;
				  			}
				  		}.bind(this),
				  		error: function(){
				  			console.log("查询单条数据异常");
				  		}
				  	});
		          }else if(data["code"] == 206){
		          	this.popTip = true;
		          	this.popTipValue = "学校输入重复，请修改";
		          }else{
		          	this.popTip = true;
		          	this.popTipValue = data["msg"];
		          }
		        }.bind(this),
		        error: function (err) {
		          this.canSubPause = true;
		          console.log('获取列表内容异常')
		        }
		    })
  		}
  	},
  	popAreaChange: function(){   //弹窗区域修改
  		this.popVal.proviceValue = 0;
  		this.proviceList = [{"areaId": "", "province": "--请选择--", "provinceCode": "", "provinceId": 0}];
  		this.popVal.cityValue = 0;
  		this.cityList = [{"cityCode": "", "cityId": 0, "cityName": "--请选择--", "provinceId": ""}];
  		var areaId = this.popVal.areaValue;
  		if(!areaId){
  			return false;
  		}
  		this.proviceList = this.OACommon.findProvinceList(areaId);
  	},
  	pageAreaChange: function(){   //页面查询区域修改
  		this.pageVal.proviceValue = 0;
  		this.pageProviceList = [{"areaId": "", "province": "--请选择--", "provinceCode": "", "provinceId": 0}];
  		this.pageVal.cityValue = 0;
  		this.pageCityList = [{"cityCode": "", "cityId": 0, "cityName": "--请选择--", "provinceId": ""}];
  		var areaId = this.pageVal.areaValue;
  		if(!areaId){
  			return false;
  		}
  		this.pageProviceList = this.OACommon.findProvinceList(areaId);
  	},
  	popProviceChange: function(){
  		this.popVal.cityValue = 0;
  		this.cityList = [{"cityCode": "", "cityId": 0, "cityName": "--请选择--", "provinceId": ""}];
  		var provinceId = this.popVal.proviceValue;
  		if(!provinceId){
  			return false;
  		}
  		this.cityList = this.OACommon.findCitiesList(provinceId);
  	},
  	pageProviceChange: function(){
  		this.pageVal.cityValue = 0;
  		this.pageCityList = [{"cityCode": "", "cityId": 0, "cityName": "--请选择--", "provinceId": ""}];
  		var provinceId = this.pageVal.proviceValue;
  		if(!provinceId){
  			return false;
  		}
  		this.pageCityList = this.OACommon.findCitiesList(provinceId);
  	},
  	go2CustomerLink: function(customerId){
  		this.$router.push('/mainIndex/CustomerLink?id='+customerId);
  	},
  	canelPop: function(){
  		this.popVal.customerId = 0;
  		this.shCheck = true;
  		this.title = "";
  	}	
  }
}
</script>
<style>
	
</style>

