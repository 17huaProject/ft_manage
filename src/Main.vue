<template>
    <div>
    </div>
</template>

<script>
export default {
    mounted() {
        let share = {
            sharetitle: '我喜欢这个绘画活动，你也去一起画吧',
            sharelink: 'wx.17hua.me',
            shareimgUrl: 'http://wx.17hua.me/static/obj_img/logo_for_share.png',
            shareDesc: '创建独一无二的作品！'
        }
        this.$store.commit('useShareFun', share)
        this.$router.replace({ path: '/list' })
    }
}
</script>

<style>

</style>
