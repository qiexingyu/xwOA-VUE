<template>
   
      <div class="PositionManagement">
          <div class="gonggao_bread">
            <a href="#/mainIndex/index" class="fa">首页</a>
            &gt;
            <span>权限管理</span>
            &gt;
            <span>岗位管理</span>
          </div>
          <div class="search_div">
            <label>岗位名称：</label>
            <input type="text" class="s_time"/>
            <span class="btn-blue-s">查询</span>
            <span class="btn-yellow-s" style="margin-left:0;">新增</span>
          </div>
          <div class="gonggao_body table_body">
            <div class="data_table_head">
              <ul>
                <li class="td22 xh">编号</li>
                <li class="td25 xh">岗位名称</li>
                <li class="td25 xh">归属人员</li>
                <li class="td25 xh">操作</li>
              </ul>
            </div>
            <div class="data_table_body">
              <ul>
                <li class="td22 xh">1</li>
                <li class="td25 xh">董事长</li>
                <li class="td25 xh">乾坤、庞建航、王雨、郄星宇</li>
                <li class="td25 xh">
                  <a href="javascript:void(0);" class="table_edit">修改</a>
                </li>
              </ul>
            </div>
          </div>

          

      </div>



</template>

<script>
  import $ from 'jquery'
  import oaAlert from '@/components/commonVue/Alert'
    export default {
        name: 'MenuOuthorty',
        components: {
          'oa-alert': oaAlert
        },
        data () {
            return {
                data: []
            }
        },
        created: function(){
            
        },
        
    }
</script>