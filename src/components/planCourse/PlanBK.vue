<template>
  <div class="hello">
    <div class="gonggao_bread">
		<a href="#/mainIndex/index" class="fa">首页</a>
		&gt;
		<span>排班管理</span>
		&gt;
		<span>班课</span>
	</div>
	<div class="search_div">
		<div>
			<label class="mlgb10">年度和周：</label>

			<el-date-picker
			    v-model="oaWeek"
			    type="week"
			    format="yyyy年第WW周"
			    :picker-options="pickerOptions"
			    v-on:change="weekChangeSearch"
			    placeholder="选择周">
			</el-date-picker>

			<span class="btn-blue-s" v-on:click="searchData">查询</span>
		</div>
	</div>
	<div class="gonggao_body table_body">
		<p class="pb_title" v-if="!isShowBtn">{{ nowWeekDays }}</p>
		<p class="pb_title" v-if="isShowBtn">
			周数：
			<el-date-picker
			    v-model="oaWeek"
			    type="week"
			    format="yyyy年第WW周"
			    :picker-options="pickerOptions"
			    v-on:change="weekChangeTitle"
			    placeholder="选择周">
			</el-date-picker>
		</p>

		<div class="pb_gn">
			<span class="pb_gn_btit">班课</span>
			<span class="btn-yellow-s" style="float:right;" v-if="!isShowBtn&&leaderBtn" v-on:click="exportSchedu">导出</span>
			<span class="btn-blue-s" style="float:right;" v-if="!isShowBtn&&leaderBtn" v-on:click="doSchedu">排班</span>
			<span class="btn-blue-s" style="float:right;" v-if="isShowBtn&&leaderBtn" v-on:click="subSchedu">确定</span>
			<span class="btn-yellow-s" style="float:right;" v-if="isShowBtn&&leaderBtn" v-on:click="canelSaveSchedu">取消</span>
		</div>
		<div class="pb_table_div">
			<table cellpadding="0" cellspacing="0" border="1">
				<tr>
					<td width="12.5%"></td>
					<td width="12.5%" class="f_w">
						周一<br/>
						{{ titleDate.mon }}
					</td>
					<td width="12.5%" class="f_w">
						周二<br/>
						{{ titleDate.tue }}
					</td>
					<td width="12.5%" class="f_w">
						周三<br/>
						{{ titleDate.wed }}
					</td>
					<td width="12.5%" class="f_w">
						周四<br/>
						{{ titleDate.thi }}
					</td>
					<td width="12.5%" class="f_w">
						周五<br/>
						{{ titleDate.fri }}
					</td>
					<td width="12.5%" class="f_w">
						周六<br/>
						{{ titleDate.sat }}
					</td>
					<td width="12.5%" class="f_w">
						周日<br/>
						{{ titleDate.sun }}
					</td>
				</tr>
				<tr>
					<td class="f_w">早班</td>
					<td class="pb_x" v-bind:class="{pb_x_bb: i.border}" v-on:mouseenter.self="scheduTdDo(i)" v-on:mouseleave.self="scheduTdDoLeave(i)" v-for="i in tdHTML">
						{{ i.userStrings.join(",") }}
						<ul class="person_ul" v-if="i.isShow">
							<li v-for="u in userList">
								<input type="checkbox" v-bind:value="u.userName" v-model="i.userStrings"/><label>{{ u.userName }}</label>
							</li>
						</ul>
					</td>
				</tr>
				<tr>
					<td class="f_w">晚班</td>
					<td class="pb_x" v-bind:class="{pb_x_bb: i.border}" v-on:mouseenter.self="scheduTdDo(i)" v-on:mouseleave.self="scheduTdDoLeave(i)" v-for="i in tdHTML1">
						<span>{{ i.userStrings.join(",") }}</span>
						<ul class="person_ul" v-if="i.isShow">
							<li v-for="u in userList">
								<input type="checkbox" v-bind:value="u.userName" v-model="i.userStrings"/><label>{{ u.userName }}</label>
							</li>
						</ul>
					</td>
				</tr>
			</table>
		</div>
	</div>
	<form method="post" target="_blank" v-bind:action="exportAction">
		<input type="hidden" v-model="exportData.jobNumber" name="jobNumber"/>
		<input type="hidden" v-model="exportData.sessionIdOa" name="sessionIdOa"/>
		<input type="hidden" v-model="exportData.startDateString" name="startDateString"/>
		<input type="hidden" v-model="exportData.endDateString" name="endDateString"/>
		<input type="hidden" value="1" name="schedulingType"/>
		<input type="submit" value="submit" style="display:none;" id="exportFormBtn"/>
	</form>
	<oa-alert ref="childAlert"></oa-alert>
  </div>
</template>

<script>
import $ from 'jquery'
import oaAlert from '@/components/commonVue/Alert'

export default {
  name: 'PlanBK',
  components: {
      'oa-alert': oaAlert
  },
  data () {
    return {
      path: this.OACommon["publicDef"]["qpath"],
      isShowBtn: false,                               //是否能够排班
      oaWeek: new Date(),
      pickerOptions: {
      	firstDayOfWeek: 1,
      	disabledDate(time) {
            return time.getTime() < Date.now();
        }
      },
      nowWeekDays: '',
      exportAction: this.OACommon["publicDef"]["qpath"] + "selectSchedulingExportExcel",
      exportData: {
      	"jobNumber": localStorage.getItem("jobNumber"),
      	"sessionIdOa": localStorage.getItem("sessionIdOa"),
      	"startDateString": '',
      	"endDateString": ''
      },
      userList: [],
      tdHTML: [],
      tdHTML1: [],
      subType: "",
      titleDate: {
      	mon: '',
      	tue: '',
      	wed: '',
      	thi: '',
      	fri: '',
      	sat: '',
      	sun: ''
      },
      leaderBtn: false
    }
  },
  created: function () {
  	this.setTdHTML();
  	this.nowWeekDays = this.getNowWeekDays();  //显示初始化头部时间串
  	this.getScheduling();    //获取排班结果
  	this.setExportValue();   //下载导出文件赋值
  	setTimeout(function(){
  		this.getUserByDeptId();  //获取人员列表信息
  	}.bind(this), 500);
    //功能权限
    var buttonPermissionList = localStorage.getItem("buttonPermissionList");
    buttonPermissionList = JSON.parse(localStorage.getItem("buttonPermissionList"));

    for(var i=0;i<buttonPermissionList.length;i++){
      if(buttonPermissionList[i]["permissionCode"] == "paiban_leader"){
        this.leaderBtn = true;
        break;
      }
    }
  },
  methods: {
  	getNowWeekDays: function(){
  		const year = this.OACommon.getOADate(this.oaWeek).year;
  		const weekNum = this.OACommon.getOADate(this.oaWeek).weekNum;   //当前星期数
  		const monday = this.OACommon.getOADate(this.oaWeek).monday;      //当前星期的周一
  		const sunday = this.OACommon.getOADate(this.oaWeek).sunday;      //当前星期的周日

  		//计算周一到周日的时间
  		var tdHTMLMonday = monday.substring(0, 4) + "-" + monday.substring(4, 6) + "-" + monday.substring(6, 8);   //星期一
  		var tdHTMLDate = new Date(tdHTMLMonday).getTime();                 //星期一的日期格式
  		var tdHTMLTuesday = new Date(tdHTMLDate + 1000*60*60*24);
  		tdHTMLTuesday = getYMD(tdHTMLTuesday);                             //星期二 
  		var tdHTMLWednesday = new Date(tdHTMLDate + 1000*60*60*24*2);
  		tdHTMLWednesday = getYMD(tdHTMLWednesday);                           //星期三 
  		var tdHTMLThursday = new Date(tdHTMLDate + 1000*60*60*24*3);
  		tdHTMLThursday = getYMD(tdHTMLThursday);                            //星期四 
  		var tdHTMLFriday = new Date(tdHTMLDate + 1000*60*60*24*4);
  		tdHTMLFriday = getYMD(tdHTMLFriday);                              //星期五 
  		var tdHTMLSaturday = new Date(tdHTMLDate + 1000*60*60*24*5);
  		tdHTMLSaturday = getYMD(tdHTMLSaturday);                              //星期六 
  		var tdHTMLSunday = new Date(tdHTMLDate + 1000*60*60*24*6);
  		tdHTMLSunday = getYMD(tdHTMLSunday);                              //星期日
  		//tdHTML 的 schedulingDateTring 赋值
  		this.tdHTML[0]["schedulingDateTring"] = tdHTMLMonday;
  		this.tdHTML1[0]["schedulingDateTring"] = tdHTMLMonday;
  		this.tdHTML[1]["schedulingDateTring"] = tdHTMLTuesday;
  		this.tdHTML1[1]["schedulingDateTring"] = tdHTMLTuesday;
  		this.tdHTML[2]["schedulingDateTring"] = tdHTMLWednesday;
  		this.tdHTML1[2]["schedulingDateTring"] = tdHTMLWednesday;
  		this.tdHTML[3]["schedulingDateTring"] = tdHTMLThursday;
  		this.tdHTML1[3]["schedulingDateTring"] = tdHTMLThursday;
  		this.tdHTML[4]["schedulingDateTring"] = tdHTMLFriday;
  		this.tdHTML1[4]["schedulingDateTring"] = tdHTMLFriday;
  		this.tdHTML[5]["schedulingDateTring"] = tdHTMLSaturday;
  		this.tdHTML1[5]["schedulingDateTring"] = tdHTMLSaturday;
  		this.tdHTML[6]["schedulingDateTring"] = tdHTMLSunday;
  		this.tdHTML1[6]["schedulingDateTring"] = tdHTMLSunday;

  		this.titleDate.mon = tdHTMLMonday;
  		this.titleDate.tue = tdHTMLTuesday;
  		this.titleDate.wed = tdHTMLWednesday;
  		this.titleDate.thi = tdHTMLThursday;
  		this.titleDate.fri = tdHTMLFriday;
  		this.titleDate.sat = tdHTMLSaturday;
  		this.titleDate.sun = tdHTMLSunday;

  		return year + "年第" + weekNum + "周：" + monday + "——" + sunday;

  		function getYMD(t){
  			const year = t.getFullYear(), month = (t.getMonth()+1), smonth = t.getMonth(), day = t.getDate();
  			return year + "-" + ((month<10)?("0"+month):month) + "-" + ((day<10)?("0"+day):day);
  		}
  	},
  	getScheduling: function(){
  		var monday = this.OACommon.getOADate(this.oaWeek).monday;      //当前星期的周一
  		var sunday = this.OACommon.getOADate(this.oaWeek).sunday;      //当前星期的周日
  		monday = monday + " ";
  		sunday = sunday + " ";
  		var startDateString = monday.substring(0, 4) + "-" + monday.substring(4, 6) + "-" + monday.substring(6, 8);
  		var endDateString = sunday.substring(0, 4) + "-" + sunday.substring(4, 6) + "-" + sunday.substring(6, 8);
  		$.ajax({
  			url: this.path + "selectScheduling",
  			type: "post",
  			dataType: "json",
  			data: {
  				"jobNumber": localStorage.getItem("jobNumber"),
		      	"sessionIdOa": localStorage.getItem("sessionIdOa"),
		      	"startDateString": startDateString,
		      	"endDateString": endDateString,
		      	"schedulingType": 1
  			},
  			success: function(data){
  				if(data["code"] == 200){
  					if(data["data"].length == 0){
  						this.subType = 2;                                //1修改2添加
  						for(var j=0;j<7;j++){
							this.tdHTML[j]["userStrings"] = [];
							this.tdHTML[j]["id"] = '';
							this.tdHTML1[j]["userStrings"] = [];
							this.tdHTML1[j]["id"] = '';
						}
  					}else{
  						this.subType = 1;                                //1修改2添加
  						//为之前选中的userIDs匹配赋值
  						var lData = data["data"], l = lData.length;
  						for(var i=0;i<l;i++){
  							for(var j=0;j<7;j++){
  								if(lData[i]["schedulingDateTring"]==this.tdHTML[j]["schedulingDateTring"] && lData[i]["schedulingTimeInterval"]==this.tdHTML[j]["schedulingTimeInterval"]){
  									this.tdHTML[j]["id"] = lData[i]["id"];
  									this.tdHTML[j]["userStrings"] = setInitUserList(lData[i]["usersList"]);
  								}
  							}
  							for(var k=0;k<7;k++){
  								if(lData[i]["schedulingDateTring"]==this.tdHTML1[k]["schedulingDateTring"] && lData[i]["schedulingTimeInterval"]==this.tdHTML1[k]["schedulingTimeInterval"]){
  									this.tdHTML1[k]["id"] = lData[i]["id"];
  									this.tdHTML1[k]["userStrings"] = setInitUserList(lData[i]["usersList"]);
  								}
  							}
  						}
  					}
  				}
  			}.bind(this),
  			error: function(){
  				console.log("获取班课列表异常");
  			}
  		});

  		function setInitUserList(list){
  			var uList = [];
  			if(list.length != 0){
  				for(var i=0;i<list.length;i++){
  					uList.push(list[i]["userName"]);
  				}
  			}
  			return uList;
  		}
  	},
  	setExportValue: function(){
  		var monday = this.OACommon.getOADate(this.oaWeek).monday;      //当前星期的周一
  		var sunday = this.OACommon.getOADate(this.oaWeek).sunday;      //当前星期的周日
  		monday = monday + " ";
  		sunday = sunday + " ";
  		var startDateString = monday.substring(0, 4) + "-" + monday.substring(4, 6) + "-" + monday.substring(6, 8);
  		var endDateString = sunday.substring(0, 4) + "-" + sunday.substring(4, 6) + "-" + sunday.substring(6, 8);
  		this.exportData.startDateString = startDateString;
  		this.exportData.endDateString = endDateString;
  	},
  	exportSchedu: function(){
  		$("#exportFormBtn").click();
  	},
  	doSchedu: function(){                              //点击“排班”按钮
  		this.isShowBtn = !this.isShowBtn;
  		for(var ii=0;ii<7;ii++){
  			this.tdHTML[ii]["border"] = true;
  			this.tdHTML1[ii]["border"] = true;
  		}
  		//比今天小的日期不能有边框，表示不能排班
  		var todayDate = this.OACommon.getOADate(new Date()).todayDate;
  		todayDate = todayDate.split("-").join("");
  		todayDate = Number(todayDate);
  		for(var i=0;i<7;i++){
  			var eveDate = this.tdHTML[i]["schedulingDateTring"];
  			eveDate = eveDate.split("-").join("");
  			eveDate = Number(eveDate);
  			if(eveDate <= todayDate){
  				this.tdHTML[i]["border"] = false;
  			}
  		}
  		for(var j=0;j<7;j++){
  			var eveDate = this.tdHTML1[j]["schedulingDateTring"];
  			eveDate = eveDate.split("-").join("");
  			eveDate = Number(eveDate);
  			if(eveDate <= todayDate){
  				this.tdHTML1[j]["border"] = false;
  			}
  		}
  	},
  	scheduTdDo: function(item){  						   //点击需要排班的td
  		// 排班td不能上移控制                         
  		if(!this.isShowBtn){
  			return false;
  		}
  		//上移的日期不能小于今天
  		var todayDate = this.OACommon.getOADate(new Date()).todayDate;
  		todayDate = todayDate.split("-").join("");
  		todayDate = Number(todayDate);
  		var eveDate = item.schedulingDateTring;
  			eveDate = eveDate.split("-").join("");
  			eveDate = Number(eveDate);
  		if(eveDate <= todayDate){
  			return false;
  		}
  		//隐藏所有下拉
  		var hasShow = false;
  		for(var i=0;i<7;i++){
  			if(this.tdHTML[i]["isShow"] || this.tdHTML1[i]["isShow"]){
  				hasShow = true;
  			}
  		}
  		if(!hasShow){              //一个也没有展开
  			item.isShow = true;
  		}else{                    //有展开的
  			if(item.isShow){      //当前是展开的
  				
  			}else{                //点击的是其他未展开的
  				for(var j=0;j<7;j++){
	  				this.tdHTML[j]["isShow"] = false;
	  				this.tdHTML1[j]["isShow"] = false;
	  			}
  				item.isShow = true;
  			}
  		}	
  	},
  	scheduTdDoLeave: function(item){
  		for(var j=0;j<7;j++){
			this.tdHTML[j]["isShow"] = false;
			this.tdHTML1[j]["isShow"] = false;
		}
  	},
  	setTdHTML: function(){
  		this.tdHTML = [
  			{
  				isShow: false,
  				schedulingDateTring: '',     //每天的日期
  				schedulingTimeInterval: 1,	 //1早班2晚班
  				userStrings: [],			 //id对应的name，提交的时候要转化为id,
  				id: '',
  				border: false
  			},
  			{
  				isShow: false,
  				schedulingDateTring: '',     //每天的日期
  				schedulingTimeInterval: 1,
  				userStrings: [],
  				id: '',
  				border: false
  			},
  			{
  				isShow: false,
  				schedulingDateTring: '',     //每天的日期
  				schedulingTimeInterval: 1,
  				userStrings: [],
  				id: '',
  				border: false
  			},
  			{
  				isShow: false,
  				schedulingDateTring: '',     //每天的日期
  				schedulingTimeInterval: 1,
  				userStrings: [],
  				id: '',
  				border: false
  			},
  			{
  				isShow: false,
  				schedulingDateTring: '',     //每天的日期
  				schedulingTimeInterval: 1,
  				userStrings: [],
  				id: '',
  				border: false
  			},
  			{
  				isShow: false,
  				schedulingDateTring: '',     //每天的日期
  				schedulingTimeInterval: 1,
  				userStrings: [],
  				id: '',
  				border: false
  			},
  			{
  				isShow: false,
  				schedulingDateTring: '',     //每天的日期
  				schedulingTimeInterval: 1,
  				userStrings: [],
  				id: '',
  				border: false
  			}
  		];
  		this.tdHTML1 = [
  			{
  				isShow: false,
  				schedulingDateTring: '',     //每天的日期
  				schedulingTimeInterval: 2,
  				userStrings: [],
  				id: '',
  				border: false
  			},
  			{
  				isShow: false,
  				schedulingDateTring: '',     //每天的日期
  				schedulingTimeInterval: 2,
  				userStrings: [],
  				id: '',
  				border: false
  			},
  			{
  				isShow: false,
  				schedulingDateTring: '',     //每天的日期
  				schedulingTimeInterval: 2,
  				userStrings: [],
  				id: '',
  				border: false
  			},
  			{
  				isShow: false,
  				schedulingDateTring: '',     //每天的日期
  				schedulingTimeInterval: 2,
  				userStrings: [],
  				id: '',
  				border: false
  			},
  			{
  				isShow: false,
  				schedulingDateTring: '',     //每天的日期
  				schedulingTimeInterval: 2,
  				userStrings: [],
  				id: '',
  				border: false
  			},
  			{
  				isShow: false,
  				schedulingDateTring: '',     //每天的日期
  				schedulingTimeInterval: 2,
  				userStrings: [],
  				id: '',
  				border: false
  			},
  			{
  				isShow: false,
  				schedulingDateTring: '',     //每天的日期
  				schedulingTimeInterval: 2,
  				userStrings: [],
  				id: '',
  				border: false
  			}
  		];
  	},
  	getUserByDeptId: function(){
  		$.ajax({
  			url: this.path + "findUsersByDeptId",
  			type: "post",
  			dataType: "json",
  			data: {
  				"jobNumber": localStorage.getItem("jobNumber"),
      			"sessionIdOa": localStorage.getItem("sessionIdOa"),
      			"deptId": 7
  			},
  			success: function(data){
  				this.userList = data["data"];
  			}.bind(this),
  			error: function(){
  				console.log("获取人员信息异常");
  			}
  		});
  	},
  	subSchedu: function(){  						//提交数据
  		var userStrings = '';
  		if(this.subType == 2){                      //添加
  			for(var i=0;i<7;i++){
  				userStrings += this.tdHTML[i]["schedulingDateTring"] + "--";
  				userStrings += "1" + "--";
  				userStrings += this.tdHTML[i]["schedulingTimeInterval"] + "--";
  				userStrings += getUserIds(this.tdHTML[i]["userStrings"], this.userList) + "@@";
  			}
  			for(var j=0;j<7;j++){
  				userStrings += this.tdHTML1[j]["schedulingDateTring"] + "--";
  				userStrings += "1" + "--";
  				userStrings += this.tdHTML1[j]["schedulingTimeInterval"] + "--";
  				userStrings += getUserIds(this.tdHTML1[j]["userStrings"], this.userList);
  				if(j != 6){
  					userStrings += "@@";
  				}
  			}
  		}else{										//修改
  			for(var i=0;i<7;i++){
  				userStrings += this.tdHTML[i]["id"] + "--";
  				userStrings += this.tdHTML[i]["schedulingDateTring"] + "--";
  				userStrings += "1" + "--";
  				userStrings += this.tdHTML[i]["schedulingTimeInterval"] + "--";
  				userStrings += getUserIds(this.tdHTML[i]["userStrings"], this.userList) + "@@";
  			}
  			for(var j=0;j<7;j++){
  				userStrings += this.tdHTML1[j]["id"] + "--";
  				userStrings += this.tdHTML1[j]["schedulingDateTring"] + "--";
  				userStrings += "1" + "--";
  				userStrings += this.tdHTML1[j]["schedulingTimeInterval"] + "--";
  				userStrings += getUserIds(this.tdHTML1[j]["userStrings"], this.userList);
  				if(j != 6){
  					userStrings += "@@";
  				}
  			}
  		}
  		var subData = {
  			"jobNumber": localStorage.getItem("jobNumber"),
      		"sessionIdOa": localStorage.getItem("sessionIdOa"),
      		"type": this.subType,                   // 1修改2添加
      		"schedulingString": userStrings
  		};

  		$.ajax({
  			url: this.path + "insertOrUpdateScheduling",
  			type: "post",
  			dataType: "json",
  			data: subData,
  			success: function(data){
  				if(data["code"] == 200){
  					this.$refs.childAlert.show("提交成功");
  					this.getScheduling();
  					this.isShowBtn = false;

            for(var ii=0;ii<7;ii++){
              this.tdHTML[ii]["border"] = false;
              this.tdHTML1[ii]["border"] = false;
            }
  				}else{
  					this.$refs.childAlert.show(data["msg"]);
  				}
  			}.bind(this),
  			error: function(){
  				console.log("提交排班请求异常");
  			}
  		});

  		function getUserIds(arr, list){
  			var ids = '', newIdList = [];
  			for(var u=0;u<list.length;u++){
  				newIdList.push([list[u]["userId"], list[u]["userName"]]);
  			}
  			if(arr.length > 0){
  				var l = arr.length;
  				for(var i=0;i<l;i++){
  					for(var j=0;j<newIdList.length;j++){
  						if(arr[i] == newIdList[j][1]){
  							ids += newIdList[j][0] + ",";
  						}
  					}
  				}
  			}
  			ids = ids.slice(0, -1);
  			return ids;
  		}
  	},
  	canelSaveSchedu: function(){                    //将之前的排班取消掉
  		this.isShowBtn = !this.isShowBtn;
  		for(var j=0;j<7;j++){
			this.tdHTML[j]["userStrings"] = [];
			this.tdHTML[j]["border"] = false;
			this.tdHTML1[j]["userStrings"] = [];
			this.tdHTML1[j]["border"] = false;
		}
		this.getScheduling();
  	},
  	weekChangeTitle: function(){
  		this.nowWeekDays = this.getNowWeekDays();  //显示初始化头部时间串
  		this.getScheduling();

  		for(var ii=0;ii<7;ii++){
  			this.tdHTML[ii]["border"] = true;
  			this.tdHTML1[ii]["border"] = true;
  		}
  		//比今天小的日期不能有边框，表示不能排班
  		var todayDate = this.OACommon.getOADate(new Date()).todayDate;
  		todayDate = todayDate.split("-").join("");
  		todayDate = Number(todayDate);
  		for(var i=0;i<7;i++){
  			var eveDate = this.tdHTML[i]["schedulingDateTring"];
  			eveDate = eveDate.split("-").join("");
  			eveDate = Number(eveDate);
  			if(eveDate <= todayDate){
  				this.tdHTML[i]["border"] = false;
  			}
  		}
  		for(var j=0;j<7;j++){
  			var eveDate = this.tdHTML1[j]["schedulingDateTring"];
  			eveDate = eveDate.split("-").join("");
  			eveDate = Number(eveDate);
  			if(eveDate <= todayDate){
  				this.tdHTML1[j]["border"] = false;
  			}
  		}

  	},
  	weekChangeSearch: function(){
  		this.nowWeekDays = this.getNowWeekDays();  //显示初始化头部时间串
  	},
  	searchData: function(){
  		this.getScheduling();
  		this.isShowBtn = false;
  		for(var j=0;j<7;j++){
			this.tdHTML[j]["border"] = false;
			this.tdHTML1[j]["border"] = false;
		}
  	}
  }
}
</script>
<style>
	.el-date-editor.el-input, .el-date-editor.el-input__inner{width:170px;cursor:pointer;}
	.el-input__inner{height:30px;line-height:30px;cursor:pointer;border:1px solid #C9C9C9;}
	.el-input__icon{line-height:30px;}
	.f_w{font-weight:bold;}
</style>

