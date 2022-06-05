import "../less/main.less";

import { Blindnet } from "@blindnet/sdk-javascript";
import { createUserToken } from "@blindnet/token-generator";

const appId = "3544e7cd-64a9-41b7-88dc-397bfdaeeaf3";
const appKey =
  "zB5IiU0xzkVdsH4NMXxrF90ZISL5kJnTHlt7h/Wbi/qVhch7Fw8J5AQ5j2PazaG5q114uApZRH4X1/kTKVx0Cw==";
const aliceId = "alice";
const groupId = "test-group";
const token = await createUserToken(aliceId, groupId, appId, appKey);

const endpoint = "https://test.blindnet.io";
const blindnet = Blindnet.init(token, endpoint);

document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();
  e.stopImmediatePropagation();
  Blindnet.deriveSecrets(document.getElementById("secret")).then(
    ({ appSecret, blindnetSecret }) => {
      blindnet.connect(blindnetSecret).then(() => {
        /*
        const file = document.getElementById("file-pick").files[0];
        blindnet
          .capture(file)
          .forUser(aliceId)
          .encrypt()
          .then((encryptedData) => {
            
          });
          */
      });
    }
  );
});
