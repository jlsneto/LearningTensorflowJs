import "babel-core/register";
import "babel-polyfill";

import Engine from "./Engine";
import PoseNet from "./PoseNet";
import VideoRenderer from "./VideoRenderer";

const video = document.getElementById("video");
const root = document.getElementById("root");

const poseNet = new PoseNet(512, 512);
const engine = new Engine(root, window.innerWidth, window.innerHeight, true);

const videoRenderer = new VideoRenderer(video, engine.scene);

const loadWebcam = async () => {
    console.log("carregando webcam")
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const constraints = {
            video: { width: 1280, height: 720, facingMode: 'user' }
        };
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints)
            video.srcObject = stream;
            video.play();
            console.log("Webcam pronta");
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

    console.log("PoseNet pronto!");
}

loadWebcam();
loadPoseNet();