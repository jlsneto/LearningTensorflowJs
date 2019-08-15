let net;
const videoWidth = 500;
const videoHeight = 500;
const video = document.getElementById('webcam');
video.width = videoWidth;
video.height = videoHeight;
const color = "#FFFF";

async function setupWebcam() {
    return new Promise((resolve, reject) => {
        const navigatorAny = navigator;
        navigator.getUserMedia = navigator.getUserMedia ||
            navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
            navigatorAny.msGetUserMedia;
        if (navigator.getUserMedia) {
            navigator.getUserMedia({video: true},
                stream => {
                    video.srcObject = stream;
                    video.addEventListener('loadeddata', () => resolve(), false);
                },
                error => reject());
        } else {
            reject();
        }
    });
}

const poseReference = {
    "nose": 0,
    "leftEye": 1,
    "rightEye": 2,
    "leftShoulder": 5,
    "rightShoulder": 6,
    "leftElbow": 7,
    "rightElbow": 8,
    "leftWrist": 9,
    "rightWrist": 10,
    "leftHip": 11,
    "rightHip": 12
};

async function app() {
    console.log('Loading mobilenet..');

    // Load the model.
    net = await posenet.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: 513,
        multiplier: 0.75
    });
    console.log('Sucessfully loaded model');

    await setupWebcam();
    const canvas = document.getElementById('output');
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    console.log(canvas);
    while (true) {
        const pose = await net.estimateSinglePose(video, {
            flipHorizontal: true,
        });
        // console.log(pose);
        // document.getElementById("console").innerText = `
        //           face: ${pose.keypoints[0].score}\n
        //           leftArm: ${pose.keypoints[9].score}\n
        //           rightArm: ${pose.keypoints[10].score}\n
        //         `;

        // const nose: boolean =
        //   pose.keypoints[poseReference.nose].score >= 0.5 ? true : false;
        // const leftHip: boolean =
        //   pose.keypoints[poseReference.leftHip].score >= 0.5 ? true : false;
        // const rightHip: boolean =
        //   pose.keypoints[poseReference.rightHip].score >= 0.5 ? true : false;
        // const leftWrist: boolean =
        //   pose.keypoints[poseReference.leftWrist].score >= 0.5 ? true : false;
        // const rightWrist: boolean =
        //   pose.keypoints[poseReference.rightWrist].score >= 0.5 ? true : false;

        // return { nose, leftHip, rightHip, leftWrist, rightWrist };
        if (
            pose.keypoints[poseReference.nose].score >= 0.5 && // nariz
            pose.keypoints[poseReference.leftHip].score >= 0.5 && // quadril esquerdo
            pose.keypoints[poseReference.rightHip].score >= 0.5 && // quadril direito
            pose.keypoints[poseReference.leftWrist].score >= 0.5 && // punho esquerdo
            pose.keypoints[poseReference.rightWrist].score >= 0.5 // punho direito
        ) {

            // return { nose, leftHip, rightHip, leftWrist, rightWrist };
        }


        const ctx = canvas.getContext('2d');
        const minPoseConfidence = 0.5;
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-videoWidth, 0);
        ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
        ctx.restore();
        let keypoints = new Array();
        for (let part in poseReference) {
            if (pose.keypoints[poseReference[part]].score >= minPoseConfidence) {
                keypoints = keypoints.concat(pose.keypoints[poseReference[part]]);
                const {y, x} = pose.keypoints[poseReference[part]].position;
                drawPoint(ctx, y * 1, x * 1, 3, color, part);
            }
        }
        console.log(keypoints);
        drawSkeleton(pose.keypoints, minPoseConfidence, ctx, 1);

        // drawKeypoints(pose.keypoints, minPoseConfidence, ctx);
        await tf.nextFrame();
    }

}

function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
    for (let i = 0; i < keypoints.length; i++) {
        const keypoint = keypoints[i];

        if (keypoint.score < minConfidence) {
            continue;
        }

        const {y, x} = keypoint.position;
        drawPoint(ctx, y * scale, x * scale, 3, color);
    }
}

function drawPoint(ctx, y, x, r, color, part) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 10 * Math.PI);
    ctx.fillStyle = color;
    // ctx.fillText(part, x, y, 500);
    ctx.fill();
}

function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
    ctx.beginPath();
    ctx.moveTo(ax * scale, ay * scale);
    ctx.lineTo(bx * scale, by * scale);
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.stroke();
}
function toTuple({y, x}) {
    return [y, x];
}

function drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
    const adjacentKeyPoints =
        posenet.getAdjacentKeyPoints(keypoints, minConfidence);

    adjacentKeyPoints.forEach((keypoints) => {
        let tupleFirst = toTuple(keypoints[0].position);
        let tupleSecond = toTuple(keypoints[1].position);
        drawSegment(
            tupleFirst,tupleSecond , color,
            scale, ctx);
    });
}

app();
