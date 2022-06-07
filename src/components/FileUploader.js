import { html, css, LitElement } from "lit";

export class FileUploader extends LitElement {
  static styles = css`
    p {
      color: blue;
    }
  `;

  static properties = {
    secret: { type: String },
  };

  constructor() {
    super();

    this.secret = "Somebody";
  }

  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}

customElements.define("file-uploader", FileUploader);
