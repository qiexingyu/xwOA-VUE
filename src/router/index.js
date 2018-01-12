import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import MainIndex from '@/components/MainIndex'
import Index from '@/components/Index'

import EnterNotice from '@/components/notice/EnterNotice'
import noticeManage from '@/components/notice/noticeManage'
import noticeRead from '@/components/notice/noticeRead'
import noticeDetail from '@/components/notice/noticeDetail'

import CustomerList from '@/components/customer/CustomerList'
import CustomerLink from '@/components/customer/CustomerLink'
import schoolExpenses from '@/components/customer/schoolExpenses'
import customerExpenses from '@/components/customer/customerExpenses'

import MenuOuthorty from '@/components/authorty/MenuOuthorty'
import PositionManagement from '@/components/authorty/PositionManagement'
import DivisionalManagement from '@/components/authorty/DivisionalManagement'
import PeopleManagement from '@/components/authorty/PeopleManagement'
import roleManagement from '@/components/authorty/roleManagement'
import provinceManagement from '@/components/authorty/provinceManagement'

import PlanBK from '@/components/planCourse/PlanBK'
import PlanYDY from '@/components/planCourse/PlanYDY'

import PersonApply from '@/components/moneyApply/PersonApply'
import AreaApply from '@/components/moneyApply/AreaApply'
import ExtraApply from '@/components/moneyApply/ExtraApply'
import QuotaApply from '@/components/moneyApply/QuotaApply'
import ProgressSearch from '@/components/moneyApply/ProgressSearch'
import PersonToDo from '@/components/moneyApply/PersonToDo'
import ReviewLog from '@/components/moneyApply/ReviewLog'
import StartCourseApply from '@/components/moneyApply/StartCourseApply'

import expenseClaim from '@/components/reimbursement/expenseClaim'
import followUp from '@/components/reimbursement/followUp'
import personalDo from '@/components/reimbursement/personalDo'
import auditLogging from '@/components/reimbursement/auditLogging'

import coursePlanApply from '@/components/coursePlanApply/coursePlanApply'
import coursePlanSearch from '@/components/coursePlanApply/coursePlanSearch'
import placeApply from '@/components/coursePlanApply/placeApply'
import placeSearch from '@/components/coursePlanApply/placeSearch'
import xsdoCourseSearch from '@/components/coursePlanApply/xsdoCourseSearch'

import teacherManage from '@/components/coursePlanManage/teacher'
import yycoursePlanSearch from '@/components/coursePlanManage/yycoursePlanSearch'
import yydoCourse from '@/components/coursePlanManage/yydoCourse'
import yydoCourseSearch from '@/components/coursePlanManage/yydoCourseSearch'
import yyplaceSearch from '@/components/coursePlanManage/yyplaceSearch'

import selectEntry from '@/components/verfication/selectEntry'
import selectSunEntry from '@/components/verfication/selectSunEntry'
import confirmMoney from '@/components/verfication/confirmMoney'
import verProgressSearch from '@/components/verfication/verProgressSearch'
import hxpersonToDo from '@/components/verfication/hxpersonToDo'
import hxCheckLog from '@/components/verfication/hxCheckLog'

import customer from '@/components/statisticsChart/customer'
import reimStatistics from '@/components/statisticsChart/reimStatistics'
import cancelStatistics from '@/components/statisticsChart/cancelStatistics'
import expensesStatistics from '@/components/statisticsChart/expensesStatistics'
import personalCost from '@/components/statisticsChart/personalCost'
import costStatistics from '@/components/statisticsChart/costStatistics'
import costComparison from '@/components/statisticsChart/costComparison'

import financeFlow from '@/components/finance/financeFlow'
import financeDetail from '@/components/finance/financeDetail'
import lineAdjust from '@/components/finance/lineAdjust'

import addAssets from '@/components/assets/addAssets'
import assetsList from '@/components/assets/assetsList'
import assetApply from '@/components/assets/assetsApply'
import assetsApplyProgress from '@/components/assets/assetsApplyProgress'
import assetsPersonalDo from '@/components/assets/assetsPersonalDo'
import assetsAuditLogging from '@/components/assets/assetsAuditLogging'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',                                         //登录
      name: 'Login',
      component: Login
    },
    {
      path: '/mainIndex',                               //首页模版
      component: MainIndex,
      children: [
        {
          path: '/mainIndex/index',                     //首页子模版
          component: Index
        },
        {
          path: '/mainIndex/notice/enterNotice',        //录入通知
          component: EnterNotice
        },
        {
          path: '/mainIndex/notice/noticeManage',        //通知列表-管理
          component: noticeManage
        },
        {
          path: '/mainIndex/notice/noticeRead',        //通知列表-看列表
          component: noticeRead
        },
        {
          path: '/mainIndex/notice/noticeDetail',        //通知详情页
          component: noticeDetail
        },
        {
          path: '/mainIndex/CustomerList',              //客户管理
          component: CustomerList
        },
        {
          path: '/mainIndex/CustomerLink',              //客户联系人
          component: CustomerLink
        },
        {
          path: '/mainIndex/schoolExpenses',              //客户（学校）费用花费
          component: schoolExpenses
        },
        {
          path: '/mainIndex/customerExpenses',              //客户（联系人）费用花费
          component: customerExpenses
        },
        {
          path: '/mainIndex/authorty/MenuOuthorty',              //权限管理
          component: MenuOuthorty
        },
        {
          path: '/mainIndex/PlanBK',                    //排班--班课
          component: PlanBK
        },
        {
          path: '/mainIndex/PlanYDY',                    //排班--一对一
          component: PlanYDY
        },
        {
          path: '/mainIndex/authorty/PositionManagement',          //岗位管理
          component: PositionManagement
        },
        {
          path: '/mainIndex/moneyApply/PersonApply',          //个人统筹费用申请
          component: PersonApply
        }, 
        {
          path: '/mainIndex/moneyApply/AreaApply',          //区域费用申请
          component: AreaApply
        }, 
        {
          path: '/mainIndex/moneyApply/ExtraApply',          //Extra费用申请
          component: ExtraApply
        },  
        {
          path: '/mainIndex/moneyApply/QuotaApply',          //额度调拨费用申请
          component: QuotaApply
        }, 
        {
          path: '/mainIndex/moneyApply/ProgressSearch',          //申请进度查询
          component: ProgressSearch
        }, 
        {
          path: '/mainIndex/moneyApply/PersonToDo',          //个人待办
          component: PersonToDo
        }, 
        {
          path: '/mainIndex/moneyApply/StartCourseApply',          //开课费用申请
          component: StartCourseApply
        }, 
        {
          path: '/mainIndex/moneyApply/ReviewLog',          //审核记录
          component: ReviewLog
        },
        {
          path: '/mainIndex/coursePlanApply/coursePlanApply',          //课程安排申请
          component: coursePlanApply
        },
        {
          path: '/mainIndex/coursePlanApply/xsdoCourseSearch',          //销售--批量排课后-反馈
          component: xsdoCourseSearch
        },
        {
          path: '/mainIndex/coursePlanApply/coursePlanSearch',          //课程安排查询
          component: coursePlanSearch
        },
        {
          path: '/mainIndex/coursePlanApply/placeApply',          //场地申请
          component: placeApply
        },
        {
          path: '/mainIndex/coursePlanApply/placeSearch',          //场地申请查询
          component: placeSearch
        },
        {
          path: '/mainIndex/coursePlanManage/yydoCourseApply',          //排课--批量排课
          component: yydoCourse
        },
        {
          path: '/mainIndex/coursePlanManage/yydoCourseSearch',          //排课--批量排课后查询
          component: yydoCourseSearch
        },
        {
          path: '/mainIndex/coursePlanManage/coursePlanSearch',          //排课--课程安排查询
          component: yycoursePlanSearch
        },
        {
          path: '/mainIndex/coursePlanManage/teacherManage',          //排课--老师管理
          component: teacherManage
        },
        {
          path: '/mainIndex/verfication/selectEntry',          //核销--费用核销-选择核销条目
          component: selectEntry
        },
        {
          path: '/mainIndex/verfication/selectSunEntry',          //核销--费用核销-选择核销款项
          component: selectSunEntry
        },
        {
          path: '/mainIndex/verfication/confirmMoney',          //核销--费用核销-确认款项
          component: confirmMoney
        },
        {
          path: '/mainIndex/verfication/personToDo',          //核销--费用核销-个人待办
          component: hxpersonToDo
        },
        {
          path: '/mainIndex/verfication/verProgressSearch',          //核销--费用核销-核销进度查询
          component: verProgressSearch
        },
        {
          path: '/mainIndex/verfication/hxCheckLog',          //核销--费用核销-核销审核记录
          component: hxCheckLog
        },
        {
          path: '/mainIndex/coursePlanManage/yyplaceSearch',          //运营--场地查询
          component: yyplaceSearch
        },
        {
          path: '/mainIndex/authorty/DivisionalManagement',          //部门管理
          component: DivisionalManagement
        },
        {
          path: '/mainIndex/authorty/PeopleManagement',          //人员管理
          component: PeopleManagement
        },
        {
          path: '/mainIndex/authorty/roleManagement',          //角色管理
          component: roleManagement
        },
        {
          path: '/mainIndex/authorty/provinceManagement',          //省份管理
          component: provinceManagement
        },
        {
          path: '/mainIndex/reimbursement/expenseClaim',          //报销申请
          component: expenseClaim
        },
        {
          path: '/mainIndex/reimbursement/followUp',          //报销进度查询
          component: followUp
        },
        {
          path: '/mainIndex/reimbursement/personalDo',          //报销个人待办
          component: personalDo
        },
        {
          path: '/mainIndex/reimbursement/auditLogging',          //报销审核记录
          component: auditLogging
        },
        {
          path: '/mainIndex/statisticsChart/customer',          //客户统计
          component: customer
        },
        {
          path: '/mainIndex/statisticsChart/reimStatistics',          //报销统计
          component: reimStatistics
        },
        {
          path: '/mainIndex/statisticsChart/cancelStatistics',          //核销统计
          component: cancelStatistics
        },
        {
          path: '/mainIndex/statisticsChart/costStatistics',          //费用统计
          component: costStatistics
        },
        {
          path: '/mainIndex/statisticsChart/expensesStatistics',          //核销费用对比情况
          component: expensesStatistics
        },
        {
          path: '/mainIndex/statisticsChart/costComparison',          //费用对比情况
          component: costComparison
        },
        {
          path: '/mainIndex/statisticsChart/personalCost',          //个人费用统计
          component: personalCost
        },
        {
          path: '/mainIndex/finance/financeFlow',          //财务流水
          component: financeFlow
        },
        {
          path: '/mainIndex/finance/financeDetail',          //财务流水
          component: financeDetail
        },
        {
          path: '/mainIndex/finance/lineAdjust',          //财务额度调整
          component: lineAdjust
        },
        {
          path: '/mainIndex/assets/addAssets',           //行政管理-资产添加
          component: addAssets
        },
        {
          path: '/mainIndex/assets/assetsList',           //行政管理-资产查询
          component: assetsList
        },
        {
          path: '/mainIndex/assets/assetApply',           //行政管理-资产申请
          component: assetApply
        },
        {
          path: '/mainIndex/assets/assetsApplyProgress',           //行政管理-资产申请进度查询
          component: assetsApplyProgress
        },
        {
          path: '/mainIndex/assets/assetsPersonalDo',           //行政管理-个人待办
          component: assetsPersonalDo
        },
        {
          path: '/mainIndex/assets/assetsAuditLogging',           //行政管理-审核记录
          component: assetsAuditLogging
        }

      ]
    }
  ]
})
