import $ from "jquery"
import highcharts from "highcharts"
import { request } from "../../api/api";

//global.js全局函数
var global = {
    root: {},
    roles: [],
    pageSize: 10,
    schoolCodes:510300085,
    defaultImg:'',
    // '{"studentId":20000033,"studentName":"王传美","schoolCode":510100755,"phone":"15881084528","cardNo":"620103197401268019","studentUnifyCode":"1833758976032153","gender":1,"photosUrl":"http://img.haoxueche.com:8888/group1/M00/03/85/wKgKH1lxubOAMQaAAAMXhKeUJQA119.png","autograph":null,"carTypeName":"C2","carType":22,"province":"510000","schoolName":"省振中驾校","appointment":false,"learnFirst":false,"openId":"ofYYU1GgTPj5TPrcMGRRABZNFpWM","redirectUrl":null}'
    studentId:122,
    openId:'ofYYU1LonWhcvduN7s4UuJWOfIlc',
    redirectURL:'www.haoxueche.com',
    map: {
        center: {
            lat: 104.06792346,
            lng: 30.67994285
        }
    },
    //枚举
    enums: {
        status: {
            UN_DO: "未审核",
            SUCCESS: "审核成功",
            FAIL: "审核失败",
            DOING: "审核中"
        },
        stage: {
            1: "科目一",
            2: "科目二",
            3: "科目三",
            4: "科目四"
        },
        newStage: {
            "PART_1": "科目一",
            "PART_2": "科目二",
            "PART_3": "科目三",
            "PART_4": "科目四"
        },
        uploadState: {
            0: "未备案",
            1: "已备案",
            2: "修改未备案"
        },
        reportState: {
            10: "待分校上报",
            20: "报总校中",
            30: "上报车管中",
            40: "车管审核中",
            50: "可约考",
        },
        photoType: {
            1: "身份证电子照片",
            2: "现场照片",
            3: "注册申请表",
            4: "身份证正反面照片",
            5: "暂住证表",
            6: "驾驶证申请表",
            7: "体检表",
            8: "申请表格"
        },
        vocationalLevel: {
            1: "一级",
            2: "二级",
            3: "三级",
            4: "四级"
        },
        workState: {
            0: "在职",
            1: "离职"
        },
        graduateState: {
            10: "在校",
            20: "结业",
            30: "离校"
        },
        reviewState: {
            10: "未考核",
            20: "合格",
            30: "不合格"
        },
        recordingStatus: {
            1: "未开始",
            2: "培训中",
            3: "待支付",
            4: "未评价",
            5: "已评价"
        },
        impression: {
            excellent: ["认真负责，有耐心", "教学经验丰富", "主动接送学员", "车况整洁，不抽烟"],
            good: ["车辆比较脏(有异味)", "车上抽烟", "服务态度一般", "教学水平一般"],
            difference: ["吃拿卡要", "态度恶劣", "迟到早退，不准时"]
        },
        payStatus: {
            10: "未支付",
            20: "已支付"
        },
        appointmentType: {
            10: "扣费",
            20: "扣学时"
        },
        timeAudit: {
            auditState: {
                0: "等待初审",
                2: "照片缺失",
                3: "无分钟",
                4: "分钟数异常",
                5: "无教学区域 "
            },
            photosType: {
                5: "定时拍照",
                17: "学员签到",
                18: "学员签退",
                19: "培训过程中拍照",
                20: "教练签到",
                21: "教练签退"
            }
        },
        picUploadStatus: {
            10: "已拍照",
            20: "未上报",
            30: "上报中",
            40: "上报成功",
            50: "上报失败"
        },
        services: {
            status: {
                to_do: "审核中",
                fail: "审核失败",
                normal: "已开通",
                stop: "停止服务"
            }
        },
        record: {
            status: {
                device: "设备",
                camera: "摄像头",
                sign_in: "正在签到",
                halfway: "正在过程签到",
                sign_out: "正在签退",
                post_doing: "正在培训",
                pre_doing: "正在培训",
                done: "培训完成",
                success: "成功",
                fail: "失败",
                review_success: "复审成功",
                review_fail: "复审失败",
                teacher_sign_out: "正在教练签退"
            }
        },
        vehicles: {
            superviseStatus: {
                UN_DO: "未备案",
                DOING: "备案中",
                SUCCESS: "已备案",
                FAIL: "备案失败"
            }
        },
        remindType: {
            WEB: "网站推送",
            SMS: "短信提醒"
        },
        messagesType: {
            "全部": "",
            "普通消息": "normal",
            "普通报警": "normal",
            "预约": "appointment",
            "学时审核": "class_record",
            "车辆保险": "car_insurance",
            "车辆年检": "car_annualcheck"
        }
    },
    //下拉选项值
    options: {
        stage: [
            {
                value: "1",
                label: "科目一"
            },
            {
                value: "2",
                label: "科目二"
            },
            {
                value: "3",
                label: "科目三"
            },
            {
                value: "4",
                label: "科目四"
            }
        ],
        vocationalLevel: [//资格等级
            {
                value: "1",
                label: "一级"
            },
            {
                value: "2",
                label: "二级"
            },
            {
                value: "3",
                label: "三级"
            },
            {
                value: "4",
                label: "四级"
            }
        ],
        workState: [//在职状态
            {
                value: "0",
                label: "在职"
            },
            {
                value: "1",
                label: "离职"
            },
        ],
        zone: [
            {
                label: "四川省",
                value: "510000",
                //disabled: true
            },
            {
                label: "云南省",
                value: "530000",
                //disabled: true
            },
            {
                label: "湖南省",
                value: "430000",
                //disabled: true
            },
            {
                label: "青海省",
                value: "630000",
                //disabled: true
            },
            {
                label: "福建省",
                value: "350000",
                //disabled: true
            }
        ]
    },
    //图表
    highchart: {
        init: function (load_el, data, unit) {
            new highcharts.Chart({
                colors: data.chartColors,
                chart: {
                    renderTo: load_el,
                    type: "area",
                    marginRight: 0,
                    marginBottom: 22
                },
                legend: {
                    enabled: false
                },
                title: {
                    text: ""
                },
                xAxis: {
                    type: "datetime",
                    allowDecimals: false,
                    gridLineWidth: 1,
                    gridLineColor: "#E2E2E2",
                    startOnTick: true,
                    endOnTick: true,
                    categories: data.categories,
                    labels: {
                        formatter: function () {
                            return this.value; // clean, unformatted number for year
                        }
                    }
                },
                yAxis: {
                    gridLineColor: "#E2E2E2",
                    title: {
                        text: ""
                    },
                    labels: {
                        formatter: function () {
                            return this.value + unit;
                        }
                    }
                },
                tooltip: {
                    shared: true,
                    useHTML: true,
                    borderColor: "#FFF",
                    headerFormat: "<small>{point.key}</small>",
                    pointFormat: "<table><tr><td><span style=\"color:{series.color}\">\u25CF</span>{series.name}:</td>" + "<td><b>{point.y}" + unit + "</b></td></tr>",
                    footerFormat: "</table>"
                },
                plotOptions: {
                    area: {
                        lineWidth: 3,
                        linecap: "round",
                        marker: {
                            enabled: false,
                            symbol: "circle",
                            fillColor: "#888",
                            radius: 2,
                            states: {
                                hover: {
                                    enabled: true,
                                    lineWidth: 2
                                }
                            }
                        }
                    }
                },
                series: data.series,
                credits: {
                    enabled: false
                }
            });
        }
    },
    //localStorage操作
    localstorage: {
        add: function (name, data) {
            localStorage.setItem(name, JSON.stringify(data));
        },
        get: function (name) {
            return JSON.parse(localStorage.getItem(name));
        },
        del: function (name) {
            localStorage.removeItem(name);
        },
        clear: function () {
            localStorage.clear();
        }
    },
    //sessionStorage操作
    session: {
        add: function (name, data) {
            sessionStorage.setItem(name, JSON.stringify(data));
        },
        get: function (name) {
            return sessionStorage.getItem(name);
        },
        del: function (name) {
            sessionStorage.removeItem(name);
        },
        clear: function () {
            sessionStorage.clear();
        }
    },
    //字段验证
    fieldVerification: {
        //判断输入的EMAIL格式
        IsEmail: function (field) {
            let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            if (!reg.test(field)) {
                return false;
            }
            return true;
        },
        //判断输入的Phone格式
        IsPhone: function (field) {
            /*移动号段
            1706,853,1703,147,1705,184,178,182,183,187,188,157,158,159,150,151,152,134,135,136,137,138,139,148
            规则：可以以0开头+三位固定号段+8为数字*/
            var pattern1 = new RegExp(/^0{0,1}(13[4-9]|14[78]|15[0-2]|15[7-9]|170|178|18[2-4]|18[78]|853)[0-9]{8}$/);
            //var pattern1 = new RegExp(/^0{0,1}(13[4-9]|147|15[0-2]|15[7-9]|178|18[23478])[0-9]{8}$/);
            /*联通号段
            0,130,131,132,155,156,185,186,145,176,154,171,1704,1707,1708,1709,175
            */
            var pattern2 = new RegExp(/^0{0,1}(13[0-2]|145|15[4-6]|170|171|17[56]|18[56])[0-9]{8}$/);
            /*电信号段
            149,153,133,180,189,181,177,173,1701,1702,1700
            */
            var pattern3 = new RegExp(/^0{0,1}(133|149|153|170|173|177|18[01]|189)[0-9]{8}$/);

            /*座机号码
            */
            var pattern4 = /^[+]{0,1}(\d){1,4}[ ]{0,1}([-]{0,1}((\d)|[ ]){1,12})+$/;
            if (pattern1.test(field)) {
                //"移动";
                return 1;
            }
            else if (pattern2.test(field)) {
                //"联通";
                return 1;
            }
            else if (pattern3.test(field)) {
                //"电信";
                return 1;
            }
            //        else if (pattern4.test(str)) {
            //            return 1;
            //        }
            else {
                //"非手机号";
                return 0;
            }
        },
        //判断输入的纯数字格式
        IsNumber: function (field) {
            let reg = /^[0-9]*$/;
            if (!reg.test(field)) {
                return false;
            }
            return true;
        },
        //判断输入的数字或字母或两者组合
        IsNumberOrLetters: function (field) {
            let reg = /^[0-9a-zA-Z]*$/g;
            if (!reg.test(field)) {
                return false;
            }
            return true;
        },
        //判断输入的数字、字母、汉字
        IsChineseOrNumberOrLetters: function (field) {
            let reg = /^[a-zA-Z0-9\u4e00-\u9fa5]*$/g;
            if (!reg.test(field)) {
                return false;
            }
            return true;
        },
        //判断输入的浮点数字格式
        IsFloatNumber: function (field, decimalPlaces, amount) {
            //输入金额大小判断
            let inputAmount = amount || 0;
            if (inputAmount) {
                if (field > inputAmount || field < 0.01) {
                    return false;
                }
            }
            var len1 = field.substr(0, 1);
            var len2 = field.substr(1, 1);
            if (field.length > 1 && len1 == 0 && len2 != '.') {
                return false;
            }
            let reg = decimalPlaces === 1 ? /^\d+(\.\d{1})?$/ : /^\d+(\.\d{2})?$/;
            if (!reg.test(field)) {
                return false;
            }
            return true;
        },
        //判断输入的整型格式
        IsInteger: function (field) {
            return typeof field === "number" && field % 1 === 0;
        },
        //是否为中文
        IsChinese: function (field) {
            let reg = /^[\u2E80-\u9FFF]+$/;//Unicode编码中的汉字范围
            if (!reg.test(field)) {
                return false;
            }
            return true;
        },
        //是否是身份证号码
        isIdCardNo: function (field) {
            field = field.replace(/(^\s*)|(\s*$)/g, "");
            var city = {
                11: "北京",
                12: "天津",
                13: "河北",
                14: "山西",
                15: "内蒙古",
                21: "辽宁",
                22: "吉林",
                23: "黑龙江 ",
                31: "上海",
                32: "江苏",
                33: "浙江",
                34: "安徽",
                35: "福建",
                36: "江西",
                37: "山东",
                41: "河南",
                42: "湖北 ",
                43: "湖南",
                44: "广东",
                45: "广西",
                46: "海南",
                50: "重庆",
                51: "四川",
                52: "贵州",
                53: "云南",
                54: "西藏 ",
                61: "陕西",
                62: "甘肃",
                63: "青海",
                64: "宁夏",
                65: "新疆",
                71: "台湾",
                81: "香港",
                82: "澳门",
                91: "国外 "
            };
            var tip = "";
            var pass = true;

            if (!field || !/(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(field)) {
                pass = false;
            }

            else if (!city[field.substr(0, 2)]) {
                pass = false;
            } else {
                // 18位身份证需要验证最后一位校验位
                if (field.length == 18) {
                    field = field.split('');
                    // ∑(ai×Wi)(mod 11)
                    // 加权因子
                    var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8,
                        4, 2];
                    // 校验位
                    var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
                    var sum = 0;
                    var ai = 0;
                    var wi = 0;
                    for (var i = 0; i < 17; i++) {
                        ai = field[i];
                        wi = factor[i];
                        sum += ai * wi;
                    }
                    var last = parity[sum % 11];
                    if (parity[sum % 11] != field[17]) {
                        pass = false;
                    }
                }
            }
            return pass;
        },
        //是否为护照
        isPassport: function (field) {
            let reg = /^1[45][0-9]{7}|([P|p|S|s]\d{7})|([S|s|G|g]\d{8})|([Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8})|([H|h|M|m]\d{8，10})$/;
            if (!reg.test(field)) {
                return false;
            }
            return true;
        },
        //是否为军官证
        isOfficerCertificate: function (field) {
            let reg = /^[a-zA-Z0-9]{7,18}$/;
            if (!reg.test(field)) {
                return false;
            }
            return true;
        }
    },
    user: {
        get: function () {
            return JSON.parse(global.session.get("user"));
        },
        remove: function () {
            global.session.del("user");
        }
    },
    app: {
        get: function () {
            return JSON.parse(global.session.get("app"));
        },
        remove: function () {
            global.session.del("app");
        }
    },
    //hex转base64
    hexToBase64(hexStr) {
        return global.doConvertHexToBase64(String.fromCharCode.apply(null, hexStr.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
    },
    //执行转换
    doConvertHexToBase64(bin) {
        var tableStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var table = tableStr.split("");
        for (var i = 0, j = 0, len = bin.length / 3, base64 = []; i < len; ++i) {
            var a = bin.charCodeAt(j++), b = bin.charCodeAt(j++), c = bin.charCodeAt(j++);
            base64[base64.length] = table[a >> 2] + table[((a << 4) & 63) | (b >> 4)] + (isNaN(b) ? "=" : table[((b << 2) & 63) | (c >> 6)]) + (isNaN(b + c) ? "=" : table[c & 63]);
        }
        return base64.join("");
    },
    countdown(callback) {
        let _countdown = 5;
        var t = setInterval(function () {
            if (_countdown === 0) {
                clearInterval(t);
            } else {
                _countdown--;
            }
            callback(_countdown);
        }, 1000);
    },
    DateDiff(sDate1, sDate2) {
        var aDate, oDate1, oDate2, iDays;
        aDate = sDate1.split("-");
        oDate1 = new Date(aDate[0], aDate[1], aDate[2]);
        aDate = sDate2.split("-");
        oDate2 = new Date(aDate[0], aDate[1], aDate[2]);
        iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24);
        return iDays;
    },
    AddDays(dayNumber, date) {
        // 方法 增添dayNumber天（整形），date：如果没传就使用今天（日期型）
        date = date ? date : new Date();
        var ms = dayNumber * (1000 * 60 * 60 * 24);
        var newDate = new Date(date.getTime() + ms);
        return newDate;
    },
    Dictionary() {
        this.data = new Array();
        this.put = function (key, value) {
            this.data[key] = value;
        };
        this.get = function (key) {
            return this.data[key];
        };
        this.remove = function (key) {
            this.data[key] = null;
        };
        this.isEmpty = function () {
            return this.data.length == 0;
        };
        this.size = function () {
            return this.data.length;
        };
    },
    ArraySum(arr) {
        // 方法 增添dayNumber天（整形），date：如果没传就使用今天（日期型）
        var sum = 0;
        if (Object.prototype.toString.call(arr) === "[object Array]") {
            for (var i = 0; i < arr.length; i++) {
                if (typeof arr[i] === "number" && !isNaN(arr[i])) {
                    sum = floatAdd(sum, arr[i]);
                } else {
                    var tmp = Number(arr[i]);
                    if ((typeof tmp === "number") && !isNaN(tmp)) {
                        sum = floatAdd(sum, tmp);
                        //sum += tmp;
                    } else {
                        throw new Error("存在不能转换成Number的数据");
                    }
                }
            }
        }
        return sum;
    },
    ArrayUnique(array) {
        var r = [];
        for (var i = 0, l = array.length; i < l; i++) {
            for (var j = i + 1; j < l; j++)
                if (array[i] === array[j]) j = ++i;
            r.push(array[i]);
        }
        return r;
    },
    CreateObject() {
        var args = arguments;
        var o = new Object();
        o.name = args[0];
        o.amount = args[1];
        o.chargeAmount = args[2];
        o.refundAmount = args[3];
        o.receiptAmount = args[4];
        o.createdNum = args[5];
        o.paidNum = args[6];
        o.turnoverRate = args[7];
        o.chargeRate = args[8];
        return o;
    },
    getDays(para, dNum) {
        var arr = para.split('-');
        var days = [];
        for (var i = (parseInt(arr[2])); i <= (parseInt(arr[2]) + dNum); i++) {
            let date = new Date(arr[0], arr[1] - 1, i).Format("yyyy-MM-dd");
            days.push({
                date: date,
                click: false,
                week: global.getWeek(new Date(date).getDay())
            });
        }
        return days;
    },
    getWeek(result) {
        switch (result) {
            case 1:
                return "周一";
            case 2:
                return "周二";
            case 3:
                return "周三";
            case 4:
                return "周四";
            case 5:
                return "周五";
            case 6:
                return "周六";
            default:
                return "周日"
        }
    },
    isEmptyObject(obj) {
        for (var item in obj) {
            return false;
        }
        return true;
    },
    //获取地区List
    getArea(id, callback) {
        request.public.queryArea(id).then((res) => {
            if (res.success) {
                callback(res.object);
            }
        });
    },
    //获取指定地区
    getAreaByCode(id, callback) {
        request.public.queryAreaByCode(id).then((res) => {
            if (res.success) {
                callback(res.object);
            }
        });
    },
    data: {
        format(row, column) {
            if (column.property === "report") {
                return row.report ? "已上报" : "未上报";
            }
            else if (column.property === "status") {
                return global.enums.status[row.status];
            }
            else if (column.property === "stage") {
                return global.enums.stage[row.stage];
            }
            else if (column.property === "gmtModify") {
                return new Date(row.gmtModify).Format("yyyy-MM-dd HH:mm:ss");
            }
        }
    },
    //加载功能权限
    loadFunctions(t, callback) {
        request.getFunctions(JSON.parse(sessionStorage.getItem("user")).s).then((res) => {
            if (res.success === true) {
                let authority = [];
                let data = res.object;
                //console.log(JSON.stringify(data));
                //console.log("------------authority----------");
                for (var item in data) {
                    let func = global.initFunctions(data[item]);
                    if (func === null) {
                        continue;
                    }
                    authority.push(func);
                }
                if (t === 1) {
                    callback(authority);
                }
                else {
                    callback(global.roles);
                }
            }
        });
    },
    initFunctions(data) {
        global.roles.push(data.baseFunction.functionName);
        var orgdata = {
            id: data.baseFunction.authCode,
            value: data.baseFunction.functionName,
            firstLevel: data.baseFunction.firstLevel
        };
        // console.log(orgdata.value);
        // 消息中心
        // 消息
        // 报警
        // 公告
        //if (orgdata.value !== "场地管理") { }
        if (data.childList) {
            $.extend(orgdata, { children: [] });
        }
        for (var citem in data.childList) {
            if (data.childList[citem].baseFunction.secondLevel !== null) {
                var subdata = this.initFunctions(data.childList[citem]);
                orgdata.children.push(subdata);
            }
        }
        return orgdata;
    },
    downloadExl(json, filename, type) {
        var tmpDown;
        var keyMap = [];//获取键
        for (let k in json[0]) {
            keyMap.push(k);
        }
        var tmpdata = [];//用来保存转换好的json 
        json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
            v: v[k],
            position: (j > 25 ? global.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
        }))).reduce((prev, next) => prev.concat(next)).forEach((v, i) => tmpdata[v.position] = {
            v: v.v
        });
        var outputPos = Object.keys(tmpdata); //设置区域,比如表格从A1到D10
        var tmpWB = {
            SheetNames: ["mySheet"], //保存的表标题
            Sheets: {
                "mySheet": Object.assign({},
                    tmpdata, //内容
                    {
                        "!ref": outputPos[0] + ":" + outputPos[outputPos.length - 1] //设置填充区域
                    })
            }
        };
        tmpDown = new Blob([global.s2ab(XLSX.write(tmpWB,
            { bookType: (type == undefined ? "xlsx" : type), bookSST: false, type: "binary" }//这里的数据是用来定义导出的格式类型
        ))], {
                type: ""
            }); //创建二进制对象写入转换好的字节流
        var href = URL.createObjectURL(tmpDown); //创建对象超链接
        console.log(href);
        return;
        document.getElementById("down-link").setAttribute("href", href); //绑定a标签
        document.getElementById("down-link").setAttribute("download", filename + ".xlsx");
        document.getElementById("down-link").click(); //模拟点击实现下载
        setTimeout(function () { //延时释放
            URL.revokeObjectURL(tmpDown); //用URL.revokeObjectURL()来释放这个object URL
        }, 100);
    },
    s2ab(s) { //字符串转字符流
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    },
    // 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
    getCharCol(n) {
        let temCol = '',
            s = '',
            m = 0
        while (n > 0) {
            m = n % 26 + 1
            s = String.fromCharCode(m + 64) + s
            n = (n - m) / 26
        }
        return s
    },
    convertToString(val) {
        if (val === "" || val === null) {
            return "";
        }
        else {
            return val.toString();
        }
    },
    /**
    *精伦身份证读卡器
    */
    IDCARD: {
        //读取身份证信息
        getIDCardInfo: function () {
            //判断是否已安装身份证读卡器控件
            try {
                var ax = new ActiveXObject("IDRCONTROL.IdrControlCtrl.1");
            }
            catch (e) {
                return 0;
            }
            //初始化设备， 第一个参数为对应的设备端口，USB型为1001，串口型为1至16
            var initResult = IdrControl.ReadCard("1001", "");
            if (initResult == 1) {
                var idCardInfo = global.IDCARD.getIDCardDetailInfo();
                return idCardInfo;
            }
            else if (initResult == -1 || initResult == -2 || initResult == -3 || initResult == -4) {
                return initResult;
            }
        },
        //获取身份证详细信息
        getIDCardDetailInfo: function () {
            var idCardInfo = {};
            //获取姓名
            var name = IdrControl.GetName();
            //获取性别
            var gender = IdrControl.GetSex == "男" ? 1 : 2;
            //获取证件号码
            var cardNo = IdrControl.GetCode();
            //获取省
            var registProvince = cardNo.substr(0, 2) + "0000";
            //获取市
            var registCity = cardNo.substr(0, 4) + "00";
            //获取区/县
            var registCounty = cardNo.substr(0, 6);
            //获取地址
            var address = IdrControl.GetAddress();
            //获取出生日期
            var birthDay = IdrControl.GetBirthYear() + "-" + IdrControl.GetBirthMonth() + "-" + IdrControl.GetBirthDay();
            //获取身份证有效期止
            var effectiveDate = IdrControl.GetValid();
            effectiveDate = effectiveDate.substr(effectiveDate.indexOf("-") + 1).replace(/\./g, "-");
            //获取头像base64数据
            var photoOdBase64 = IdrControl.GetCardPhotobuf();
            idCardInfo["name"] = name;
            idCardInfo["gender"] = gender;
            idCardInfo["cardNo"] = cardNo;
            idCardInfo["registProvince"] = registProvince;
            idCardInfo["registCity"] = registCity;
            idCardInfo["registCounty"] = registCounty;
            idCardInfo["address"] = address;
            idCardInfo["birthDay"] = birthDay;
            idCardInfo["effectiveDate"] = effectiveDate;
            idCardInfo["photoOdBase64"] = photoOdBase64;
            return idCardInfo;
        }
    },
    readSignatureData(callback) {
        var obj = document.getElementById("ocx");
        //验证USBKey是否存在
        if (typeof obj.isKeyPlugIn === "undefined") {
            alert("当前使用的浏览器不支持签章操作，请使用IE浏览器");
        }
        else {
            var isKeyPlugIn = obj.isKeyPlugIn();
            if (!isKeyPlugIn) {
                alert("未插入签章需要的Key！");
                return false;
            }
            //读取签章数据
            var seal;//签章的HEX编码
            var sealArray = obj.readSeal();
            sealArray = sealArray.toArray();
            if (sealArray[0] == false) {
                alert("读取签章数据失败！");
                return false;
            }
            var seal = sealArray[1];
            //将HEX编码转成Base64
            var signatureOfBase64 = global.hexToBase64(seal);
            callback(signatureOfBase64);
        }
    },
    initSignatureData(data, callback) {
        global.createSign(JSON.stringify(data), callback);
    },
    createSign(data, cb) {
        var obj = window.document.getElementById("ocx");
        var result = obj.sign(data);
        var signArray = result.toArray();
        var signatureUrl = signArray[0];
        cb(signatureUrl);
    },
    // 动态加载js脚本文件
    loadScript(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        document.body.appendChild(script);
        callback();
    },
    printLog(context) {
        console.info(context);
    },
    websocket: {
        url: "",
        self: "",//websocket实例
        lockReconnect: false,//避免重复连接
        create(url, callback) {
            global.websocket.url = url;
            try {
                global.websocket.self = new WebSocket(url);
                global.websocket.initHandle(callback);
            } catch (e) {
                global.websocket.reconnect(url, callback);
            }
        },
        initHandle(callback) {
            global.websocket.self.onclose = function () {
                global.printLog("websocket close on " + new Date().Format("yyyy-MM-dd HH:mm:ss"));
                global.websocket.reconnect(global.websocket.url, callback);
            };
            global.websocket.self.onerror = function () {
                global.printLog("websocket error on " + new Date().Format("yyyy-MM-dd HH:mm:ss"));
                global.websocket.reconnect(global.websocket.url, callback);
            };
            global.websocket.self.onopen = function () {
                //心跳检测重置
                heartCheck.reset().start();
                global.printLog("websocket open on " + new Date().Format("yyyy-MM-dd HH:mm:ss"));
            };
            global.websocket.self.onmessage = function (event) {
                //如果获取到消息，心跳检测重置
                //拿到任何消息都说明当前连接是正常的
                heartCheck.reset().start();
                global.printLog("websocket message on " + new Date().Format("yyyy-MM-dd HH:mm:ss"));
                callback(event);
            }
        },
        reconnect(url, callback) {
            if (global.websocket.lockReconnect) return;
            global.websocket.lockReconnect = true;
            //没连接上会一直重连，设置延迟避免请求过多
            setTimeout(function () {
                global.websocket.create(url, callback);
                global.websocket.lockReconnect = false;
            }, 500);
        }
    }
}

export { global }

//浮点数加法
function floatAdd(arg1, arg2) {
    var r1, r2, m;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    return (arg1 * m + arg2 * m) / m;
}

function loadScript(url, callback) {
    var script = document.createElement("script")
    script.type = "text/javascript";
    if (script.readyState) { //IE 
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" ||
                script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else { //Others: Firefox, Safari, Chrome, and Opera 
        script.onload = function () {
            callback();
        };
    }
    script.src = url;
    document.body.appendChild(script);
}

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1,                 //月份   
        "d+": this.getDate(),                    //日   
        "H+": this.getHours(),                   //小时   
        "m+": this.getMinutes(),                 //分   
        "s+": this.getSeconds(),                 //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

String.prototype.Format = function () {
    if (this.length === 0) {
        return "";
    }
}

var heartCheck = {
    timeout: 30000,//30秒
    timeoutObj: null,
    serverTimeoutObj: null,
    reset: function () {
        clearTimeout(this.timeoutObj);
        clearTimeout(this.serverTimeoutObj);
        return this;
    },
    start: function () {
        var self = this;
        this.timeoutObj = setTimeout(function () {
            //这里发送一个心跳，后端收到后，返回一个心跳消息，
            //onmessage拿到返回的心跳就说明连接正常
            global.websocket.self.send("HeartBeat");
            global.printLog("Sending On " + new Date().Format("yyyy-MM-dd HH:mm:ss"));
            self.serverTimeoutObj = setTimeout(function () {//如果超过一定时间还没重置，说明后端主动断开了
                global.websocket.self.close();//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
            }, self.timeout)
        }, this.timeout)
    }
}