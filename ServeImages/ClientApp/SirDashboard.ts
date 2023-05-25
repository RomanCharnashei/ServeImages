import './SiDashboardRow';
import SiDashboardRow from './SiDashboardRow';
import DirectoryInfo from './DirectoryInfo';

const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            display: block;
            box-sizing: border-box;
        }

        .folder-header {
            height: 30px;
            display:flex;
            margin-bottom: 5px;
            border-bottom: 1px solid #dddddd
        }

        .folder-header__name {
            flex-grow: 1;
            padding-left: 20px;
        }

        .folder-header__number {
            width: 50px;            
            text-align: center;
        }

        .folder-header__name, .folder-header__number {
            line-height: 1.9;
            color: inherit;
        }

        .folder {
            margin-bottom: 5px;
        }

        .back-link {
            display: inline-block;
            box-sizing: border-box;
            color: #006acf;
            cursor: pointer;
            margin-bottom: 20px;
            border: 1px solid #dddddd;
            padding: 9px;
        }
    </style>
    <a class="back-link">Назад</a>
    <div class="folder-header">
        <div class="folder-header__number">
            #
        </div>
        <div class="folder-header__name">
            Название папки
        </div>
    </div>
  `;

class SiDashboard extends HTMLElement {

    private rowElements: SiDashboardRow[];

    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.rowElements = [];
        this.shadowRoot.querySelector('.back-link')
            .addEventListener('click', (e) => {
                e.preventDefault();
                const customEvent = new CustomEvent('returnfromdirectory', {
                    bubbles: true,
                    composed: true
                });
                shadow.dispatchEvent(customEvent);
            });
        this.addEventListener('openimage', this.setActiveRow.bind(this));
    }

    setActiveRow(e: CustomEvent) {
        this.rowElements
            .filter((el) => el.isActive)
            .forEach((el) => el.isActive = false);

        this.rowElements
            .find(el => el.name === e.detail.selectedFile)
            .isActive = true;
    }

    set folders(newRows: DirectoryInfo[]) {
        this.rowElements.forEach((rowEl) => {
            this.shadowRoot.removeChild(rowEl);
        });

        this.rowElements = newRows.map((dir: DirectoryInfo, index: number) => {
            let row = document.createElement('si-dashboard-row') as SiDashboardRow;
            row.setAttribute('class', 'folder');
            row.setAttribute('order', (index + 1).toString());
            row.setAttribute('name', dir.Name);
            row.setAttribute('is-directory', dir.IsDirectory.toString());
            row.setAttribute('is-active', false.toString());

            return row;
        });

        this.rowElements.forEach((rowEl) => {
            this.shadowRoot.appendChild(rowEl);
        });
    }
}

window.customElements.define('si-dashboard', SiDashboard);

export default SiDashboard;