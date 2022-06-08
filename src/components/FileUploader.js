import { Blindnet, util } from "@blindnet/sdk-javascript";
import { createUserToken } from "@blindnet/token-generator";

export class FileUploader extends HTMLElement {
  static get observedAttributes() {
    return ["type"];
  }

  constructor() {
    super();
    const template = document.createElement("template");
    template.innerHTML = `
      <style type="text/css">
        ${this._getStyle()}
      </style>
      ${this._getTemplate()}
    `;
    this.attachShadow({ mode: "open" }).appendChild(
      template.content.cloneNode(true)
    );
    this._form = this.shadowRoot.getElementById("form");

    const appId = "276f6180-867e-4f96-b36c-1e61c4c92c99";
    const appKey =
      "MYy0KMT1yOJTliHGOoOb5gRWWFi/OTgELnUtyqPWfFFp+drOQnoQRtUme5QBNaw+lOYw4EJdUBKPHQkyyz/WNA==";

    this._aliceId = "Sylvain Gougouzian";
    const groupId = "dev-in";
    const endpoint = "https://test.blindnet.io";
    createUserToken(this._aliceId, groupId, appId, appKey).then((token) => {
      this._blindnet = Blindnet.init(token, endpoint);
    });
  }

  connectedCallback() {
    this._form.addEventListener(
      "submit",
      (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        Blindnet.deriveSecrets(this.shadowRoot.getElementById("secret")).then(
          ({ appSecret, blindnetSecret }) => {
            this._blindnet.connect(blindnetSecret).then(() => {
              const file = this.shadowRoot.getElementById("file-pick").files[0];
              if ("encrypt" === this.type) {
                this._blindnet
                  .capture(file)
                  .forUser(this._aliceId)
                  .encrypt()
                  .then(({ encryptedData }) => {
                    const a = document.createElement("a");
                    const blob = new Blob([util.toBase64(encryptedData)], {
                      type: "application/octet-stream",
                    });
                    a.href = window.URL.createObjectURL(blob);
                    a.download = "myfile.bnef";
                    a.click();
                  });
              }
            });
          }
        );
        return false;
      },
      false
    );
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name !== "type") {
      return;
    }
    this.type = newValue;
  }

  _getStyle() {
    return `
    form {
      display: flex;
      flex-direction: column;
      justify-items: center;
      align-items: center;
      width: 24rem;
      margin: 0 auto;
      background-color: rgb(148 163 184);
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
    }

    input {
      width: 100%;
      height: 1.5rem;
      margin-bottom: 1rem;
    }

    input[type="file"] {
      background-color: white;
    }

    button {
      border-radius: 0.5rem;
      background-color: rgb(59 130 246);
      border: 1px solid rgb(59 130 246);
      color: rgb(239 246 255);
      box-shadow: 0 0 #0000, 0 0 #0000, 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
      width: 100%;
      padding: 0.5rem 0;
    }

    button:hover {
      background-color: rgb(96 165 250);
    }
    `;
  }

  _getTemplate() {
    return `
    <form id="form" enctype="multipart/form-data">
      <slot name="content"></slot>
      <input id="secret" type="text" placeholder="Your secret phrase" />
      <input id="file-pick" type="file" />
      <button type="submit">${this.getAttribute("type")}</button>
    </form>
    `;
  }

  set type(type) {}

  get type() {
    return this.getAttribute("type");
  }
}

customElements.define("file-uploader", FileUploader);
