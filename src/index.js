import "babel-core/register";
import "babel-polyfill";

import Engine from "./Engine";
import PoseNet from "./PoseNet";
import VideoRenderer from "./VideoRenderer";
import PoseDebugger from "./PoseDebugger";

const video = document.getElementById("video");
const root = document.getElementById("root");

const poseNet = new PoseNet();
const engine = new Engine(root, window.innerWidth, window.innerHeight, true);

const videoRenderer = new VideoRenderer(video, engine.scene);
const poseDebugger = new PoseDebugger(engine.scene);

let poseNetLocked = false;
const update = async () => {
    // Limita a execução do posenet a 100 milisegundos por vez
    if (poseNetLocked) return;
    poseNetLocked = true;
    setTimeout(async () => {
        const pose = await poseNet.estimate(video);
        poseDebugger.moveKeypoints(pose.keypoints);
        poseNetLocked = false;
    }, 100);
}

const loadWebcam = async () => {
    console.log("Carregando webcam...")
    if (navigator.mediaDevices || navigator.mediaDevices.getUserMedia) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true })
            video.srcObject = stream;
            console.log("Webcam pronta!");
        } catch (e) {
            console.error("Não foi possivel obter a streaming da webcam");
            console.error(e);
        }
    } else {
        console.error('MediaDevices interface not available.');
    }
}

const loadPoseNet = async () => {
    console.log("Carregando posenet...");
    await poseNet.load();
    engine.addUpdateObserver(update);
    console.log("PoseNet pronto!");
}

loadPoseNet();
loadWebcam();