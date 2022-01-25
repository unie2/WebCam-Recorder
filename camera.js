// dom
const recordButton = document.querySelector(".record-button")
const stopButton = document.querySelector(".stop-button")
const playButton = document.querySelector(".play-button")
const downloadButton = document.querySelector(".download-button")
const previewPlayer = document.querySelector("#preview")
const recordingPlayer = document.querySelector("#recording")

let recorder;
let recordedChunks;// 녹화 내용을 담을 변수
 
// functions
function videoStart() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            previewPlayer.srcObject = stream; // stream 연결
            startRecording(previewPlayer.captureStream())
        }) 
}

function startRecording(stream) { // 녹화
    recordedChunks = []; // 초기화
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => {
        recordedChunks.push(e.data) // 녹화된 내용 push
    }
    recorder.start() // 녹화 시작
}

function stopRecording() { // 중지
    previewPlayer.srcObject.getTracks().forEach(track => track.stop()); // 카메라, 마이크 사용 중지
    recorder.stop(); // 녹화 중지
    console.log(recordedChunks)
}

function playRecording() { // 녹화보기
    const recordedBlob = new Blob(recordedChunks, {type: "video/webm"}); // 녹화 데이터 및 타입 지정
    recordingPlayer.src = URL.createObjectURL(recordedBlob); // URL형태로 변환
    recordingPlayer.play() // 비디오 재생

    // 다운로드
    downloadButton.href = recordingPlayer.src;
    downloadButton.download = `recording_${new Date()}.webm`; // 파일명 지정
}


// event
recordButton.addEventListener("click", videoStart);
stopButton.addEventListener("click", stopRecording);
playButton.addEventListener("click", playRecording);