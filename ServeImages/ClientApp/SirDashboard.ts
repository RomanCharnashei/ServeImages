import './SiDashboardRow';
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
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.shadowRoot.querySelector('.back-link')
            .addEventListener('click', (e) => {
                e.preventDefault();
                const customEvent = new CustomEvent('returnfromdirectory', {
                    bubbles: true,
                    composed: true
                });
                shadow.dispatchEvent(customEvent);
            });
    }

    set folders(newRows: DirectoryInfo[]) {
        const rows = this.shadowRoot.querySelectorAll('si-dashboard-row');
        const rowLength = rows.length;
        const newRowsLength = newRows.length;

        for (var i = 0; i < rowLength; i++) {
            this.shadowRoot.removeChild(rows[i]);
        }

        for (var i = 0; i < newRowsLength; i++) {
            let row = document.createElement('si-dashboard-row');
            row.setAttribute('class', 'folder');
            row.setAttribute('order', (i + 1).toString());
            row.setAttribute('name', newRows[i].Name);
            row.setAttribute('is-directory', newRows[i].IsDirectory.toString());
            this.shadowRoot.appendChild(row);
        }
    }
}

window.customElements.define('si-dashboard', SiDashboard);

export default SiDashboard;