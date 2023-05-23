const template = document.createElement('template');
template.innerHTML = `
        <style>
          :host {
            display: block;
            width: 400px;
            height: 400px;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center center;
            border: 1px solid #dddddd;
          }
        </style>
  `;

class SiPicture extends HTMLElement {
    static get observedAttributes() {
        return ['title', 'path'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    set backgroundImage(path: string) {
        this.style.backgroundImage = `url('${path}')`;
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        switch (name) {
            case 'path':
                this.backgroundImage = newValue;
                console.log(this.style.backgroundImage);
                break;
            case 'title':
                //this.folderNameElement.innerText = newValue;
                break;
        }
    }
}
customElements.define('si-picture', SiPicture);

export default SiPicture;