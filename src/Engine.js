import { Scene, PerspectiveCamera, WebGLRenderer } from "three";
import Stats from "stats.js";

export default class Engine {
    updateObservers = [];
    constructor(rootElement, width, height, debug) {
        this.debug = debug;
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
        this.renderer = new WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(width, height);
        rootElement.appendChild(this.renderer.domElement);

        if (debug) {
            this.stats = new Stats();
            this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
            document.body.appendChild(this.stats.dom);
        }
        this.update();
    }

    /**
     * Guarda um callback na lista, 
     * sempre que houver update, o metodo será chamado
     * @param {function} method 
     */
    addUpdateObserver = (method) => {
        this.updateObservers.push(method);
    }

    /**
     * Loop principal de renderização, tudo que necessitar de atualização, 
     * deve utilizar esta função
     */
    update = () => {
        if (this.debug) this.stats.begin();

        // Chama todos os metodos do observer
        this.updateObservers.forEach(method => method());

        // Renderiza a cena
        this.renderer.render(this.scene, this.camera);

        if (this.debug) this.stats.end();

        // Chama o proximo frame
        requestAnimationFrame(this.update);
    }
}