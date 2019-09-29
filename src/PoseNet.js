import * as posenet from '@tensorflow-models/posenet';

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

export default class PoseNet {
    constructor(resolution) {
        this.resolution = resolution;
    }

    /**
     * Carrega o modelo do pose net e instancia a rede neural
    */
    load = async () => {
        this.net = await posenet.load({
            architecture: 'MobileNetV1',
            outputStride: 16,
            inputResolution: this.resolution,
            multiplier: 0.75
        });
    }

    /**
     * Estima a pose atual e retorna os keypoints
     * @param {video | image} entrie 
     */
    estimate = async (entrie) => {
        const pose = await this.net.estimateSinglePose(entrie, {
            flipHorizontal: true,
        });

        return pose;
    }
}