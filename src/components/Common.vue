<template>
  <div class="hello">
     
  </div>
</template>

<script>
  export default {
    name: 'Common',
    publicDef: {
          "qpath": "http://120.76.97.204:8090/new-oa/",
          //"qpath": "http://192.168.100.7:8047/",
          "ddomain": window.location.hostname
        },
    getCookie: function(name){
       var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
       if (arr = document.cookie.match(reg))
        return (arr[2]);
       else
        return null;
    },
    setCookie: function(c_name, value, expiredays){
        var exdate = new Date();
       exdate.setDate(exdate.getDate() + expiredays);
       document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";domain="+this.publicDef["ddomain"]+";path=/;expires=" + exdate.toGMTString());
    },
    delCookie: function(name){
        var exp = new Date();
       exp.setTime(exp.getTime() - 1);
       var cval = this.getCookie(name);
       if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    },
    findAllCustomerBycitiesId: function(cid){       //获取无分页学校
      var returnData = [{"customerName": "--请选择--", "customerId": 0}];
      $.ajax({
        url: this.publicDef["qpath"] + "findAllCustomerBycitiesId",
        type: "post",
        dataType: "json",
        async: false,
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "citiesId": cid
        },
        success: function(data){
          if(data["code"] == 200){
            returnData = returnData.concat(data["data"]);
          }else{
            console.log("服务器异常，请稍后重试");
          }
        }.bind(this),
        error: function(){
          console.log("获取学校请求异常");
        }
      });
      return returnData;
    },
    findCustomerGroupAll: function(){ //获取用户等级
      var returnData = [{"gradeName": "--请选择--", "id": 0}];
      $.ajax({
        url: this.publicDef["qpath"] + "findCustomerGroupAll",
        type: 'post',
        dataType: 'json',
        async: false,
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa")
        },
        success: function(data){
          if(data["code"] == 200){
            returnData = returnData.concat(data["data"]);
          }else{
            console.log("服务器异常，请稍后重试");
          }
        }.bind(this),
        error: function (err) {
          console.log('获取列表内容异常')
        }
      })
      return returnData;
    },
    findCustomerTypeAll: function(){  //获取客户类型
      var returnData = [{"typeName": "--请选择--", "id": 0}];
      $.ajax({
        url: this.publicDef["qpath"] + "findCustomerTypeAll",
        type: 'post',
        dataType: 'json',
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa")
        },
        async: false,
        success: function(data){
          if(data["code"] == 200){
            returnData = returnData.concat(data["data"]);
          }else{
            console.log("服务器异常，请稍后重试");
          }
        }.bind(this),
        error: function (err) {
          console.log('获取列表内容异常')
        }
      })
      return returnData;
    },
    findAreaByCondition: function(){ //获取区域
      var returnData = [{"areaName": "--请选择--", "areaId": 0, "createTime": "", "updateTime": ""}];
      $.ajax({
        url: this.publicDef["qpath"] + "findCurrentUserAreaList",
        type: 'get',
        dataType: 'json',
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa")
        },
        async: false,
        success: function(data){
          if(data["code"] == 200){
            returnData = returnData.concat(data["data"]);
          }else{
            console.log("服务器异常，请稍后重试");
          }
        }.bind(this),
        error: function (err) {
          console.log('获取列表内容异常')
        }
      })
      return returnData;
    },
    findProvinceList: function(areaId){  //获取省份
      var returnData = [{"areaId": "", "province": "--请选择--", "provinceCode": "", "provinceId": 0}];
      $.ajax({
        url: this.publicDef["qpath"] + "findProvinceList",
        type: 'get',
        dataType: 'json',
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "areaId": areaId
        },
        async: false,
        success: function(data){
          if(data["code"] == 200){
            returnData = returnData.concat(data["data"]);
          }else{
            console.log("服务器异常，请稍后重试");
          }
        }.bind(this),
        error: function (err) {
          console.log('获取列表内容异常')
        }
      })
      return returnData;
    },
    findCitiesList: function(provinceId){  //获取市区
      var returnData = [{"cityCode": "", "cityId": 0, "cityName": "--请选择--", "provinceId": ""}];
      $.ajax({
        url: this.publicDef["qpath"] + "findCitiesList",
        type: 'get',
        dataType: 'json',
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa"),
          "provinceId": provinceId
        },
        async: false,
        success: function(data){
          if(data["code"] == 200){
            returnData = returnData.concat(data["data"]);
          }else{
            console.log("服务器异常，请稍后重试");
          }
        }.bind(this),
        error: function (err) {
          console.log('获取列表内容异常')
        }
      })
      return returnData;
    },
    findSubjectAll: function(){  //获取学科
      var returnData = [{"subjectId": 0, "subjectName": "--请选择--"}];
      $.ajax({
        url: this.publicDef["qpath"] + "findSubjectAll",
        type: 'post',
        dataType: 'json',
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa")
        },
        async: false,
        success: function(data){
          if(data["code"] == 200){
            returnData = returnData.concat(data["data"]);
          }else{
            console.log("服务器异常，请稍后重试");
          }
        }.bind(this),
        error: function (err) {
          console.log('获取列表内容异常')
        }
      })
      return returnData;
    },
    selectCostType: function(typeUrl){           //获取费用类型
      var costTypeUrl = typeUrl?typeUrl:"selectCostType";

      var returnData = [];
      $.ajax({
        url: this.publicDef["qpath"] + costTypeUrl,
        type: 'post',
        dataType: 'json',
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa")
        },
        async: false,
        success: function(data){
          if(data["code"] == 200){
            returnData = returnData.concat(data["data"]);
          }else{
            console.log("服务器异常，请稍后重试");
          }
        }.bind(this),
        error: function (err) {
          console.log('获取列表内容异常')
        }
      })
      return returnData;
    },
    findGradeList: function(){           //获取年级列表
      var returnData = [];
      $.ajax({
        url: this.publicDef["qpath"] + "findGradeList",
        type: 'post',
        dataType: 'json',
        data: {
          "jobNumber": localStorage.getItem("jobNumber"),
          "sessionIdOa": localStorage.getItem("sessionIdOa")
        },
        async: false,
        success: function(data){
          if(data["code"] == 200){
            returnData = returnData.concat(data["data"]);
          }else{
            console.log("服务器异常，请稍后重试");
          }
        }.bind(this),
        error: function (err) {
          console.log('获取列表内容异常')
        }
      })
      return returnData;
    },
    getOADate: function(src){   //获取项目种需要的日期
      var myDate = src;
      var year = myDate.getFullYear(), month = (myDate.getMonth()+1), smonth = myDate.getMonth(), day = myDate.getDate();
      month = month>9?month:"0"+month, day = day>9?day:"0"+day;
      var todayDate = year + "-" + month + "-" + day;
      
      var returnDate = {
        "todayDate": todayDate,                        //获取今天的日期
        "prevMonthToday": getPrevMonToday(),           //获取上个月的今天
        "year": year,
        "monday": getMonday(),                      //获取传入的日期的周一的日期
        "sunday": getSunday(),                      //获取传入的日期的周日的日期
        "weekNum": getWeekNum()                     //获取传入的日期是今年第几周
      }
      return returnDate;

      //获取上个月今天
      function getPrevMonToday(){
        var prevMonToday = "";
        if(month == 1){ //上个月是12月
          prevMonToday = (year-1) + "-" + "12" + day;
        }else if(month == 3){ //上个月是2月
          if(day > 28){ //今天是大于28号的
            prevMonToday = year + "-02-28"; 
          }else{ //今天小于28号
            prevMonToday = year + "-02-" + ((day<10)?("0"+day):day); 
          }
        }else{
          prevMonToday = year + "-" + ((smonth<10)?("0"+smonth):smonth) + "-" + day;
        }
        return prevMonToday;
      }
      //获取传入日期是今年第几周
      function getWeekNum(){
        const date = new Date(src);
        date.setHours(0, 0, 0, 0);
        // Thursday in current week decides the year.
        date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
        // January 4 is always in week 1.
        const week1 = new Date(date.getFullYear(), 0, 4);
        // Adjust to Thursday in week 1 and count number of weeks from date to week 1.
        // Rounding should be fine for Daylight Saving Time. Its shift should never be more than 12 hours.
        return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
      }
      //获取传入日期那周的周一
      function getMonday(){
        var date = new Date(src);
        var todayDay = date.getDay();
        var mondayTime = 0;
        if(todayDay == 0){ //星期日
          mondayTime = new Date(date.getTime() - 1000*60*60*24*6);
        }else{
          mondayTime = new Date(date.getTime() - 1000*60*60*24*(todayDay-1));
        }
        var m_year = mondayTime.getFullYear(), m_month = (mondayTime.getMonth()+1), m_month = (m_month<10)?("0"+m_month):m_month, m_day = mondayTime.getDate(),
              m_day = (m_day<10)?("0"+m_day):m_day;
          return m_year + "" + m_month + "" + m_day;
      }
      //获取传入日期那周的周日
      function getSunday(){
        var date = new Date(src);
        var todayDay = date.getDay();
        var mondayTime = 0;
        if(todayDay == 0){ //星期日
          mondayTime = src;
        }else{
          mondayTime = new Date(date.getTime() + 1000*60*60*24*(7-todayDay));
        }
        var m_year = mondayTime.getFullYear(), m_month = (mondayTime.getMonth()+1), m_month = (m_month<10)?("0"+m_month):m_month, m_day = mondayTime.getDate(),
              m_day = (m_day<10)?("0"+m_day):m_day;
          return m_year + "" + m_month + "" + m_day;
      }

    },
    getUrlPara: function(name){                   //获取url上传的参数
      var r = '';
      if(window.location.href.indexOf("?") != -1){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        r = window.location.href.split("?")[1].match(reg);
        if (r != null) return unescape(r[2]); return "";
      }else{
        return "";
      }
      //var r = window.location.search.substr(1).match(reg);
    },
    formatCurrency: function(num) {
      var pointNum = 0;
      if(!num){
        return "0.00";
      }
      if(num.toString().indexOf(".")!=-1){
        pointNum = "0." + num.toString().split(".")[1];
        pointNum = Number(pointNum).toFixed(2);
        pointNum = pointNum.slice(1);
      }else{
        pointNum = ".00";
      }
      num = num ? num : 0;
       num = num.toString().replace(/\$|\,/g,'');
       if(isNaN(num))
       num = "0";
       var sign = (num == (num = Math.abs(num)));
       num = Math.floor(num*100+0.50000000001);
       var cents = num%100;
       num = Math.floor(num/100).toString();
       if(cents<10)
       cents = "0" + cents;
       for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
       num = num.substring(0,num.length-(4*i+3))+','+
       num.substring(num.length-(4*i+3));
       return (((sign)?'':'-') + num + pointNum);
      //return (((sign)?'':'-') + num);
    },
    lower2UpperNum: function(numberValue){
      var numberValue=new String(Math.round(numberValue*100)); // 数字金额  
      var chineseValue=""; // 转换后的汉字金额  
      var String1 = "零壹贰叁肆伍陆柒捌玖"; // 汉字数字  
      var String2 = "万仟佰拾亿仟佰拾万仟佰拾元角分"; // 对应单位  
      var len=numberValue.length; // numberValue 的字符串长度  
      var Ch1; // 数字的汉语读法  
      var Ch2; // 数字位的汉字读法  
      var nZero=0; // 用来计算连续的零值的个数  
      var String3; // 指定位置的数值  
      if(len>15){  
        //alert("超出计算范围");  
        return "";  
      }  
      if (numberValue==0){  
        chineseValue = "零元整";  
        return chineseValue;  
      }  
      String2 = String2.substr(String2.length-len, len); // 取出对应位数的STRING2的值  
      for(var i=0; i<len; i++){  
        String3 = parseInt(numberValue.substr(i, 1),10); // 取出需转换的某一位的值  
        if ( i != (len - 3) && i != (len - 7) && i != (len - 11) && i !=(len - 15) ){  
        if ( String3 == 0 ){  
        Ch1 = "";  
        Ch2 = "";  
        nZero = nZero + 1;  
      }  
      else if ( String3 != 0 && nZero != 0 ){  
        Ch1 = "零" + String1.substr(String3, 1);  
        Ch2 = String2.substr(i, 1);  
        nZero = 0;  
      }  
      else{  
        Ch1 = String1.substr(String3, 1);  
        Ch2 = String2.substr(i, 1);  
        nZero = 0;  
      }  
      }  
      else{ // 该位是万亿，亿，万，元位等关键位  
      if( String3 != 0 && nZero != 0 ){  
      Ch1 = "零" + String1.substr(String3, 1);  
      Ch2 = String2.substr(i, 1);  
      nZero = 0;  
      }  
      else if ( String3 != 0 && nZero == 0 ){  
      Ch1 = String1.substr(String3, 1);  
      Ch2 = String2.substr(i, 1);  
      nZero = 0;  
      }  
      else if( String3 == 0 && nZero >= 3 ){  
      Ch1 = "";  
      Ch2 = "";  
      nZero = nZero + 1;  
      }  
      else{  
      Ch1 = "";  
      Ch2 = String2.substr(i, 1);  
      nZero = nZero + 1;  
      }  
      if( i == (len - 11) || i == (len - 3)){ // 如果该位是亿位或元位，则必须写上  
      Ch2 = String2.substr(i, 1);  
      }  
      }  
      chineseValue = chineseValue + Ch1 + Ch2;  
      }  
      if ( String3 == 0 ){ // 最后一位（分）为0时，加上“整”  
        chineseValue = chineseValue + "整";  
      }  
      return chineseValue;
    },
    data () {
      return {
        msg: ""
      }
    }
  }
</script>


