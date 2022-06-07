import "../less/main.less";

import { Blindnet } from "@blindnet/sdk-javascript";
import { createUserToken } from "@blindnet/token-generator";

const appId = "276f6180-867e-4f96-b36c-1e61c4c92c99";
const appKey =
  "MYy0KMT1yOJTliHGOoOb5gRWWFi/OTgELnUtyqPWfFFp+drOQnoQRtUme5QBNaw+lOYw4EJdUBKPHQkyyz/WNA==";
const aliceId = "Sylvain Gougouzian";
const groupId = "dev-in";
const token = await createUserToken(aliceId, groupId, appId, appKey);

const endpoint = "https://test.blindnet.io";
const blindnet = Blindnet.init(token, endpoint);

document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();
  e.stopImmediatePropagation();
  Blindnet.deriveSecrets(document.getElementById("secret")).then(
    ({ appSecret, blindnetSecret }) => {
      blindnet.connect(blindnetSecret).then(() => {
        const file = document.getElementById("file-pick").files[0];
        blindnet
          .capture(file)
          .forUser(aliceId)
          .encrypt()
          .then((encryptedData) => {
            console.log(encryptedData);
          });
      });
    }
  );
});
