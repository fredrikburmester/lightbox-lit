import { LitElement, html, css } from 'lit';
import {customElement, query, property, state } from 'lit/decorators';
import { Image } from '../image';

@customElement('lightbox-card')
class LightboxCardElement extends LitElement {
    @property() src!: string;

    @property() images!: string;

    @state() private current = 0 as number
    @state() private loading = false as boolean
    private url = "" as string
    private imagesArr: Array<Image> = []

    constructor() {
        super();
        this.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    static styles = [css`
        :host {
            display: none;
        }
        #background {
            display: grid;
            width: 100vw;
            height: 100vh;
            position: fixed;
            top: 0;
            left: 0;
            background-color: rgba(0,0,0,0.8);
        }
        img {
            display: grid;
            place-self: center;
            max-width: 95vw;
            max-height: 95vh;
        }
        .line {
            position: fixed;
            background-color: white;
            top: 40px;
            right: 40px;
            transition: all 0.2s linear;
        }
        #line1 {
            transform: rotate(45deg);
            height: 2px;
            width: 30px;
        }
        #line2 {
            transform: rotate(-45deg);
            height: 2px;
            width: 30px;
        }
        .close {
            position: fixed;
            top: 20px;
            right: 30px;
            width: 50px;
            height: 50px;
            z-index: 99;
            cursor: pointer;
            
        }
        .close:hover ~ .line {
            background-color: rgb(253, 187, 24);
            /* box-shadow: 0 0 10px white; */
            transition: all 0.2s linear;
        }
        .loader {
            display: grid;
            place-self: center;
            border: 8px solid black; /* Light grey */
            border-top: 8px solid #ffae00; /* Blue */
            border-radius: 50%;
            width: 35px;
            height: 35px;
            animation: spin 1.3s ease infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .hidden {
            display: none;
        }
    `];

    connectedCallback() {
        super.connectedCallback()
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));

        // Get the images
        this.imagesArr = JSON.parse(this.images)

        // Set the first image
        if(!!this.imagesArr && this.imagesArr.length > 0) {
            this.current = 0
            this.url = this.imagesArr[this.current].src
        } else if (!!this.src && this.src.length > 0) {
            this.url = this.src
        }

        this.style.display = 'block'
    }

    handleKeyDown(e: KeyboardEvent) {
        if(e.key == "ArrowRight")
            this.next()
        else if(e.key == "ArrowLeft")
            this.prev()
        else if(e.key == "Escape")
            this.close()
    }

    close() {
        this.style.display = 'none';
    }

    handleLoading() {
        const loader = this.renderRoot.querySelector('#loader') as HTMLElement
        if( !!loader ) {
            loader.classList.toggle('hidden')
        } 
        
        const img = this.renderRoot.querySelector('#img') as HTMLElement
        if(!!img) {
            img.classList.toggle('hidden')
            img.addEventListener('load', () => this.handleLoading())
        }
    }

    next() {
        this.handleLoading()
        this.current = this.current + 1 < this.imagesArr.length ? this.current + 1 : 0;
        this.url = this.imagesArr[this.current].src;
    }
    
    prev() {
        this.current = this.current - 1 >= 0 ? this.current - 1 : this.imagesArr.length - 1;
        this.url = this.imagesArr[this.current].src;
    }

    render() {
        return html`
            <div id="background">
            <div id="loader" class="hidden loader"></div>
            <img id="img" src="${this.url}">
                <div @click="${this.close}" class="close"></div>
                <div id="line1" class="line"></div>
                <div id="line2" class="line"></div>
            </div>
        `;
    }
}