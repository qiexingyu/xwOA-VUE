<template>
  <div class="hello">
      <div class="gonggao_bread">
		<a href="/#/mainIndex/index" class="fa">首页</a>
		&gt;
		<a href="/#/mainIndex/CustomerList">客户管理</a>
		&gt;
		<span>客户列表</span>
	</div>
	<div class="search_div" style="text-align: center">
		<a style="position:absolute;left:40px;" href="/#/mainIndex/CustomerList">返回学校列表</a>
		<span style="font-size: 20px;font-weight: 700;color: #333">{{ customerName }}客户列表</span>
	</div>
	<div class="search_div">
		<label>姓名：</label>
		<input type="text" class="s_time" v-model="contactsName"/>
		<span class="btn-blue-s sear_btn" v-on:click="findCustomerContactsAll">查询</span>
		<span class="btn-yellow-s sear_btn" v-on:click="addContact">新增</span>
	</div>
	<div class="gonggao_body table_body">
		<div class="data_table_head">
			<ul>
				<li class="td13 xh">添加日期</li>
				<li class="td8">姓名</li>
				<li class="td14">职位</li>
				<li class="td16">邮箱</li>
				<li class="td16">电话</li>
				<li class="td11">花费</li>
				<li class="td11">详情</li>
				<li class="td11">操作</li>
			</ul>
		</div>
		<div class="data_table_body">
			<ul v-for="l in lList" v-bind:id="'list-'+l.customerContactsId" v-if="lList.length>0">
				<li class="td13 xh">{{ l.creatDateString }}</li>
				<li class="td8">{{ l.contactsName }}</li>
				<li class="td14">{{ l.position }}</li>
				<li class="td16">{{ l.mailbox }}</li>
				<li class="td16">{{ l.telephone }}</li>
				<li class="td11">
					<a v-bind:href="'/#/mainIndex/customerExpenses?customerContactsId='+l.customerContactsId" class="table_pa">查看</a>
				</li>
				<li class="td11">
					<a href="javascript:void(0);" class="table_pa ck" v-on:click="showDetail(l.customerContactsId)">查看</a>
				</li>
				<li class="td11">
					<a href="javascript:void(0);" class="table_pa xg" v-on:click="updateContact(l.customerContactsId)">修改</a>
				</li>
			</ul>
			<ul v-if="lList.length==0">
				<li style="text-align:center;color:red;width:100%;">此学校暂无客户数据</li>
			</ul>
		</div>
	</div>
	<oa-page ref="childPage"></oa-page>

	<oa-alert ref="childAlert"></oa-alert>

	<div class="bgpop" v-if="isShowCover" v-on:click="closePop"></div>
	<div class="view_area changeCus" style="width: 600px;max-height:520px;padding: 5px 20px" v-if="isShowAdd">
		<span class="closexx" style="margin-right:10px;" v-on:click="closePop"><Icon type="android-cancel"></Icon></span>
		<div style="font-size: 20px;font-weight: 700;text-align: center;margin-top: 10px">{{ popTitle }}</div>
		<div class="view_school yydo" style="margin-top: 20px">
			<label style="display: inline-block;width: 70px;text-align: right">姓名：</label>
			<input type="text" class="s_time" v-model="subDetailData.contactsName" maxlength="5" placeholder="最多输入5个字" />
			<label style="display: inline-block;width: 70px;text-align: right;margin-left: 20px">出生年月：</label>
			<el-date-picker
		      v-model="subDetailData.birthdayString"
		      type="date"
		      format="yyyy-MM-dd"
      		  value-format="yyyy-MM-dd"
      		  :picker-options="pickerOptions1"
      		  default-value="1987-01-01"
		      placeholder="选择日期">
		    </el-date-picker>
		</div>
		<div class="view_school" style="margin-top: 20px">
			<label style="display: inline-block;width: 70px;text-align: right">主业学科：</label>
			<select v-model="subDetailData.subjectId">
				<option v-for="s in subjectId" v-bind:value="s.subjectId">{{ s.subjectName }}</option>
			</select>
			<label style="display: inline-block;width: 70px;text-align: right;margin-left: 20px">职位：</label>
			<input type="text" class="s_time" v-model="subDetailData.position" maxlength="10" placeholder="最多输入10个字"/>
		</div>
		<div class="view_school" style="margin-top: 20px">
			<label style="display: inline-block;width: 70px;text-align: right">邮箱：</label>
			<input type="text" class="s_time" v-model="subDetailData.mailbox"/>
			<label style="display: inline-block;width: 70px;text-align: right;margin-left: 20px">电话：</label>
			<input type="text" class="s_time" v-model="subDetailData.telephone"/>
		</div>
		<div class="view_school" style="margin-top: 20px;font-size: 12px">
			<label style="display: inline-block;width: 70px;text-align: right;vertical-align: top">个人爱好：</label>
			<textarea name="" cols="58" rows="5" v-model="subDetailData.personalLike" placeholder="最多输入500字"></textarea>
		</div>
		<div class="view_school" style="margin-top: 20px;font-size: 12px">
			<label style="display: inline-block;width: 70px;text-align: right;vertical-align: top">备注：</label>
			<textarea name="" cols="58" rows="5" v-model="subDetailData.remarks" placeholder="最多输入500字"></textarea>
		</div>
		<div style="height:23px;margin-top:8px;">
			<div style="text-align:center;color:red;" v-if="popTip">{{ popTipValue }}</div>
		</div>
		<div class="view_btn" style="margin-top:12px">
			<span class="btn-blue-s" v-on:click="subContack">提交</span>
			<span class="btn-yellow-s" v-on:click="closePop">取消</span>
		</div>
	</div>

	<div class="view_area lookDiv" style="width:480px;height:336px;padding: 5px 20px" v-if="isShowDetail">
		<span class="closexx" style="margin-right:10px;" v-on:click="closePop"><Icon type="android-cancel"></Icon></span>
		<div style="font-size: 20px;font-weight: 700;text-align: center;margin-top: 10px">客户详情</div>
		<div class="view_school" style="margin-top: 20px">
			<label style="display: inline-block;width: 220px;">姓名：<span>{{ detailData.contactsName }}</span></label>
			<label style="display: inline-block;margin-left: 20px">出生年月：<span>{{ detailData.birthdayString }}</span></label>
		</div>
		<div class="view_school" style="margin-top: 20px">
			<label style="display: inline-block;width: 220px;">主业学科：<span>{{ detailData.subjectName }}</span></label>
			<label style="display: inline-block;margin-left: 20px">职位：<span>{{ detailData.position }}</span></label>
		</div>
		<div class="view_school" style="margin-top: 20px">
			<label style="display: inline-block;width: 220px;">邮箱：<span>{{ detailData.mailbox }}</span></label>
			<label style="display: inline-block;margin-left: 20px">电话：<span>{{ detailData.telephone }}</span></label>
		</div>
		<div class="view_school" style="margin-top: 20px;font-size: 12px">
			<label style="display: inline-block;vertical-align: top">个人爱好：</label>
			<span>{{ detailData.personalLike }}</span>
		</div>
		<div class="view_school" style="margin-top: 20px;font-size: 12px">
			<label style="display: inline-block;vertical-align: top">备注：</label>
			<span>{{ detailData.remarks }}</span>
		</div>

		<div class="view_btn" style="margin-top: 20px">
			<span class="btn-blue-s" v-on:click="closePop">关闭</span>
		</div>
	</div>
  </div>
</template>

<script>
import $ from 'jquery'
import oaPage from '@/components/commonVue/Page'
import oaAlert from '@/components/commonVue/Alert'

export default {
  name: 'CustomerLink',
  components: {
      'oa-page': oaPage,
      'oa-alert': oaAlert
    },
  data () {
    return {
    	path: this.OACommon["publicDef"]["qpath"],
    	pickerOptions1: {
    		disabledDate(time) {
	            return time.getTime() > Date.now();
	        }
    	},
    	customerName: '',
    	contactsName: '',
    	customerId: '',
    	lList: [],
    	pageNum: 1,
      	pageSize: 10,
      	isShowCover: false,  //是否显示遮盖层
      	isShowDetail: false, //是否显示详情弹层
      	isShowAdd: false,
      	contactId: '',       //修改需要的联系人id
      	addOrUpdatePuase: false,  //添加还是修改按钮
      	popTitle: '',        //新增还是修改客户弹窗标题
      	popTip: false,
      	popTipValue: '',
      	canSubPause: true,   //提交接口的时候定义一个开关，以防多次提交
      	subjectId: [{"subjectId": 0, "subjectName": "--请选择--"}],
      	detailData: {
      		contactsName: '',
      		birthdayString: '',
      		subjectName: '',
      		position: '',
      		mailbox: '',
      		telephone: '',
      		personalLike: '',
      		remarks: ''
      	},
      	subDetailData: {
      		contactsName: '',
      		birthdayString: '',
      		subjectId: 0,
      		position: '',
      		mailbox: '',
      		telephone: '',
      		personalLike: '',
      		remarks: ''
      	}
    }
  },
  created: function () {
  	this.customerId = this.OACommon.getUrlPara("id");
  	this.findCustomerContactsAll();
  	this.getCustomerName();
  },
  methods: {
  	getCustomerName: function(){
  		$.ajax({
	  		url: this.path + "findCustomerDetail",
		    type: 'post',
		    dataType: 'json',
		    data: {
		      "jobNumber": localStorage.getItem("jobNumber"),
		      "sessionIdOa": localStorage.getItem("sessionIdOa"),
		      "customerId": this.customerId
		    },
		    success: function(data){
		      if(data["code"] == 200){
		      	this.customerName = data["data"]["customerName"];
		      }else{
		      	console.log("服务器异常，请稍后重试");
		      }
		    }.bind(this),
		    error: function (err) {
		      console.log('获取列表内容异常')
		    }
		})
  	},
  	findCustomerContactsAll: function(pn, ps){
  		//pn: 当前页数  ps：每页条数
	      if(pn && typeof(pn)!='object'){
	        this.pageNum = pn;
	      }
	      if(ps && typeof(ps)!='object'){
	        this.pageSize = ps;
	      }

  		$.ajax({
	  		url: this.path + "findCustomerContactsAll",
		    type: 'post',
		    dataType: 'json',
		    data: {
		      "jobNumber": localStorage.getItem("jobNumber"),
		      "sessionIdOa": localStorage.getItem("sessionIdOa"),
		      "pageNum": this.pageNum,
		      "pageSize": this.pageSize,
		      "customerId": this.customerId,
		      "contactsName": this.contactsName
		    },
		    success: function(data){
		      if(data["code"] == 200){
		      	this.lList = data["data"]["list"];
		      	
		      	this.$refs.childPage.setArg(data["data"]["pages"], this.pageNum, this.pageSize, this.findCustomerContactsAll);
		      }else{
		      	console.log("服务器异常，请稍后重试");
		      }
		    }.bind(this),
		    error: function (err) {
		      console.log('获取列表内容异常')
		    }
		})
  	},
  	showDetail: function(id){
  		$.ajax({
	  		url: this.path + "findCustomerContactsDetail",
		    type: 'post',
		    dataType: 'json',
		    data: {
		      "jobNumber": localStorage.getItem("jobNumber"),
		      "sessionIdOa": localStorage.getItem("sessionIdOa"),
		      "id": id
		    },
		    success: function(data){
		      if(data["code"] == 200){
		      	this.isShowCover = true;
		      	this.isShowDetail = true;

		      	for(const i in data["data"]){
		      		this.detailData[i] = data["data"][i];
		      	}
		      }else{
		      	console.log("服务器异常，请稍后重试");
		      }
		    }.bind(this),
		    error: function (err) {
		      console.log('获取列表内容异常')
		    }
		})
  	},
  	addContact: function(){
  		this.isShowCover = true;
  		this.isShowAdd = true;
  		this.popTitle = '新增客户';
  		this.contactId = '';
  		for(const i in this.subDetailData){
  			this.subDetailData[i] = '';
  		}
  		//this.subDetailData.birthdayString = this.OACommon.getOADate(new Date()).todayDate;
  		this.subjectId = this.OACommon.findSubjectAll();
  		this.subDetailData.subjectId = 0;
  	},
  	updateContact: function(id){
  		this.isShowCover = true;
  		this.isShowAdd = true;
  		this.popTitle = '修改客户';
  		this.contactId = id;
  		for(const i in this.subDetailData){
  			this.subDetailData[i] = '';
  		}
  		this.subDetailData.birthdayString = this.OACommon.getOADate(new Date()).todayDate;
  		this.subjectId = this.OACommon.findSubjectAll();
  		this.subDetailData.subjectId = 0;

  		//获取单条信息，赋值
  		$.ajax({
	  		url: this.path + "findCustomerContactsDetail",
		    type: 'post',
		    dataType: 'json',
		    data: {
		      "jobNumber": localStorage.getItem("jobNumber"),
		      "sessionIdOa": localStorage.getItem("sessionIdOa"),
		      "id": id
		    },
		    success: function(data){
		      if(data["code"] == 200){
		      	for(const i in data["data"]){
		      		this.subDetailData[i] = data["data"][i];
		      	}
		      }else{
		      	console.log("服务器异常，请稍后重试");
		      }
		    }.bind(this),
		    error: function (err) {
		      console.log('获取列表内容异常')
		    }
		})
  	},
  	subContack: function(){
  		if(!this.subDetailData.contactsName){
  			this.popTip = true;
      		this.popTipValue = '请输入姓名';
  			return false;
  		}
  		/*if(!this.subDetailData.birthdayString){
  			this.popTip = true;
      		this.popTipValue = '请选择出生年月';
  			return false;
  		}
  		if(!this.subDetailData.subjectId){
  			this.popTip = true;
      		this.popTipValue = '请选择主业学科';
  			return false;
  		}
  		if(!this.subDetailData.position){
  			this.popTip = true;
      		this.popTipValue = '请输入职位';
  			return false;
  		}*/
  		if(this.subDetailData.mailbox){
	  		if(this.subDetailData.mailbox.indexOf("@")==-1 || this.subDetailData.mailbox.split("@")[1].indexOf(".")==-1){
	  			this.popTip = true;
	      		this.popTipValue = '请输入正确邮箱地址';
	  			return false;
	  		}
  		}
  		var isPhoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
  		if(!isPhoneReg.exec(this.subDetailData.telephone)){
			this.popTip = true;
      		this.popTipValue = '请输入正确电话号码';
  			return false;
		}
		if(this.subDetailData.personalLike && this.subDetailData.personalLike.length>500){
			this.popTip = true;
      		this.popTipValue = '个人爱好最多输入500字';
  			return false;
		}
		if(this.subDetailData.remarks && this.subDetailData.remarks.length>500){
			this.popTip = true;
      		this.popTipValue = '备注最多输入500字';
  			return false;
		}

  		this.popTip = false;
      	this.popTipValue = '';
  		if(!this.canSubPause){
  			return false;
  		}
  		this.canSubPause = false;

  		var subPath = '', subData = '';
  		if(this.contactId){  //修改
  			subPath = this.path + "updateCustomerContactsDetail";
  			subData = {
  				"customerContactsId": this.contactId,
  				"customerId": this.customerId,
  				"jobNumber": localStorage.getItem("jobNumber"),
  				"sessionIdOa": localStorage.getItem("sessionIdOa"),
  				"contactsName": this.subDetailData.contactsName,
  				"birthdayString": this.subDetailData.birthdayString,
  				"subjectId": this.subDetailData.subjectId,
  				"position": this.subDetailData.position,
  				"mailbox": this.subDetailData.mailbox,
  				"telephone": this.subDetailData.telephone,
  				"personalLike": this.subDetailData.personalLike,
  				"remarks": this.subDetailData.remarks
  			};
  		}else{               //添加
  			subPath = this.path + "insertCustomerContactsDetail";
  			subData = {
  				"customerId": this.customerId,
  				"jobNumber": localStorage.getItem("jobNumber"),
  				"sessionIdOa": localStorage.getItem("sessionIdOa"),
  				"contactsName": this.subDetailData.contactsName,
  				"birthdayString": this.subDetailData.birthdayString,
  				"subjectId": this.subDetailData.subjectId,
  				"position": this.subDetailData.position,
  				"mailbox": this.subDetailData.mailbox,
  				"telephone": this.subDetailData.telephone,
  				"personalLike": this.subDetailData.personalLike,
  				"remarks": this.subDetailData.remarks
  			};
  		}

  		$.ajax({
	  		url: subPath,
		    type: 'post',
		    dataType: 'json',
		    data: subData,
		    success: function(data){
		      this.canSubPause = true;
		      if(data["code"] == 200){
		      	this.closePop();
		      	if(this.contactId){   //修改
		      		this.$refs.childAlert.show("修改成功");
		      		//获取单条后修改列表中的数据
		      		$.ajax({
				  		url: this.path + "findCustomerContactsDetail",
					    type: 'post',
					    dataType: 'json',
					    data: {
			  				"jobNumber": localStorage.getItem("jobNumber"),
			  				"sessionIdOa": localStorage.getItem("sessionIdOa"),
			  				"id": this.contactId
					    },
					    success: function(ddata){
					      if(ddata["code"] == 200){
					      	//修改列表中对应的值
					      	$("#list-"+this.contactId + ">li").eq(1).text(ddata["data"]["contactsName"]);
					      	$("#list-"+this.contactId + ">li").eq(2).text(ddata["data"]["position"]);
					      	$("#list-"+this.contactId + ">li").eq(3).text(ddata["data"]["mailbox"]);
					      	$("#list-"+this.contactId + ">li").eq(4).text(ddata["data"]["telephone"]);
					      }else{
					      	console.log("获取单条信息异常");
					      }
					    }.bind(this),
					    error: function (err) {
					      console.log('获取单条信息异常');
					    }
					})
		      	}else{                //新增
		      		this.findCustomerContactsAll();
		      		this.$refs.childAlert.show("新增成功");
		      	}
		      }else if(data["code"] == 206){
		      	this.popTip = true;
		      	this.popTipValue = "联系人手机号重复，请修改";
		      }else{
		      	this.popTip = true;
		      	this.popTipValue = data["msg"];
		      }
		    }.bind(this),
		    error: function (err) {
		      this.canSubPause = true;
		      console.log('获取列表内容异常');
		    }
		})
  	},
  	closePop: function(){
  		this.isShowCover = false;
		this.isShowDetail = false;
		this.isShowAdd = false;
		this.popTip = true;
      	this.popTipValue = '';
  	}
  }
}
</script>
<style>
	.el-date-editor.el-input, .el-date-editor.el-input__inner{width:170px;cursor:pointer;}
	.el-input__inner{height:30px;line-height:30px;cursor:pointer;border:1px solid #C9C9C9;}
	.el-input__icon{line-height:30px;}
</style>

