import { Scene, PerspectiveCamera, WebGLRenderer } from "three";

export default class Engine {
    constructor(rootElement, width, height) {
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
        this.renderer = new WebGLRenderer();
        this.renderer.setSize(width, height);
        rootElement.appendChild(this.renderer.domElement);
    }


    /**
     * Loop principal de renderização, tudo que necessitar de atualização, deve utilizar esta função
     */
    update() {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.update);
    }
}