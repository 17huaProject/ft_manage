<template>
    <div id="VerificationListArea">
        <div id="mykhxxx_info">没有该部分信息</div>
        <div class="top_func">
            <input placeholder="请输入票码或手机" v-model="vinputIn" type="tel">
            <img class="search_img" src="../../static/obj_img/home_icon_search.png">
            <div class="scan_div" @click="cantRunSCQR">
                <img src="../../static/obj_img/scan_img/hexiao_2wm_icon.png">
                <div>扫码</div>
            </div>
        </div>
        <div class="VerificationListType">
            <div class="V_type_button" :class="onSelectBarColor(1)" @click="buttomCOn=1">全部订单</div>
            <div class="V_type_button" :class="onSelectBarColor(2)" @click="buttomCOn=2">未核销</div>
            <div class="V_type_button" :class="onSelectBarColor(3)" @click="buttomCOn=3">已核销</div>
        </div>
        <div id="VerificationListBox" v-show="buttomCOn<3">
            <div class="VerificationListSpace" @click="findOrderInArray(item.ticket_code)" v-if="item.used_flag==0" v-show="item.ticket_code.indexOf(vinputIn)>=0||item.use_phone.indexOf(vinputIn)>=0" :key="'canC'+index" v-for="(item,index) in listInfoMain">
                <img class="V_select_statue" :src="setImgInSelect(item.ticket_code)">
                <div class="V_info_box">
                    <div>票码：{{item.ticket_code}}
                        <span>未核销</span>
                    </div>
                    <div>姓名：{{item.realname}}&emsp;&emsp;手机号：{{item.use_phone}}</div>
                </div>
            </div>
            <!-- <div class="VerificationListSpace" @click="findOrderInArray(399223444422)" v-show="'399223444422'.indexOf(vinputIn)>=0">
                                    <img class="V_select_statue" :src="setImgInSelect(399223444422)">
                                    <div class="V_info_box">
                                        <div>票码：399223444422
                                            <span>未核销</span>
                                        </div>
                                        <div>姓名：阿凡提&emsp;&emsp;手机号：18133344443</div>
                                    </div>
                                </div>
                                <div class="VerificationListSpace" @click="findOrderInArray(399223444423)" v-show="'399223444423'.indexOf(vinputIn)>=0">
                                    <img class="V_select_statue" :src="setImgInSelect(399223444423)">
                                    <div class="V_info_box">
                                        <div>票码：399223444423
                                            <span>未核销</span>
                                        </div>
                                        <div>姓名：阿凡提&emsp;&emsp;手机号：18133344443</div>
                                    </div>
                                </div> -->
        </div>
        <div id="VerificationListBox_c" v-show="buttomCOn!=2">
            <div class="VerificationListSpace" v-if="item.used_flag==1" v-show="item.ticket_code.indexOf(vinputIn)>=0||item.use_phone.indexOf(vinputIn)>=0" :key="'catC'+index" v-for="(item,index) in listInfoMain">
                <div class="V_select_statue_box"></div>
                <div class="C_info_box">
                    <div>票码：{{item.ticket_code}}
                        <span>已核销</span>
                    </div>
                    <div>姓名：{{item.realname}}&emsp;&emsp;手机号：{{item.use_phone}}</div>
                </div>
            </div>
            <!-- <div class="VerificationListSpace" v-show="'399223444425'.indexOf(vinputIn)>=0">
                                    <div class="V_select_statue_box" ></div>
                                    <div class="C_info_box">
                                        <div>票码：399223444425
                                            <span>已核销</span>
                                        </div>
                                        <div>姓名：阿凡提&emsp;&emsp;手机号：18133344443</div>
                                    </div>
                                </div> -->
        </div>
        <div id="VerificationFunctionArea" v-show="buttomCOn!=3">
            <div id="VerificationFunctionArea_show">
                <!-- <img src="../../static/obj_img/buy_contacts_icon_2.png"> 全选 -->
                <div>已选中&nbsp;
                    <span>{{selectTagInArray.length}}</span>&nbsp;个订单</div>
                &nbsp;
                <div style="text-decoration:underline;color:#ff604f" @click="loginOut">注销账户</div>
            </div>
            <div id="VerificationFunctionArea_button" v-show="selectTagInArray.length>0" @click="verificationClick()">
                核销
            </div>
            <div id="VerificationFunctionArea_button_dis" v-show="selectTagInArray.length==0">
                核销
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            buttomCOn: 1,
            listInfoMain: [
                // { 'statue': false, 'vcode': '399223444421', 'vname': '阿凡提2', 'vcell': '18133344131' },
                // { 'statue': false, 'vcode': '399223444422', 'vname': '阿凡提3', 'vcell': '18133344132' },
                // { 'statue': true, 'vcode': '399223444423', 'vname': '阿凡提4', 'vcell': '18133344133' },
                // { 'statue': true, 'vcode': '399223444424', 'vname': '阿凡提5', 'vcell': '18133344134' },
                // { 'statue': true, 'vcode': '399223424425', 'vname': '阿凡提2', 'vcell': '18133344135' },
                // { 'statue': true, 'vcode': '399223444426', 'vname': '阿凡提3', 'vcell': '18133344136' },
                // { 'statue': false, 'vcode': '399223444427', 'vname': '阿凡提4', 'vcell': '18133344137' },
            ],
            selectTagInArray: [],
            vinputIn: '',
        }
    },
    created() {
        this.getnewAledList();
    },
    watch: {
        findNumber(val) {
            this.vinputIn = val.split('-')[0]
        }
    },
    computed: {
        findNumber() {
            return this.$store.state.ScanNumber
        }
    },
    methods: {
        getnewAledList() {
            let listC = {
                access_token: this.$store.state.usrInfomation.access_token
            }
            this.$store.commit('ConectionPara', listC)
            let getString = this.$store.state.getParamString;
            let postString = getString.replace('?', '');
            this.$http.get(this.$store.state.serverHost + '/yqhbsp/insys/showTicketList' + getString).then(m => this.runDefD(m.data)).catch(r => console.log(r));
        },
        loginOut(){
             localStorage.removeItem('SYS_17hua_Manage')
             this.$router.replace({ path: '/' })
        },
        findOrderInArray(setInde) {
            let m = this.selectTagInArray.indexOf(setInde);
            m < 0 ? this.selectTagInArray.push(setInde) : this.selectTagInArray.splice(m, 1);
        },
        setImgInSelect(setInde) {
            return this.selectTagInArray.indexOf(setInde) >= 0 ? '../../static/obj_img/buy_contacts_icon_1.png' : '../../static/obj_img/buy_contacts_icon_2.png'
        },
        runDefD(data) {
            if (data.errcode == 200) {
                this.listInfoMain = data.records
            } else {
                this.$router.replace({ path: '/' })
            }

        },
        cantRunSCQR() {
            this.$store.commit('runScanQRCodeFun')
        },
        verificationClick() {
            let checkTicket = {
                ticket_code: this.selectTagInArray.length > 1 ? this.selectTagInArray.join(",") : this.selectTagInArray[0],
                event_id: this.listInfoMain[0].event_id,
                access_token: this.$store.state.usrInfomation.access_token
            }
            this.$store.commit('ConectionPara', checkTicket)
            let getString = this.$store.state.getParamString;
            let postString = getString.replace('?', '');
            this.$http.get(this.$store.state.serverHost + '/yqhbsp/insys/checkTicket' + getString).then(m => this.rmtGIt(m.data)).catch(r => console.log(r));
        },
        rmtGIt(data) {
            if (data.errcode == 200) {
                this.$toast.center('核销成功')
                this.selectTagInArray = [];
                this.vinputIn = '';
                let listC = {
                    access_token: this.$store.state.usrInfomation.access_token
                }
                this.$store.commit('ConectionPara', listC)
                let getString = this.$store.state.getParamString;
                let postString = getString.replace('?', '');
                this.$http.get(this.$store.state.serverHost + '/yqhbsp/insys/showTicketList' + getString).then(m => this.runDefD(m.data)).catch(r => console.log(r));
            } else {
                this.$toast.center(data.errmsg)
            }
        },
        onSelectBarColor(num) {
            return num === this.buttomCOn ? 'OnCttss' : 'DisCttss'
        },
    }
}
</script>

<style>
body {
    background-color: #f5f5f5;
}

#mykhxxx_info {
    position: absolute;
    width: 100%;
    text-align: center;
    height: 40px;
    line-height: 40px;
    color: #333333;
    top: 120px;
    z-index: -1;
}

#VerificationListArea,
#VerificationListBox,
#VerificationListBox_c {
    width: 100%;
    float: left;
}

#VerificationListBox_c {
    padding-bottom: 70px;
}

.OnCttss {
    background-color: #5699ff;
    color: #fff
}

.DisCttss {
    background-color: #ffffff;
    color: #666666
}

.top_func {
    float: left;
    display: flex;
    display: -webkit-flex;
    align-items: center;
    -webkit-align-items: center;
    width: 94.2%;
    padding: 0 2.9%;
    height: 50px;
    background-color: #ffffff;
}

.top_func input {
    flex: 1;
    -webkit-flex: 1;
    -webkit-border-top-left-radius: 50px;
    -webkit-border-bottom-left-radius: 50px;
    font-size: 16px;
    border: 0;
    margin: 0 -1px 0 0;
    padding: 0 0 0 3.4%;
    background-color: #f2f2f2;
    height: 30px;
    line-height: 30px;
    outline: none;
}

.search_img {
    -webkit-border-top-right-radius: 50px;
    -webkit-border-bottom-right-radius: 50px;
    font-size: 16px;
    border: 0;
    background-color: #f2f2f2;
    width: 20px;
    height: 20px;
    padding: 5px 3.4%;
}

.scan_div {
    margin-left: 2.9%;
    display: flex;
    align-items: center;
    font-size: 12px;
}

.scan_div img {
    width: 28px;
    height: 28px;
}

.scan_div div {
    width: 10px;
    -webkit-transform: scale(0.8);
    margin-left: 3px;
}

.VerificationListType {
    width: 93.4%;
    padding: 3.3%;
    display: flex;
    align-items: center;
}

.V_type_button {
    padding: 5px 15px;
    height: 20px;
    line-height: 20px;
    margin-right: 3.3%;

    border-radius: 50px;
}

.VerificationListSpace {
    width: 93.4%;
    padding: 3.3%;
    margin-bottom: 1.8%;
    background-color: #ffffff;
    display: flex;
    align-items: center;
}

.V_select_statue {
    width: 30px;
    height: 30px;
    margin-right: 3.3%;
}

.V_select_statue_box {
    width: 30px;
    height: 30px;
    margin-right: 3.3%;
}

.V_info_box {
    flex: 1;
    font-size: 14px;
    color: #666666;
}

.V_info_box span {
    font-size: 12px;
    color: #ff604f;
}

.V_info_box div:first-child {
    padding-bottom: 3.3%;
    border-bottom: 1px solid #eeeeee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.V_info_box div:last-child {
    padding-top: 3.3%;
    font-size: 12px;
    align-items: center;
}

.C_info_box {
    flex: 1;
    font-size: 14px;
    color: #666666;
}

.C_info_box span {
    font-size: 12px;
    color: #333333;
}

.C_info_box div:first-child {
    padding-bottom: 3.3%;
    border-bottom: 1px solid #eeeeee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.C_info_box div:last-child {
    padding-top: 3.3%;
    font-size: 12px;
    align-items: center;
}

#VerificationFunctionArea {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 56px;
    width: 100%;
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
}

#VerificationFunctionArea_show {
    padding: 10px;
    height: 36px;
    flex: 1;
    display: flex;
    align-items: center;
}

#VerificationFunctionArea_show div {
    font-size: 12px;
    margin-left: 10px;
    display: flex;
    align-items: center;
}

#VerificationFunctionArea_show div span {
    color: #ff604f;
}

#VerificationFunctionArea_show img {
    width: 36px;
    height: 36px;
    padding-right: 10px;
}

#VerificationFunctionArea_button {
    width: 140px;
    background-color: #ff604f;
    color: #ffffff;
    line-height: 56px;
    text-align: center;
}

#VerificationFunctionArea_button_dis {
    width: 140px;
    background-color: #999999;
    color: #666666;
    line-height: 56px;
    text-align: center;
}
</style>
