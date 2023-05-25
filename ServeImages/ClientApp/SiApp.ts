import './SirDashboard';
import SiDashboard from './SirDashboard';
import './SiPicture';
import SiPicture from './SiPicture';
import './SiLoader';
import SiLoader from './SiLoader';
import { ApiResponse } from './ApiResponse';
import DirectoryInfo from './DirectoryInfo';

const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            position: relative;
            display: flex;
            justify-content: flex-start;
            width: 100%;
            height: 100%;
        }

        si-dashboard {
            max-width: 1250px;
            flex-basis: 30%;
        }
        si-picture {
            flex-basis: 70%;
            margin-left: 20px;
            height: 700px;
        }
        si-loader {
            position: absolute;
            height: calc(100% - 80px);
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            visibility: hidden;
            z-indez: 1;
        }
    </style>
    <si-dashboard></si-dashboard>
    <si-loader></si-loader>
  `;

class SiApp extends HTMLElement {
    private requestCountLimit: number;
    private dashboard: SiDashboard;
    private directoryContext: Array<string>;
    private loader: SiLoader;

    constructor() {
        super();
        this.directoryContext = [];
        this.requestCountLimit = 10;
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.dashboard = this.shadowRoot.querySelector('si-dashboard');
        this.loader = this.shadowRoot.querySelector('si-loader');

        this.addEventListener('gotodirectory', this.goToDirectoryHandler.bind(this));

        this.addEventListener('returnfromdirectory', this.returnFromDirectoryHandler.bind(this));

        this.addEventListener('openimage', this.openImageHandler.bind(this));

        this.addEventListener('downloadimage', this.downloadHandler.bind(this));
    }

    switchLoader() {
        if (this.loader.isActive) {
            this.loader.style.visibility = "hidden";
            this.loader.isActive = false;
        } else {
            this.loader.style.visibility = "visible";
            this.loader.isActive = true;
        }
    }

    downloadHandler(e: CustomEvent) {
        const pictureElement = this.shadowRoot.querySelector('si-dashboard') as SiPicture;
        if (pictureElement) {
            let a = document.createElement('a');
            a.href = e.detail.path;
            a.download = e.detail.file;
            a.click()
        }
    }

    openImageHandler(e: CustomEvent) {
        let picture = document.createElement('si-picture');
        picture.setAttribute('path', this.buildFilePath(e.detail.selectedFile));
        picture.setAttribute('file', e.detail.selectedFile);
        let toRemove = this.shadowRoot.querySelector('si-picture');
        if (toRemove) {
            this.shadowRoot.removeChild(toRemove);
        }
        this.shadowRoot.appendChild(picture);
    }

    returnFromDirectoryHandler(e: CustomEvent) {
        this.directoryContext.pop();
        this.fetchDirectories();
    }

    goToDirectoryHandler(e: CustomEvent) {
        this.directoryContext.push(e.detail.selectedDirectory);
        this.fetchDirectories();
    }

    connectedCallback() {
        this.fetchDirectories();
    }

    buildFolderPath(): string {
        return `/api/images/${this.directoryContext.join('/')}?${new URLSearchParams({ limit: this.requestCountLimit.toString() })}`;
    }

    buildFilePath(file: string): string {
        return `/images/${this.directoryContext.join('/')}/${file}`;
    }

    async fetchDirectories() {
        try {
            this.switchLoader();
            console.log(this.buildFolderPath());
            let response = await fetch(this.buildFolderPath());
            if (!response.ok) {
                throw new Error('Request failed.');
            }
            let data = await response.json() as ApiResponse;
            this.dashboard.folders =
                [...data.directories.map(x => new DirectoryInfo(x.name, true)), ...data.files.map(x => new DirectoryInfo(x.name, false))];
            this.switchLoader();
        } catch (e) {
            this.switchLoader();
            console.log(e);
        };
    }
}
customElements.define('si-app', SiApp);

export default SiApp;