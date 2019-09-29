import * as posenet from '@tensorflow-models/posenet';

export default class PoseNet {

    net = null;

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
            inputResolution: 513,
            multiplier: 0.75
        });
    }

    /**
     * Estima a pose atual e retorna os keypoints
     * @param {video | image} entrie 
     */
    estimate = async (entrie) => {
        const pose = await this.net.estimateSinglePose(entrie, {
            flipHorizontal: false,
        });
        console.log(pose);

        return pose;
    }
}