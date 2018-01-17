<template>
    <div id="ManagerRegister">
        <div id="ManagerRegisterTitle">
            <img src="../../static/obj_img/scan_img/hexiao_logo.png"> 后台系统
        </div>
        <div class="RegisterLoginLine">
            <div>用户名：</div>
            <input v-model="usrName_login" maxlength="30">
            <img src="../../static/obj_img/scan_img/Combined Shape.png" @click="cleanInputInfo(1)" v-show="usrName_login.length>0">
        </div>
        <div class="RegisterLoginLine">

        </div>
        <div class="RegisterLoginLine">
            <div>密码</div>
            <input v-model="usrPasw_login" maxlength="30" type="password">
            <img src="../../static/obj_img/scan_img/Combined Shape.png" @click="cleanInputInfo(2)" v-show="usrPasw_login.length>0">
        </div>
        <div id="RegisterLoginButton" ><div @click="getOtherPageAndSave()">保存账户并登录</div><div @click="getOtherPage()">登录</div></div>
        <div id="RegisterLoginForget">忘记密码？</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            usrName_login: '',
            usrPasw_login: ''
        }
    },
    created(){
        let loginSign = JSON.parse(localStorage.getItem('SYS_17hua_Manage'))
        if(loginSign){
            let up = {
                username: loginSign.username,
                password: loginSign.password
            }
            this.$store.commit('ConectionPara', up)
            let getString = this.$store.state.getParamString;
            let postString = getString.replace('?', '');
            this.$http.get(this.$store.state.serverHost + '/yqhbsp/insys/login' + getString).then(m => this.runDef(m.data)).catch(r => console.log(r));
        }
    },
    methods: {
        getOtherPage() {
            if(this.usrName_login.length<4||this.usrPasw_login.length<6){
                this.$toast.center('请输入正确')
                return false
            }
            let up = {
                username: this.usrName_login,
                password: this.usrPasw_login
            }
            this.$store.commit('ConectionPara', up)
            let getString = this.$store.state.getParamString;
            let postString = getString.replace('?', '');
            this.$http.get(this.$store.state.serverHost + '/yqhbsp/insys/login' + getString).then(m => this.runDef(m.data)).catch(r => console.log(r));
        },
        getOtherPageAndSave() {
            localStorage.removeItem('SYS_17hua_Manage')
            if(this.usrName_login.length<4||this.usrPasw_login.length<6){
                this.$toast.center('请输入正确')
                return false
            }
            let up = {
                username: this.usrName_login,
                password: this.usrPasw_login
            }
            localStorage.setItem('SYS_17hua_Manage',JSON.stringify(up))
            this.$store.commit('ConectionPara', up)
            let getString = this.$store.state.getParamString;
            let postString = getString.replace('?', '');
            this.$http.get(this.$store.state.serverHost + '/yqhbsp/insys/login' + getString).then(m => this.runDef(m.data)).catch(r => console.log(r));
        },
        runDef(data){
            if(data.errcode===200){
                this.$store.commit('getBaseUsrInfo', data.record)
                this.$router.replace({ path: '/vl' })
            }else{
                this.$toast.center(data.errmsg)
            }
        },
       
        cleanInputInfo(num) {
            num == 1 ? this.usrName_login = '' : this.usrPasw_login = ''
        }
    }
}
</script>

<style>
#ManagerRegister {
    width: 100%;
    float: left;
    background: url('../../static/obj_img/scan_img/bj_manager.png');
    background-size: cover;
    min-height: 100vh;
}

#ManagerRegisterTitle {
    padding: 30% 3.3% 15% 3.3%;
    width: 93.4%;
    color: #ffffff;
    display: flex;
    align-items: flex-end;
}

#ManagerRegisterTitle img {
    height: 40px;
    margin-right: 3.3%;
}

.RegisterLoginLine {
    display: flex;
    align-items: center;
    padding: 3.3%;
    width: 93.4%;
    color: #ffffff;
}

.RegisterLoginLine div {
    width: 66px;
}

.RegisterLoginLine input {
    background-color: transparent;
    border: 0;
    padding: 0;
    border-bottom: 1px solid #eeeeee;
    flex: 1;
    outline: none;
    font-size: 16px;
    color: #ffffff;
    padding-bottom: 4px;
    margin-bottom: -4px;
    border-radius: 0;
}

.RegisterLoginLine img {
    width: 18px;
    height: 18px;
    margin-left: -18px;
}

#RegisterLoginButton {
    width: 93.4%;
    margin: 38% 3.3% 3.3% 3.3%;
    color: #ffffff;
    text-align: center;
    border-radius: 3px;
    display: flex;
    align-items: center;
}
#RegisterLoginButton div{
    flex: 1;
    margin: 5px;
    padding: 10px;
    color: #ff604f;
    text-align: center;
    border-radius: 3px;
    box-shadow: 0 0 0 1px #ff604f;
}
#RegisterLoginButton div:first-child{
    background-color: #ff604f;
    color: #ffffff;
}
#RegisterLoginForget {
    padding: 0 3.3%;
    width: 93.4%;
    color: #ff604f;
    text-align: right;
}
</style>
