const template = document.createElement('template');
template.innerHTML = `
        <style>
          :host {
            display: block;
            width: auto;
            height: auto;
            overflow: hidden;
            background-color: #f6f6f6;
            position: relative;
          }
          .picture-container {
              width: 100%;
              height: 100%;
              object-fit: contain;
              position: absolute;
              border: 1px solid #dddddd;
          }

          .picture-container:hover {
              cursor: grab;
          }
          .picture-download {
              position: absolute;
              border: 1px solid rgba(0, 0, 0, 0.1);
              border-radius: 0;
              padding: 5px 15px;
              opacity:0.5;
          }
        </style>
        <img class="picture-container"></img>
        <button class="picture-download">Скачать</button>
  `;

class SiPicture extends HTMLElement {
    static get observedAttributes() {
        return ['file', 'path'];
    }

    private image: HTMLImageElement;
    private scale: number;

    constructor() {
        super();
        this.scale = 1;
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.image = this.shadowRoot.querySelector('.picture-container');
        this.shadowRoot.addEventListener('wheel', this.zoomHandler.bind(this));
        this.image.ondragstart = () => false; // disable imbedded drag and drop 
        this.image.addEventListener('mousedown', this.dragHandler.bind(this))
        this.shadowRoot.querySelector('.picture-download')
            .addEventListener('click', this.downloadClicked.bind(this));
    }

    set path(path: string) {
        this.setAttribute('path', path);
    }

    get path(): string {
        return this.getAttribute('path');
    }

    get file(): string {
        return this.getAttribute('file');
    }

    downloadClicked() {
        let customEvent = new CustomEvent('downloadimage', {
            bubbles: true,
            composed: true,
            detail: {
                path: this.path,
                file: this.file
            }
        });

        this.shadowRoot.dispatchEvent(customEvent);
    }

    dragHandler(mousedown: MouseEvent) {
        let image = this.image;
        let initRootPosition: DOMRect = this.shadowRoot.host.getBoundingClientRect();
        let initImagePosition: DOMRect = image.getBoundingClientRect();
        let imageRelativePosition = calcRelativeCoordinates(initImagePosition.left, initImagePosition.top);
        let mouseRealtivePosition = calcRelativeCoordinates(mousedown.clientX, mousedown.clientY);
        let clickShift = {
            left: mouseRealtivePosition.left - imageRelativePosition.left,
            top: mouseRealtivePosition.top - imageRelativePosition.top
        };

        document.addEventListener('mousemove', onMouseMoveHandler);
        image.addEventListener('mouseup', onMouseUpHandler);

        function onMouseUpHandler() {
            document.removeEventListener('mousemove', onMouseMoveHandler);
            image.removeEventListener('mouseup', onMouseUpHandler);
        }

        function calcRelativeCoordinates(left: number, top: number) {
            return {
                left: left - initRootPosition.left,
                top: top - initRootPosition.top
            };
        }

        function onMouseMoveHandler(mouseEvent: MouseEvent) {
            let mouseCoord = calcRelativeCoordinates(mouseEvent.clientX, mouseEvent.clientY);
            image.style.left = mouseCoord.left - clickShift.left + 'px';
            image.style.top = mouseCoord.top - clickShift.top + 'px';
        }
    }

    zoomHandler(e: WheelEvent) {
        this.scale += e.deltaY * -0.001;
        // restrict scale
        this.scale = Math.min(Math.max(0.125, this.scale), 4);
        this.image.style.transform = `scale(${this.scale})`;
    }

    getCoords(element: HTMLElement) {
        var box = element.getBoundingClientRect();
        return {
            top: box.top - window.scrollY,
            left: box.left - window.screenX
        };
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        switch (name) {
            case 'path':
                this.image.src = newValue;
                break;
            case 'file':
                this.image.title = newValue;
                break;
        }
    }
}
customElements.define('si-picture', SiPicture);

export default SiPicture;