<template>
	<div class="container_box" id="video_box" :style="{height:height+'px'}">
		<!--vant van-swipe 滑动组件 -->
		<swiper :options="swiperOption" class="product_swiper">
			<swiper-slide v-for="(item, index) in videoList" :key="index" class="product_swiper">
				<div class="type1">
					<div class="video_container">
						<!--video属性
						webkit-playsinline ios 小窗播放，使视频不脱离文本流，安卓则无效
						微信内置x5内核，
						x5-video-player-type="h5-page" 启用H5播放器,是wechat安卓版特性，添加此属性，微信浏览器会自动将视频置为全屏
						x5-video-player-fullscreen="true" 全屏设置，设置为 true 是防止横屏
						x5-video-orientation 控制横竖屏 landscape 横屏，portrain竖屏； 默认portrain
						poster：封面
						src：播放地址
						-->
						<video class="video_box" :muted="isiOS"  loop  webkit-playsinline x5-video-player-type="h5-page"
						 x5-video-player-fullscreen="true" playsinline preload="auto" :poster="item.pic" :src="item.url" :playOrPause="playOrPause"
						 @click="pauseVideo" @ended="onPlayerEnded($event)">
						</video>

						<!-- 封面 -->
						<img v-show="isVideoShow" class="play" @click="playvideo" :src="item.pic" />
						<!-- 播放暂停按钮 -->
						<img v-show="iconPlayShow" class="icon_play" @click="playvideo" src="http://npjy.oss-cn-beijing.aliyuncs.com/images/file-1575340653940esdHR.png" />
					</div>
					<!-- 右侧头像、点赞、评论、分享功能 -->
					<div class="tools_right">
						<div class="tools_r_li" @click="changeFabulous(item,index)">
							<i class="iconfont icon-shoucang icon_right" :class="item.fabulous?'fabulous_active':''"></i>
							<div class="tools_r_num">52.1w</div>
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
					<!-- 底部作品描述 -->
					<div class="production_box">
						{{ item.name }}
					</div>
				</div>
			</swiper-slide>
		</swiper>
		<div v-if="first==1&&isiOS" @click="first=0">
			<div class="cover"></div>
			<div class="content">
				<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAAaCAYAAAANKWFxAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjIyNDIwRjkxODkxMTFFQTlCQ0FBNzQ1MTExQUQzQzUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjIyNDIwRkExODkxMTFFQTlCQ0FBNzQ1MTExQUQzQzUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGMjI0MjBGNzE4OTExMUVBOUJDQUE3NDUxMTFBRDNDNSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGMjI0MjBGODE4OTExMUVBOUJDQUE3NDUxMTFBRDNDNSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrRVmP0AAAxmSURBVHja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">
				<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAABDCAYAAAACuCLiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjIyNDIwRkQxODkxMTFFQTlCQ0FBNzQ1MTExQUQzQzUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjIyNDIwRkUxODkxMTFFQTlCQ0FBNzQ1MTExQUQzQzUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGMjI0MjBGQjE4OTExMUVBOUJDQUE3NDUxMTFBRDNDNSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGMjI0MjBGQzE4OTExMUVBOUJDQUE3NDUxMTFBRDNDNSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkDWisUAAB5ASURBVHja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">
				<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFMAAABTCAYAAADjsjsAAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTBERDU0QUUxODkyMTFFQTlCQ0FBNzQ1MTExQUQzQzUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTBERDU0QUYxODkyMTFFQTlCQ0FBNzQ1MTExQUQzQzUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGMjI0MjBGRjE4OTExMUVBOUJDQUE3NDUxMTFBRDNDNSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGMjI0MjEwMDE4OTExMUVBOUJDQUE3NDUxMTFBRDNDNSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PukdTj4AAAh7SURBVHja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">
			</div>
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
				current: 0,
				videoList: [],
				isVideoShow: true,
				playOrPause: true,
				video: null,
				first:1,
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
				}
			}
		},
		created() {
			vm = this
			this.height = window.innerHeight
			this.$axios.get("/getOrderVideoArray.htm?num=3").then(res => {
				console.log(res)
				let data = res.data.data
				this.videoList = data
			})
		},

		mounted() {
			let json = {
				type: 2
			}
			let list = this.videoList
			list.splice(2, 0, json)
			this.videoList = list
		},
		methods: {
			changeFabulous(item, index) {
				this.videoList[index].fabulous = !this.videoList[index].fabulous
			},
			muted() {
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
					this.$axios.get("/getOrderVideoArray.htm?num=3").then(res => {
						let data = res.data.data
						this.videoList = this.videoList.concat(data)
						console.log(data)
					})
				}
				this.videoProcess = 0;
				console.log(this.current)
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
				alert("链接复制成功")
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
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		overflow: hidden;
	}

	video {
		object-position: 0 0;
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
		margin: auto;
		top: 0;
		left: 0;
		z-index: 999;
		width: 100%;
		height: 100%;
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
		bottom: 100px;
		right: 10px;
		z-index: 999;
	}

	.content img {
		display: inline-block;
		vertical-align: middle;
	}

	.content img:first-child {
		width: 10.85rem;
		margin-right: 1.5rem;
	}

	.content img:nth-child(2) {
		width: 3rem;
		height: auto;
		animation: downcowPop .7s linear infinite;
	}

	.content img:nth-child(3) {
		width: 3.4rem;
		height: auto;
		background: #696a6a;
		border-radius: 1.6rem;
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
</style>
