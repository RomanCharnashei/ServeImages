const template = document.createElement('template');
template.innerHTML = `
    <style>
       :host {
            background: #f6f6f6;
            height: 30px;
            display:flex;
        }

        .folder__number, .folder__name {
            line-height: 1.9;
        }

        .folder__number {
            width: 50px;
            border-right: 1px solid #dddddd;
            text-align: center;
        }
        
        .folder__name {
            flex-grow: 1;
            padding: 0 20px 0 20px;
            color: #006acf;
        }

        .folder__name-link:hover {
            cursor: pointer;
            text-decoration: none;
        }

        .folder__name-link_active {
            text-decoration: underline;
        }
    </style>
    <div class="folder__number"></div>
    <div class="folder__name">
        <a class="folder__name-link"></a>
    </div>
`;

class SiDashboardRow extends HTMLElement {
    static get observedAttributes() {
        return ['name', 'order', 'is-active'];
    }

    private folderNumberElement: HTMLDivElement;
    private folderNameElement: HTMLAnchorElement;

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.folderNumberElement = this.shadowRoot.querySelector('.folder__number');
        this.folderNameElement = this.shadowRoot.querySelector('.folder__name-link');

        this.folderNameElement.addEventListener('click', (e) => {
            let customEvent: CustomEvent;

            if (this.isDirectory) {
                customEvent = new CustomEvent('gotodirectory', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        selectedDirectory: this.name
                    }
                });
            } else {
                customEvent = new CustomEvent('openimage', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        selectedFile: this.name
                    }
                });
            }
            shadow.dispatchEvent(customEvent);
        });
    }

    get name(): string {
        return this.getAttribute('name');
    }

    get isDirectory(): boolean {
        return this.getAttribute('is-directory') === "true";
    }

    get isActive(): boolean {
        return this.getAttribute('is-active') === "true";
    }

    set isActive(value: boolean) {
        this.setAttribute('is-active', value.toString());
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        switch (name) {
            case 'order':
                this.folderNumberElement.innerText = newValue;
                break;
            case 'name':
                this.folderNameElement.innerText = newValue;
                break;
            case 'is-active':
                if (newValue === 'true') {
                    this.folderNameElement.classList.add('folder__name-link_active');
                } else {
                    this.folderNameElement.classList.remove('folder__name-link_active');
                }
                break;
        }
    }
}

window.customElements.define('si-dashboard-row', SiDashboardRow);

export default SiDashboardRow;