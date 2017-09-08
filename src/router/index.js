// 预约结果
import ReservationResults from '../components/reservation-results.vue';
// 预约信息
import ReservationInfo from '../components/reservation-info.vue';
// 预约
import Reservation from '../components/reservation.vue';
// 预约考试
import ReservationExam from '../components/reservation-exam.vue';
// 用户信息绑定
import Register from '../components/register.vue';
// 绑定完成
import Complete from '../components/complete.vue';
// 回馈建议
import Feedback from '../components/feedback.vue';
// 预约评价
import Evaluation from '../components/evaluation.vue';
// 预约评价完成
import EvaluationResult from '../components/evaluation-results.vue';
// 考试定位
import ExamPosition from '../components/exam-position.vue';
// 支付结果
import PayResult from '../components/pay-results.vue';
// 是否预约学员
import IsAppointment from '../components/isAppointment.vue';
// 培训进度
import StageProgress from '../components/stageProgress.vue';
// 培训进度-科目选择
import StageProgressChange from '../components/stageProgressChange.vue';
// 培训进度-培训历史
import StageProgressList from '../components/stageProgressList.vue';
// 培训进度-培训详情
import StageProgressDetail from '../components/stageProgressDetail.vue';


export default [
    { path: "/", component: ReservationResults, name: "预约结果", meta: { requireAuth: true }, hidden: true },
    { path: "/reservationInfo", component: ReservationInfo, name: "预约信息", meta: { requireAuth: true }, hidden: true },
    { path: "/reservation", component: Reservation, name: "预约", meta: { requireAuth: true }, hidden: true },
    { path: "/register", component: Register, name: "用户信息绑定", meta: { requireAuth: false }, hidden: true },
    { path: "/complete", component: Complete, name: "预约评价完成", meta: { requireAuth: true }, hidden: true },
    { path: "/evaluation", component: Evaluation, name: "预约评价", meta: { requireAuth: true }, hidden: true },
    { path: "/evaluationResult", component: EvaluationResult, name: "预约评价完成", meta: { requireAuth: true }, hidden: true },
    { path: "/examPosition", component: ExamPosition, name: "考试定位", meta: { requireAuth: true }, hidden: true },
    { path: "/reservationExam", component: ReservationExam, name: "约考查询", meta: { requireAuth: true }, hidden: true },
    { path: "/payResult", component: PayResult, name: "支付结果", meta: { requireAuth: true }, hidden: true },
    { path: "/feedback", component: Feedback, name: "投诉及建议", meta: { requireAuth: true }, hidden: true },
    { path: "/isAppointment", component: IsAppointment, name: "非预约学员", meta: { requireAuth: true }, hidden: true },
    { path: "/stageProgress", component: StageProgress, name: "培训进度", meta: { requireAuth: true }, hidden: true,
        children:[
            {
                path: '/stageProgress/stageProgressChange',
                component: StageProgressChange,
                meta: { requireAuth: true }
            },
            {
                path: '/stageProgress/stageProgressList',
                component: StageProgressList,
                meta: { requireAuth: true }
            }
        ] },
    { path: "/stageProgressDetail", component: StageProgressDetail, name: "培训进度详情", meta: { requireAuth: true }, hidden: true },
    
];
