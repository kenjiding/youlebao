<template>
  <el-dialog
    :visible="visible"
    title="拍照"
    width="440px"
    append-to-body
    custom-class="photopraph-main"
    @open="start()"
    @close="handleClose">
    <div>
      <video
        v-if="videoUsable"
        ref="video"
        width="400"
        height="300"/>
      <p
        v-else
        class="photopraph-error">无可用的摄像头设备</p>
      <el-button
        :disabled="!videoUsable"
        type="primary"
        class="snap-shot"
        @click="snapShotClick">拍照</el-button>
      <canvas
        ref='canvas'
        width="200"
        height="200"
        style="display:none"/>
        <!-- <img
        :src="imgSrc"> -->
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'Photopraph',

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      videoUsable: true,
      imgSrc: '',
      mediaStreamTrack: null,
    };
  },

  methods: {
    start() {
      const vendorUrl = window.URL;
      // 媒体对象
      navigator.getMedia = navigator.getUserMedia;
      navigator.getMedia({
        video: true, // 使用摄像头对象
        audio: false, // 不适用音频
      }, (stream) => {
        this.videoUsable = true;
        this.mediaStreamTrack = stream;
        this.$refs.video.src = vendorUrl.createObjectURL(stream);
        setTimeout(() => { this.$refs.video.play(); }, 500);
      }, () => {
        // console.log('close');
        this.videoUsable = false;
        this.closeCamera();
      });
    },

    handleClose() {
      this.$emit('close');
      this.closeCamera();
    },

    closeCamera() {
      if (this.mediaStreamTrack) {
        this.mediaStreamTrack.getTracks()[0].stop(); // 关闭摄像头
        this.mediaStreamTrack = null;
      }
    },

    snapShotClick() {
      // 绘制canvas图形
      this.$refs.canvas.getContext('2d').drawImage(this.$refs.video, 0, 0, 200, 200);
      // 把canvas图像转为img图片
      // this.imgSrc = this.$refs.canvas.toDataURL('image/png');
      this.$emit('complete', this.$refs.canvas.toDataURL('image/png'));
      this.closeCamera();
    },
  },
};
</script>


<style lang="scss" scoped>
  @import "@/styles/theme.scss";

  .photopraph-main {
    $two-px:2px;

    .snap-shot{
      width: 100%;
      margin-top: 20px;
    }

    .photopraph-error {
      height: 300px;
      line-height: 300px;
      text-align: center;
      font-size: $font-size-primary;
      color: $font-color-placeholder;
    }

    /deep/ .el-dialog__header {
      height: 50px;
      padding: 0;
      // stylelint-disable-next-line
      border-bottom: 1px #DDD solid;
    }

    /deep/ .el-dialog__title {
      padding-left: 30px;
      line-height: 50px;
      // stylelint-disable-next-line
      font-size: 16px;
      // stylelint-disable-next-line
      color: #333;
    }

    /deep/ .el-dialog__body {
      padding: 0;
      background-color: $color-bg-primary;
    }
  }
</style>
