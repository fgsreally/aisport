//注释在110行
const mpPose = window;
const options = {
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mpPose.VERSION}/${file}`;
    }
};
// Our input frames will come from here.
const videoElement = document.getElementsByClassName('input_video')[0];
const counterblock = document.getElementsByClassName('counter')[0];
const startele = document.getElementsByClassName('start')[0];
const stopele = document.getElementsByClassName('stop')[0];
const videoElement2 = document.getElementsByClassName('input_video')[1];
const startele2 = document.getElementsByClassName('start')[1];
const stopele2 = document.getElementsByClassName('stop')[1];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const controlsElement = document.getElementsByClassName('control-panel')[0];

const fullScreen = document.getElementsByClassName('fullScreen')[0];
const fullScreen2 = document.getElementsByClassName('fullScreen')[1];
const situp = document.getElementById('situp')
const pullup = document.getElementById('pullup')
const type = document.getElementById('type')
const canvas = document.createElement('canvas')
const img = document.getElementById('testImg')
var curVideo
var isGetImg=false
var sportType = 'sit_up'
var fullScreenHandler = function (ele) {
    console.log('true')
    if (isElementFullScreen()) {
        exitFullscreen();
    } else {
        FullScreen(ele);
    }
};

function FullScreen(ele) {
  
    if (ele.requestFullscreen) {
        ele.requestFullscreen();
    } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen();
    } else if (ele.webkitRequestFullScreen) {
        ele.webkitRequestFullScreen();
    }
}
function exitFullscreen() {
    var de = document; 
    if (de.exitFullscreen) {
        de.exitFullscreen();
    } else if (de.mozCancelFullScreen) {
        de.mozCancelFullScreen();
    } else if (de.webkitCancelFullScreen) {
        de.webkitCancelFullScreen();
    }
}

function isElementFullScreen() {
    var fullscreenElement =
        document.fullscreenElement ||
        document.msFullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement;
    //如果没有全屏元素在的话 上面表达式是一个空  
    if (fullscreenElement === null) {
        return false; // 当前没有元素在全屏状态
    } else {
        return true; // 有元素在全屏状态
    }
}
fullScreen.addEventListener('click', function () {
    fullScreenHandler(videoElement)
})
fullScreen2.addEventListener('click', function () {
    fullScreenHandler(videoElement2)
})
situp.addEventListener('click', function () {
    type.innerHTML = '仰卧起坐'
    sportType = 'sit_up'
    counter = 0
    state = true
})
pullup.addEventListener('click', function () {
    type.innerHTML = '引体向上'
    sportType = 'pull_up'
    counter = 0
    state = true
})
const spinner = document.querySelector('.loading');
spinner.ontransitionend = () => {
    spinner.style.display = 'none';
};
let activeEffect = 'mask';
var counter = 0
var state = true
var ret
var timer

function onResults(results) {
    // Hide the spinner.

    ret = sportAi(results.poseLandmarks, sportType, counter, state)//ret.msg即是错误信息
    if(ret.msg){
        counterblock.innerHTML=ret.msg//错误信息在这个位置
    }
    if (counter !== ret.counter) {
        counterblock.innerHTML = counter + 1
        counter = ret.counter;
    }
   
    if (!isGetImg && counter === 1) {
        canvas.getContext("2d").drawImage(curVideo, 0, 0);
        img.src = canvas.toDataURL("image/png");
        isGetImg=true
        //只有这一行注释有用
        //在这里已经得到截图，并放到了img上面展示，此处上传到接口即可，
        //如果想更测试不同视频（比如仰卧起坐），把html中video标签链接换成3.mp4即可，如果不想看到测试视频，把css文件中最后一行取消注释
    }
    state = ret.status;
    console.log(counter, state)

    // Update the frame rate.


}
const pose = new mpPose.Pose(options);


async function init() {
    pose.onResults(onResults);
    pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: true,
        smoothSegmentation: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });
    await pose.initialize()
    document.body.classList.add('loaded');
}

init()
startele.addEventListener('click', () => {
    onFrame(pose, videoElement)
    curVideo = videoElement
})

stopele.addEventListener('click', () => {
    clearInterval(timer)
})
startele2.addEventListener('click', () => {
    videoElement2.play()
    onFrame(pose, videoElement2)
    curVideo = videoElement2
})

stopele2.addEventListener('click', () => {
    videoElement2.pause()
})

function onFrame(pose, videoElement) {
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    timer = setInterval(async () => {
        await pose.send({
            image: videoElement
        })
        if (videoElement.paused) {
            clearInterval(timer);
        }
    }, 20)
}
navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
    }).then(function (stream) {
        videoElement.srcObject = stream;

        videoElement.onloadedmetadata = function () {
            videoElement.play();
        };

    })
    .catch(function (err) {
        /* 处理error */
        console.error(err);
    });