import './SirDashboard';
import SiDashboard from './SirDashboard';
import './SiPicture';
import { ApiResponse } from './ApiResponse';
import DirectoryInfo from './DirectoryInfo';

const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            display: flex;
            justify-content: flex-start;
            width: 100%,
            height: 100%,
        }

        si-dashboard {
            max-width: 1250px;
            flex-basis: 30%;
        }
        si-picture {
            flex-basis: 70%;
            margin-top: 89px;
            margin-left: 20px;
            height: 700px;
        }
    </style>
    <si-dashboard></si-dashboard>
  `;

class SiApp extends HTMLElement {
    private dashboard: SiDashboard;
    private directoryContext: Array<string>;
    constructor() {
        super();
        this.directoryContext = [];
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.dashboard = this.shadowRoot.querySelector('si-dashboard');
        this.addEventListener('gotodirectory', (e: CustomEvent) => {
            console.log('gotodirectory');
            this.directoryContext.push(e.detail.selectedDirectory);
            this.fetchData();
        });
        this.addEventListener('returnfromdirectory', (e: CustomEvent) => {
            this.directoryContext.pop();
            this.fetchData();
        });
        this.addEventListener('openimage', (e: CustomEvent) => {
            let picture = document.createElement('si-picture');
            picture.setAttribute('path', this.buildUri() + '/' + e.detail.selectedFile);
            picture.setAttribute('title', e.detail.selectedFile);
            let toRemove = this.shadowRoot.querySelector('si-picture');
            if (toRemove) {
                this.shadowRoot.removeChild(toRemove);
            }
            this.shadowRoot.appendChild(picture);
        });
    }

    connectedCallback() {
        //let picture: SiPicture = this.shadowRoot.querySelector("si-picture");
        this.fetchData();
    }

    buildUri(): string {
        return `/api/images/${this.directoryContext.join('/')}`;
    }

    async fetchData() {
        let response = await fetch(this.buildUri());
        let data = await response.json() as ApiResponse;
        this.dashboard.folders =
            [...data.directories.map(x => new DirectoryInfo(x.Name, true)), ...data.files.map(x => new DirectoryInfo(x.Name, false))];
    }
}
customElements.define('si-app', SiApp);

export default SiApp;