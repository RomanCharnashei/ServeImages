const template = document.createElement('template');
template.innerHTML = `
        <style>
        :host {
            display:flex;
            align-items: center;
            justify-content: center;
            background-color: black;
            opacity: 0.1;
        }
        .loader-svg{
          fill: none;
          stroke-width: 5px;
          stroke-linecap: round;
          stroke: rgb(64, 0, 148);
        }
        .loader-svg.bg{
          stroke-width: 8px;
          stroke: rgb(207, 205, 245);
        }
        .animate{
          stroke-dasharray: 242.6;
          animation: fill-animation 1s cubic-bezier(1,1,1,1) 0s infinite;
        }
        
        @keyframes fill-animation{
          0%{
            stroke-dasharray: 40 242.6;
            stroke-dashoffset: 0;
          }
          50%{
            stroke-dasharray: 141.3;
            stroke-dashoffset: 141.3;
          }
          100%{
            stroke-dasharray: 40 242.6;
            stroke-dashoffset: 282.6;
          }
        }
        </style>
        <svg class="svg-container" height="100" width="100" viewBox="0 0 100 100">
            <circle class="loader-svg bg" cx="50" cy="50" r="45"></circle>
            <circle class="loader-svg animate" cx="50" cy="50" r="45"></circle>
        </svg>
  `;

class SiLoader extends HTMLElement {
    private activeSate: boolean;
    constructor() {
        super();
        this.activeSate = false;
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    get isActive(): boolean {
        return this.activeSate;
    }

    set isActive(value: boolean) {
        this.activeSate = value;
    }
}

customElements.define('si-loader', SiLoader);

export default SiLoader;