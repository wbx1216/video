<template>
	<div class="container_box" id="video_box" >
		<!--vant van-swipe 滑动组件 -->
		<swiper :options="swiperOption" class="product_swiper">
			<swiper-slide v-for="(item, index) in videoList" :key="index" class="product_swiper">
				<div class="type1" v-show="item.type==1">
					<div class="video_container">
						<a :href="ad3" v-if="ad3" class="floatAD"><img src="../assets/gif.gif" style="width:40px;margin-right: 5px;">小雨给你发了一条消息 </a>

						<!--video属性
						webkit-playsinline ios 小窗播放，使视频不脱离文本流，安卓则无效
						微信内置x5内核，
						x5-video-player-type="h5-page" 启用H5播放器,是wechat安卓版特性，添加此属性，微信浏览器会自动将视频置为全屏
						x5-video-player-fullscreen="true" 全屏设置，设置为 true 是防止横屏
						x5-video-orientation 控制横竖屏 landscape 横屏，portrain竖屏； 默认portrain
						poster：封面
						src：播放地址
						-->
						<video class="video_box" :muted="isiOS" loop webkit-playsinline x5-video-player-type="h5-page"
						 x5-video-player-fullscreen="true" playsinline preload="auto"  :src="item.url" :playOrPause="playOrPause"
						 @click="pauseVideo" @ended="onPlayerEnded($event)">
						</video>

						<!-- 封面 -->
						<!-- <img v-show="iconPlayShow" class="play" @click="playvideo" :src="item.pic" /> -->
						<!-- 播放暂停按钮 -->
						<img v-show="iconPlayShow" class="icon_play" @click="playvideo" src="http://npjy.oss-cn-beijing.aliyuncs.com/images/file-1575340653940esdHR.png" />
					</div>
					<!-- 右侧头像、点赞、评论、分享功能 -->
					<div class="tools_right">
						<div class="tools_r_li" v-show="href">
							<a :href="href"><img src="../assets/hongbao.gif" style="width:50px;"> </a>
						</div>
						<div class="tools_r_li" @click="changeFabulous(item,index)">
							<i class="iconfont icon-shoucang icon_right" :class="item.fabulous?'fabulous_active':''"></i>
							<div class="tools_r_num">{{item.like}}</div>
						</div>
						<div class="tools_r_li" @click="changeShare">
							<i class="iconfont icon-iconfontforward icon_right"></i>
							<div class="tools_r_num">转发</div>
						</div>
						<div class="tools_r_li" @click="muted" v-if="!isAndroid">
							<i class="iconfont  icon_right" :class="isiOS?'icon-mute':'icon-mute2'"></i>
							<div class="tools_r_num" v-show="isiOS">静音</div>
							<div class="tools_r_num" v-show="!isiOS">音量</div>
						</div>
					</div>
					<div class="content" v-show="isiOS">
						<img src="../assets/laba.gif">
					</div> 
					<!-- 底部作品描述 -->
					<div class="production_box">
						{{ item.name }}
					</div>
				</div>
				<div :id="item.id" class="ad" v-if="item.type==2">
					<div :id="item.id+'_1'" class="topAD"></div>
					<div :id="item.id+'_2'" class="bottomAD"></div>
					<div :id="item.id+'_4'" class="bottomAD"></div>
				</div>
			</swiper-slide>
		</swiper>
		<div v-show="first==1" @click="first=0">
			<div class="cover"></div> 
			 <div class="qt" id="qt"></div>
		</div>
		
		<div v-show="copy">
			<div class="copy" >
				<img src="../assets/close.png" class="close" @click="copy=false">
				<div>链接复制成功</div>
				<div id="copyId"></div> 
			</div>
			<div class="cover"></div>
		</div>
	</div>
</template>
<script>
	let vm = null
	import Vue from "vue";
	import {
		swiper,
		swiperSlide
	} from 'vue-awesome-swiper'
	let videoProcessInterval;
	export default {
		name: 'home',
		components: {
			swiper,
			swiperSlide
		},
		data() {
			let u = navigator.userAgent;
			return {
				ad1: "",
				ad2: "",
				ad3: "",
				ad4:"",
				href: "",
				current: 0,
				videoList: [],
				isVideoShow: true,
				playOrPause: true,
				video: null,
				first: 1,
				iconPlayShow: true,
				isAndroid: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, // android终端
				isiOS: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
				tabIndex: 0,
				showShareBox: false, //展示分享框
				commentPop: false, //是否展示评论弹框
				// 评论相关
				comment_text: '', //评论输入内容
				canSend: false, //是否可以发送
				videoComment: [],
				commentPlaceholder: '留下你精彩的评论吧', //评论Placeholder
				replayUserData: '',
				to_comment_id: '',
				videoProcess: 0, //视频播放进度
				swiperOption: {
					direction: "vertical",
					on: {
						slideChangeTransitionEnd: function() {
							// vm.index = this.realIndex 
							vm.onChange(this.realIndex)
						}
					}
				},
				cid: "",
				// score: "",
				copy:false,
				source:"" 
			}
		},
		created() {
			vm = this
			this.height = document.documentElement.clientHeight
			this.cid = this.$route.query.cid
		    this.source=this.$route.query.source||this.source
			this.$axios.get("/getOrderVideoArray.htm?num=3&source="+this.source).then(res => {
				console.log(res)
				let data = res.data.data
				this.videoList = data
				// let score
				// if (data[0].score > data[1].score) {
				// 	score = data[0].score
				// } else {
				// 	score = data[1].score
				// }
				// score = score > data[2].score ? score : data[2].score
				// this.score = score
			})
			this.$axios.get("/api/getAdvs.htm?cid=" + this.cid).then(res => {
				let data = res.data.jsAdvdata
				if (data) {
					this.ad3 = data.p6
					this.ad1 = data.p1
					this.ad2 = data.p4
					this.href = data.p5
					this.firstAd("qt",data.p7)
					this.firstAd("copyId",data.p8) 
					this.ad4=data.p9
				}
			})
		},
		methods: {
			changeFabulous(item, index) {
				this.videoList[index].fabulous = !this.videoList[index].fabulous
			},
			muted() {
				console.log(this.isiOS)
				this.isiOS = !this.isiOS
			},
			//展示分享弹窗
			changeShare() {
				this.copyUrl()
			},
			//滑动改变播放的视频
			onChange(index) {
				//改变的时候 暂停当前播放的视频     
				clearInterval(videoProcessInterval)
				if (index == this.videoList.length - 2) {
					this.$axios.get("/getOrderVideoArray.htm?num=3&&source=" + this.source).then(res => {
						console.log(res)
						let data = res.data.data
						let html = {
							type: 2,
							id: 'ad' + index
						}
						this.videoList.push(html)
						setTimeout(function() {
							vm.ad(html.id)
						})
						this.videoList = this.videoList.concat(data)
						// let score
						// if (data[0].score > data[1].score) {
						// 	score = data[0].score
						// } else {
						// 	score = data[1].score
						// }
						// score = score > data[2].score ? score : data[2].score
						// this.score = score
					})
				}
				let video = document.querySelectorAll('video')[this.current];
				if (this.videoList[this.current].type == 1) {
					video.pause();
				}
				this.playOrPause = false;
				this.showShareBox = false;
				this.current = index;
				//切换直接自动播放下一个
				this.isVideoShow = false;
				setTimeout(() => {
					this.pauseVideo()
				}, 100)
			},
			// 开始播放
			playvideo(event) {
				let video = document.querySelectorAll('video')[this.current];
				this.isVideoShow = false;
				this.iconPlayShow = false;
				this.showShareBox = false;
				video.play();
				window.onresize = function() {
					video.style.width = window.innerWidth + "px";
					video.style.height = window.innerHeight + "px";
				}
				videoProcessInterval = setInterval(() => {
					this.changeProcess(video)
				}, 100)
			},
			pauseVideo() { //暂停\播放
				let video = document.querySelectorAll('video')[this.current];
				if (this.playOrPause) {
					console.log("pauseVideo" + this.current);
					video.pause();
					this.iconPlayShow = true;
					clearInterval(videoProcessInterval)
				} else {
					console.log("playVideo" + this.current);
					video.play();
					this.iconPlayShow = false;
					videoProcessInterval = setInterval(() => {
						this.changeProcess(video)
					}, 100)
				}
				this.playOrPause = !this.playOrPause;
				this.showShareBox = false;
			},
			//记录播放进度
			changeProcess() {
				let video = document.querySelectorAll('video')[this.current];
				let currentTime = video.currentTime.toFixed(1);
				let duration = video.duration.toFixed(1);
				this.videoProcess = parseInt((currentTime / duration).toFixed(2) * 100)
			},
			onPlayerEnded(player) { //视频结束
				this.isVideoShow = true
				this.current += this.current
			},
			//复制当前链接
			copyUrl() {
				let httpUrl = window.location.href;
				var oInput = document.createElement('input');
				oInput.value = httpUrl;
				document.body.appendChild(oInput);
				oInput.select(); // 选择对象
				document.execCommand("Copy"); // 执行浏览器复制命令
				oInput.className = 'oInput';
				oInput.style.display = 'none'; 
				this.copy=true;
			},
			ad(id) {
				let id1 = id + "_1"
				let id2 = id + "_2"
				let id4 = id + "_4"
				let code1 = this.ad1
				let code2 = this.ad2
				let code4 = this.ad4
				if (code1.indexOf("d=m") != -1) {
					var j = document.createElement("script");
					j.type = "text/javascript";
					j.setAttribute("src", "//www.smucdn.com/smu0/o.js");
					j.setAttribute("smua", this.ad1);
					document.getElementById(id1).appendChild(j);
				} else {
					let sogou_div1 = document.getElementById(id1);
					window.sogou_un = window.sogou_un || [];
					window.sogou_un.push({
						id: code1,
						ele: sogou_div1  
					});
				}
				if (code2.indexOf("d=m") != -1) {
					var i = document.createElement("script");
					i.type = "text/javascript";
					i.setAttribute("src", "//www.smucdn.com/smu0/o.js");
					i.setAttribute("smua", this.ad2);
					document.getElementById(id2).appendChild(i);
				} else {
					let sogou_div2 = document.getElementById(id2);
					window.sogou_un = window.sogou_un || [];
					window.sogou_un.push({
						id: code2,
						ele: sogou_div2
					});
				}   
				if (code4.indexOf("d=m") != -1) {
					var i = document.createElement("script");
					i.type = "text/javascript";
					i.setAttribute("src", "//www.smucdn.com/smu0/o.js");
					i.setAttribute("smua", this.ad4);
					document.getElementById(id4).appendChild(i);
				} else {
					let sogou_div4 = document.getElementById(id4);
					window.sogou_un = window.sogou_un || [];
					window.sogou_un.push({
						id: code4,
						ele: sogou_div4
					});
				} 
			},
			firstAd(id,ad){ 
				if(ad){
					if (ad.indexOf("d=m") != -1) {
						var j = document.createElement("script");
						j.type = "text/javascript";
						j.setAttribute("src", "//www.smucdn.com/smu0/o.js");
						j.setAttribute("smua", ad);
						document.getElementById(id).appendChild(j);
					} else {
						let sogou_div1 = document.getElementById(id);
						window.sogou_un = window.sogou_un || [];
						window.sogou_un.push({
							id: ad,
							ele: sogou_div1
						});
					}
				}
				
			}
		}
	}
</script>
<style scoped>
	.clear {
		clear: both;
	}

	.video-player {
		height: 100%;
		width: 100vw;
	}

	.product_swiper {
		width: 100vw;
		height: 100%;
	}

	.van_swipe {
		width: 100vw;
		height: 100%;
		max-width: 550px;
		margin: 0 auto;
		position: relative;
	}

	.van-swipe {
		width: 100%;
		height: 100%;
	}

	.container_box {
		width: 100vw;
		height: 100vh;
		background: #000;
	}

	.video_box {
		object-fit: fill !important;
		z-index: 999;
		width: 100%;   
		position: absolute;
		right:0;
		margin:auto;
		bottom:0;
		left: 0;
		top: 0;
		overflow: hidden;
	}

	 

	.icon_play {
		position: absolute;
		top: 44%;
		right: 0;
		left: 0;
		bottom: auto;
		margin: auto;
		z-index: 999;
		height: 60px;
		background: rgba(0, 0, 0, 0.5);
		border-radius: 50%;
	}

	.play,
	.platStart {
		position: absolute;
		right:0;
		margin:auto;
		bottom:0;
		left: 0;
		top: 0;
		width:100%;
		z-index: 999;
	}

	/*头像， 点赞，转发 */
	.tag_image {
		width: 50px;
		height: 50px;
		border: 1px solid #fff;
		box-sizing: border-box;
		border-radius: 50%;
		margin-bottom: 20px;
		position: relative;
		box-shadow: 0px 0px 10px #9d9d9d;
	}

	.tag_add {
		position: absolute;
		bottom: 12px;
		left: 0;
		right: 0;
		border-radius: 67px;
		display: inline-block;
		width: 18px;
		height: 18px;
		line-height: 18px;
		margin: 0 auto;
		z-index: 1;
		font-size: 20px;
		color: #f44;
		background: #fff;
	}

	.tag_dui {
		position: absolute;
		bottom: 12px;
		left: 0;
		right: 0;
		border-radius: 67px;
		display: inline-block;
		width: 20px;
		height: 20px;
		line-height: 20px;
		margin: 0 auto;
		z-index: 1;
		font-size: 11px;
		color: #f44;
		background: #fff;
	}

	.cover {
		background: rgba(0, 0, 0, 0.6);
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		width: 100%;
		height: 100%;
		bottom: 0;
		z-index: 998;
	}

	.tag_dui_active {
		opacity: 0;
		animation: showFollow 1.4s ease-in-out 0s;
	}

	.tag_add_num {
		position: absolute;
		bottom: 0px;
		left: 0;
		right: 0;
	}

	@keyframes showFollow {
		0% {
			opacity: 1;
			color: #fff;
			background: #F44;
			transform: rotate(-180deg) scale(1);
		}

		35% {
			opacity: 1;
			color: #f44;
			background: #fff;
			transform: rotate(0deg) scale(1.2);
		}

		80% {
			opacity: 1;
			color: #f44;
			transform: scale(1.2);
		}

		100% {
			opacity: 0;
			display: none;
			color: #f44;
			transform: scale(0);
		}
	}

	.tools_right {
		z-index: 1001;
		position: absolute;
		right: 16px;
		bottom: 100px
	}

	.tools_r_li {
		margin-bottom: 20px;
		color: #fff;
		font-size: 14px;
		position: relative;
	}

	.tools_r_li:last-child {
		margin-bottom: 0px;
	}

	.icon_right {
		margin-bottom: 5px;
		font-size: 24px;
		display: block;
		text-shadow: 0px 0px 10px #9d9d9d;
		/*transition: .5s;*/
	}

	.production_box {
		z-index: 1001;
		position: absolute;
		/* right: 16px; */
		bottom: 20px;
		text-align: left;
		padding: 0 15px;
		color: #fff;
		width: 100%;
		left: 0;
		box-sizing: border-box;

	}

	.production_name {
		font-weight: 700;
		font-size: 18px;
		margin-bottom: 10px;
	}

	.production_des {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		min-height: 62px;
		font-size: 13px;
	}

	.container_bottom {
		position: fixed;
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0.85);
		height: 48px;
		/*border-top: 1px solid rgba(255, 255, 255, 0.7);*/
		max-width: 550px;
	}

	.production_top {
		display: inline-block;
		padding: 6px;
		margin-bottom: 5px;
		background: rgba(0, 0, 0, .3);
		border-radius: 6px;
		margin-top: 5px;
	}

	.product_go {
		color: #fbdd21;
	}

	.production_title {
		margin-left: 4px;
	}

	.border_progress {
		width: 0;
		height: 1px;
		background: #bababa;
		position: absolute;
		top: 0;
		transition: .1s all;
	}

	.content {
		position: absolute;
		bottom: 110px;
		right: 60px;
		z-index: 999;
	}

	.content img {
		display: inline-block;
		vertical-align: middle;
		width: 200px;
	}

	

	.bottom_tab {
		width: 33%;
		text-align: center;
		float: left;
		color: #c9c9c9;
		padding: 10px 0;
	}

	.bottom_tab_icon {
		width: 44px;
	}

	.bottom_tab_span {
		line-height: 28px;
		border-bottom: 2px solid transparent;
		font-weight: 600;
		font-size: 16px;
		display: inline-block;
		padding: 0 4px;
		transition: .5s all;
	}

	.tab_active .bottom_tab_span {
		border-bottom: 2px solid #fff;
		color: #fff;
	}

	.icon-shoucang {
		transition: .5s all;
	}

	.fabulous_active {
		color: #f44;
		animation: showHeart .5s ease-in-out 0s;
	}

	/*animation-name：用来调用@keyframes定义好的动画，与@keyframes定义的动画名称一致*/
	/*animation-duration ：指定元素播放动画所持续的时间*/
	/*animatino-timing-function ： 和transition中的transition-timing-function 中的值一样。根据上面@keframes中分析的animation中可能存在多个小动画，因此这里的值设置是针对每一个小动画所在时间范围内的属性变换速率。*/
	/*animation-delay：定义在浏览器开始执行动画之前等待的时间，这里是指整个animation执行之前的等待时间，而不是上面说的多个小动画*/
	/*animation-iteration-count：定义动画的播放次数，其通常为整数，默认是1,；取值为infinite，动画将无限次的播放。*/
	/*animation-direction：主要用来设置动画播放方向*/
	@keyframes showHeart {
		0% {
			color: #f44;
			transform: scale(1);
		}

		25% {
			color: #fff;
			transform: scale(0);
		}

		80% {
			color: #f44;
			transform: scale(1.2);
		}

		100% {
			color: #f44;
			transform: scale(1);
		}
	}

	/*分享样式*/
	.share_hover {
		position: fixed;
		display: none;

	}

	.share_box {
		position: fixed;
		bottom: -300px;
		width: 100%;
		z-index: 1002;
		background: #fff;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		transition: .5s;
	}

	.share_tips {
		text-align: center;
		line-height: 38px;
		color: #333;
	}

	.share_ul {
		box-sizing: border-box;
		padding: 0 25px 25px;
		border-bottom: 1px solid #e8e8e8;
	}

	.share_li {
		float: left;
		width: 33%;
		text-align: center;
	}

	.share_li i {
		font-size: 44px;
	}

	.share_cancel {
		text-align: center;
		line-height: 48px;
		color: #777;
		text-align: center;
	}

	.pengyouquan {
		color: #47D000;

	}

	.pengyouquan_li {
		animation: rotating 8s linear infinite
	}

	@keyframes rotating {
		from {
			transform: rotate(0)
		}

		to {
			transform: rotate(360deg)
		}
	}

	.weixin {
		color: #20CA2E;
	}

	.lianjie {
		color: #cdcdcd;
	}

	.share_active {
		bottom: 0px;
	}

	.type2 {
		color: #FFF;
	}

	/*评论样式*/
	::-webkit-input-placeholder {
		color: rgba(0, 0, 0, 0.20);
	}

	:-moz-placeholder {
		color: rgba(0, 0, 0, 0.20);
		;
	}

	::-moz-placeholder {
		color: rgba(0, 0, 0, 0.20);
	}

	:-ms-input-placeholder {
		color: rgba(0, 0, 0, 0.20);
	}

	.comment_container {
		width: 100%;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}

	.comment_box {
		padding: 0 15px 52px 15px;
	}

	.comment_top {
		text-align: center;
		font-size: 12px;
		color: #000;
		line-height: 40px;
	}

	.guanbi3 {
		float: right;
		font-size: 12px;
		padding: 0 10px;
		position: absolute;
		right: 6px;
	}

	.comment_li {
		margin-bottom: 20px;
		font-size: 14px;
		text-align: left;
	}

	.comment_author_left {
		float: left;
	}

	.comment_author_left img {
		width: 35px;
		height: 35px;
		border-radius: 50%;
	}

	.comment_author_right {
		margin-left: 46px;
		padding-top: 4px;
	}

	.comment_author_top {
		position: relative;
	}

	.comment_author_name {
		margin-bottom: 6px;
		color: #777;
	}

	.icon-shoucang1_box {
		position: absolute;
		right: 0px;
		top: 0;
		text-align: center;
		color: #777;
	}

	.comment_author_text {
		color: #555;
		margin-bottom: 10px;
		padding-right: 35px;
	}

	.comment_replay_box {
		padding-left: 46px;
		box-sizing: border-box;
	}

	.comment_replay_li {
		margin-bottom: 10px;
	}

	.comment_replay_left {
		float: left;
	}

	.comment_replay_left img {
		width: 25px;
		height: 25px;
		border-radius: 50%;
	}

	.comment_replay_right {
		margin-left: 35px;
		padding-top: 2px;
	}

	.comment_replay_top {
		position: relative;
		margin-bottom: 6px;
	}

	.comment_replay_text {
		padding-right: 35px;
		margin-bottom: 10px;
		color: #555;
	}

	.comment_author_text span,
	.comment_replay_text span {
		color: #999;
		font-size: 13px;
		margin-left: 6px;
	}

	.shoucang1_num {
		text-align: center;
		width: 30px;
		font-size: 12px;
		/* right: -4px; */
		position: relative;
	}

	.comment_ul {
		height: 400px;
		overflow-y: auto;
	}

	.comment_input_box {
		position: fixed;
		bottom: 0;
		z-index: 2999;
		width: 100%;
		border-top: 1px solid #e8e8e8;
		background: #fff;
		padding: 10px 15px;
		box-sizing: border-box;
	}

	/*.comment_form {*/
	/**/
	/*}*/

	.comment_input {
		border: none;
		resize: none;
		width: 80%;
		float: left;
		color: #555;
		caret-color: #f44;
	}

	.comment_input_right {
		float: right;
	}

	.comment_i {
		font-size: 22px;
		color: #999;
		transition: .3s;
	}

	.comment_i_active {
		color: #f44;
	}

	.icon-zanwupinglun {
		font-size: 100px;
		color: #777;
	}

	.v-enter,
	.v-leave-to {
		opacity: 0;
		transform: translateY(80px);
	}

	.v-enter-active,
	.v-leave-active {
		transition: all .5s ease;
	}

	/*添加进场效果*/
	.v-move {
		transition: all 1s ease;
	}

	.v-leave-active {
		position: absolute;
	}

	.list-complete-item {
		transition: all 1s;
		display: inline-block;
		margin-right: 10px;
	}

	.list-complete-enter,
	.list-complete-leave-to {
		opacity: 0;
		transform: translateY(30px);
	}

	.list-complete-leave-active {
		position: absolute;
	}

	.love_active {
		color: #f44;
	}

	/*评论样式*/
	@-webkit-keyframes downcowPop {
		0% {
			-webkit-transform: translateX(-30%);
			transform: translateX(-30%)
		}

		40% {
			-webkit-transform: translateX(15%);
			transform: translateX(15%)
		}

		70% {
			-webkit-transform: translateX(0);
			transform: translateX(0)
		}

		to {
			-webkit-transform: translateX(-30%);
			transform: translateX(-30%)
		}
	}

	@keyframes downcowPop {
		0% {
			-webkit-transform: translateX(-30%);
			transform: translateX(-30%)
		}

		40% {
			-webkit-transform: translateX(15%);
			transform: translateX(15%)
		}

		70% {
			-webkit-transform: translateX(0);
			transform: translateX(0)
		}

		to {
			-webkit-transform: translateX(-30%);
			transform: translateX(-30%)
		}
	}

	.topAD {
		width: 100%;
	}

	.bottomAD {
		width: 100%;
	}

	.ad {
		transform: translate(-50%, -50%);
		top: 50%;
		left: 50%;
		position: absolute;
		width: 100%;
	}

	.floatAD {
		position: absolute;
		top: 20px;
		left: 20px;
		z-index: 9999;
		display: flex;
		align-items: center;
		text-decoration: none;
		color:#fff;
	}

	.qt { 
		position: absolute;
		top: 50%;
		left: 50%;
		border-radius: 5px;
		-webkit-transform: translate(-50%, -50%);
		-moz-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		width:90%;
		z-index: 999;
	}
	.copy{
		position: absolute;
		top: 50%;
		left: 50%;
		border-radius: 5px;
		-webkit-transform: translate(-50%, -50%);
		-moz-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		background: #fff;
		z-index: 999;
		width:80%; 
		padding:20px 0px;
	}
	.close{
		position: absolute;
		top:-30px;
		right:-30px;
		width:30px;
	}
	#copyId{
		width:90%;
		margin:10px auto;
	}
</style>
