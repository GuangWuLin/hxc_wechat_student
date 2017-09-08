// let base = process.env.API_ROOT;
import $ from "jquery";
import axios from "axios";
import { cookie } from 'vux';
// const baseUrl = 'http://10.50.50.249:8080/hxc'; // 内网IP
// const baseUrl = 'http://api.wechat.haoxueche.com/hxc'; // 外网IP

let baseUrl = `${localStorage.getItem('wechatApi')}`; // 外网IP

//请求拦截，添加header鉴权
// var interceptor = axios.interceptors.request.use(
//     config => {
//         config.headers.Authorization = user === null ? "" : user;
//         return config;
//     },
//     err => {
//         return Promise.reject(err);
//     }
// );
export const request = {
    //登录
    login: params => { return axios.post(`${baseUrl}/sc/admin/login`, params); },
    // 微信授权页面-用户绑定
    Authorize: {
        // 短信验证
        verificationCode: params => { return axios.post(`${baseUrl}/app/student/getVerificationCode`, params).then(res => res.data); },
        // 学员电话绑定微信
        wx_Infobind: params => { return axios.post(`${baseUrl}/wx/wx_infobind`, params).then(res => res.data); }
    },
    // 考试管理
    ExamManager: {
        // 考试管理接口
        studentExamManager: params => { return axios.get(`${baseUrl}/wx/exam/getStudentExamManager?schoolCode=` + params[0] + '&cardNo=' + params[1]).then(res => res.data); },
    },
    // 预约类接口
    Appointment: {
        // 学员预约
        createAppointment: params => { return axios.post(`${baseUrl}/sc/appointment/createAppointment`, params).then(res => res.data); },
        // 查询预约时段
        appointmentTimeSlot: params => { return axios.get(`${baseUrl}/sc/appointment/getAppointmentTimeSlot?schoolCode=` + params[0] + '&studentId=' + params[1] + '&classDate=' + params[2] + '&teacherId=' + params[3] + "&stage=" + params[4]).then(res => res.data); },
        // 新增评价
        addEvaluate: params => { return axios.post(`${baseUrl}/sc/appointment/addEvaluate`, params).then(res => res.data); },
        // 评价页面教练信息、评价标签查询
        evaTeacherInfo: params => { return axios.get(`${baseUrl}/sc/appointment/getEvaTeacherInfo?schoolCode=` + params[0] + '&teacherId=' + params[1]).then(res => res.data); },
        // 查询预约结果
        appointmentList: params => { return axios.get(`${baseUrl}/sc/appointment/getAppointmentList?schoolCode=` + params[0] + '&studentId=' + params[1] + '&currentPage=' + params[2] + '&pageSize=' + params[3]).then(res => res.data); },
        // 取消预约
        cancelAppointment: params => { return axios.put(`${baseUrl}/sc/appointment/cancelAppointment`, params).then(res => res.data); },
        // 查询可约教练
        queryAppointmentTeacherBind: params => { return axios.get(`${baseUrl}/sc/appointment/queryAppointmentTeacherBind?schoolCode=` + params[0] + '&studentId=' + params[1] + '&currentPage=' + params[2] + '&pageSize=' + params[3] + '&stage=' + params[4]).then(res => res.data); },
        // 查询评价结果信息
        evaResult: params => { return axios.get(`${baseUrl}/sc/appointment/getEvaResult?schoolCode=` + params[0] + '&teacherId=' + params[1] + '&appointmentId=' + params[2]).then(res => res.data); },
        // 获取 appid
        authorizerAppId: params => { return axios.get(`${baseUrl}/wx/getAuthorizerAppIdBySchoolCode?schoolCode=` + params[0]).then(res => res.data); },
    },
    // 计时类接口
    timerClass: {
        // 查询培训进度
        classRecord: params => { return axios.get(`${baseUrl}/sc/timer/getClassRecord?studentId=` + params[0] + '&stage=' + params[1] + '&carType=' + params[2] + '&province=' + params[3]).then(res => res.data); },
    },
    // 投诉或建议
    feedback: {
        // 投诉或建议
        ComplaintSuggestion: params => { return axios.post(`${baseUrl}/wx/exam/addComplaintSuggestion `, params).then(res => res.data); },
    },
    public: {
        getLocationByAddress: params => { return axios.get("https://restapi.amap.com/v3/geocode/geo?address=" + params[0] + "&key=7d75056f04b7bbdbdb9fa5575e1fb185&extensions=base&offset=10&city=").then(res => res.data); }
    }
}