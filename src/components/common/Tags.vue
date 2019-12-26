<template>
    <div class="tags" v-if="showTags">
        <!-- <div v-if="downFlag" class="tagsMode" style="width:116px;position:absolute;top:30px;right:25px;z-index:999;overflow:hidden;text-align:center">
            <ul>
                <li class="tags-li" v-for="(item,index) in tagsData" :class="{'active': isActive(item.path)}" :key="index">
                    <router-link :to="item.path" class="tags-li-title">
                        {{item.title}}
                    </router-link>
                    <span class="tags-li-icon" @click="closeTags(index)"><i class="el-icon-close"></i></span>
                </li>
            </ul>
        </div> -->
        <div class="tag" id="tag">
            <ul>
                <li class="tags-li" v-for="(item,index) in tagsList" :class="{'active': isActive(item.path)}" :key="index">
                    <router-link :to="item.path" class="tags-li-title">
                        {{item.title}}
                    </router-link>
                    <span class="tags-li-icon" @click="closeTags(index,item)"><i class="el-icon-close"></i></span>
                </li>
            </ul>
        </div>
        <div class="tags-close-box">
            <el-dropdown @command="handleTags">
                <el-button size="mini" type="primary" class="butDown" >
                    标签选项<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu size="small" slot="dropdown" class="tagAll">
                    <el-dropdown-item command="other">关闭其他</el-dropdown-item>
                    <el-dropdown-item command="all">关闭所有</el-dropdown-item>
                    <!-- <el-dropdown-item command="showAll"> -->
                        <el-dropdown >
                        <el-dropdown-item>显示所有</el-dropdown-item>
                        <el-dropdown-menu slot="dropdown" class="tagAll showAll" :class="tagsData.length>num?'tagHeight':''">
                            <ul>
                                <li class="tags-li" v-for="(item,index) in tagsData" :class="{'active': isActive(item.path)}" :key="index">
                                    <router-link :to="item.path" class="tags-li-title">
                                        {{item.title}}
                                    </router-link>
                                    <span class="tags-li-icon" @click="closeTags(index,item)"><i class="el-icon-close"></i></span>
                                </li>
                            </ul>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
    import bus from './bus';
    export default {
        data() {
            return {
                tagsList: [],
                screenWidth:'',   // 这里是给到了一个默认值 （这个很重要）
                timer: false,
                tagsData: [],
                num: 5
            }
        },
        methods: {
            isActive(path) {
                return path === this.$route.fullPath;
            },
            //显示所有标签
            // showAll(){
            //     this.downFlag = true
            // },
            // 关闭单个标签
            closeTags(index,items) {
                // this.tagsList.forEach(res=>{
                //     if(res.title === item.title){
                //         this.tagsData.splice(index,1)[0]
                //     }
                // })
                this.tagsData.splice(index,1)[0]
                if(!this.tagsData.length){
                    this.$router.push('/');
                }
                this.tagsList.forEach((res,nums)=>{
                    if(res.title === items.title){
                        const delItem = this.tagsList.splice(nums, 1)[0];
                        if (item) {
                            delItem.path === this.$route.fullPath && this.$router.push(item.path);
                        }else{
                            this.$router.push('/');
                        }
                    }
                })
            },
            // 关闭全部标签
            closeAll(){
                this.tagsList = [];
                this.tagsData = [];
                this.$router.push('/');
            },
            // 关闭其他标签
            closeOther(){
                const curItem = this.tagsList.filter(item => {
                    return item.path === this.$route.fullPath;
                })
                this.tagsList = curItem;
                const curItems = this.tagsData.filter(item => {
                    return item.path === this.$route.fullPath;
                })
                this.tagsData = curItems;
            },
            // clickMode(){
            //     this.tagsList = this.tagsData
            // },
            // 设置标签
            setTags(route){
                let i = 0
                if(this.tagsData.length == 0){
                    this.tagsData.push({
                        title: route.meta.title,
                        path: route.fullPath,
                    })
                }else{
                    this.tagsData.forEach(item=>{
                        if(item.title != route.meta.title){
                            i++
                        }
                        if(i==this.tagsData.length){
                            this.tagsData.push({
                                title: route.meta.title,
                                path: route.fullPath,
                            })
                        }
                    })
                }
                const isExist = this.tagsList.some(item => {
                    return item.path === route.fullPath;
                })
                this.num = Math.floor(this.screenWidth / 110)
                if(!isExist){
                    if(this.num != 0){
                        if(this.tagsList.length >= this.num){
                            // this.downFlag = true
                            // this.$("#showAll").css("height", "200px");
                           
                            this.tagsList.shift()
                        }
                    }
                    this.tagsList.push({
                        title: route.meta.title,
                        path: route.fullPath,
                        // name: route.matched[1].name
                    })
                }
                // console.log(this.tagsList)
                bus.$emit('tags', this.tagsList);
            },
            handleTags(command){
                // if(command === 'other'){
                //     this.closeOther()
                // }else if(command === 'showAll'){
                //     this.showAll()
                // }else{
                //     this.closeAll()
                // }
                command === 'other' ? this.closeOther() : this.closeAll();
            }
        },
        computed: {
            showTags() {
                return this.tagsList.length > 0;
            }
        },
        watch:{
            $route(newValue, oldValue){
                this.setTags(newValue);
            },
            screenWidth (val) {
                if (!this.timer) {
                    this.screenWidth = val
                    this.num = Math.floor(this.screenWidth / 110)
                    this.timer = true
                    let that = this
                    setTimeout(function () {
                        // that.screenWidth = that.$store.state.canvasWidth
                        console.log(that.screenWidth)
                        that.timer = false
                    }, 400)
                }
            }
        },
        created(){
            this.setTags(this.$route);
            // 监听关闭当前页面的标签页
            bus.$on('close_current_tags', () => {
                for (let i = 0, len = this.tagsList.length; i < len; i++) {
                    const item = this.tagsList[i];
                    if(item.path === this.$route.fullPath){
                        if(i < len - 1){
                            this.$router.push(this.tagsList[i+1].path);
                        }else if(i > 0){
                            this.$router.push(this.tagsList[i-1].path);
                        }else{
                            this.$router.push('/');
                        }
                        this.tagsList.splice(i, 1);
                        break;
                    }
                }
            })
        },
        mounted(){
            this.screenWidth = document.querySelector("#tag").clientWidth
            const that = this
            window.onresize = () => {
                return (() => {
                    window.screenWidth = document.querySelector("#tag").clientWidth
                    that.screenWidth = window.screenWidth
                })()
            }
        }
    }

</script>

<style>
    .tags {
        position: relative;
        height: 30px;
        /* overflow: hidden; */
        background: #fff;
        padding-right: 120px;
        box-shadow: 0 5px 10px #ddd;
    }
    .tag{
        width:100%;
        overflow: hidden;
        /* overflow-x: auto;
        overflow-y: hidden; */
        height: 30px;
    }
    /*  */
    .tag ul {
        box-sizing: border-box;
        /* display:inline;
        white-space: nowrap; */
    }

    .tags-li {
        /* float: left; */
        margin: 3px 5px 2px 3px;
        border-radius: 3px;
        font-size: 12px;
        overflow: hidden;
        cursor: pointer;
        height: 23px;
        line-height: 23px;
        border: 1px solid #e9eaec;
        background: #fff;
        padding: 0 5px 0 12px;
        vertical-align: middle;
        color: #666;
        -webkit-transition: all .3s ease-in;
        -moz-transition: all .3s ease-in;
        transition: all .3s ease-in;
        display: inline-block;
        white-space:nowrap;
    }

    .tags-li:not(.active):hover {
        background: hsl(0, 15%, 90%);
        /* background: red */
    }

    .tag-li.active {
        color: #fff;
    }

    .tags-li-title {
        float: left;
        max-width: 80px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-right: 5px;
        color: #666;
    }

    .tags-li.active .tags-li-title {
        color: #fff;
    }

    .tags-close-box {
        position: absolute;
        right: 12px;
        top: 0;
        box-sizing: border-box;
        padding-top: 1px;
        text-align: center;
        width: 110px;
        height: 30px;
        background: #fff;
        box-shadow: -3px 0 15px 3px rgba(0, 0, 0, .1);
        z-index: 10;
    }
    .tags-li-icon:hover{
        background: #f3f3f3;
        border-radius: 50%;
    }
    .tagAll{
        width:116px;
        text-align:center
    }
    .showAll{
        overflow-y:auto
    }
    .tagHeight{
        height:300px
    }
    /*滚动条整体样式*/
    .showAll::-webkit-scrollbar {
        width: 5px;    
        height: 0;
    }
    /*滚动条里面轨道*/
    .showAll::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 10px;
        background: #EDEDED;
    }
    .butDown{
        padding:7px 24px
    }
</style>
