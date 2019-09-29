import { VideoTexture, PlaneBufferGeometry, Mesh, MeshBasicMaterial } from "three";

export default class VideoRenderer {

    constructor(video, scene) {
        const texture = new VideoTexture(video);
        const geometry = new PlaneBufferGeometry(16, 9);

        const material = new MeshBasicMaterial({ map: texture });
        const mesh = new Mesh(geometry, material);
        mesh.position.set(0, 0, -10);
        scene.add(mesh);
    }
}