var node_cryptojs = require('node-cryptojs-aes');

// node-cryptojs-aes main object;
var CryptoJS = node_cryptojs.CryptoJS;

// custom json serialization format
var JsonFormatter = node_cryptojs.JsonFormatter;


const getData = async ({ query, token }) => {
  console.log(query)
  var encrypted = CryptoJS.AES.encrypt(JSON.stringify(query.replace(/('null')/g, "''")), 'MIIDDDCCAfQCAQAwgZIxCzAJBgNVBAYTAklOMRQwEgYDVQQIDAtNYWhhcmFzaHRy', { format: JsonFormatter });
  // console.log("encrypted ", encrypted)
  // convert CipherParams object to json string for transmission
  var encrypted_json_str = JSON.parse(encrypted.toString());
  // console.log("encrypted_json_str ", encrypted_json_str)

  const data = await fetch('https://grecokits.herokuapp.com/encryptionjwt.php', {
    body: JSON.stringify({ query: encrypted_json_str, token: token }),
    method: "POST"
  }).then(async (r) => {
    const data = await r.json()
    if (!data.result) {
      console.log("issues", data)
      return {
        status: 200,
        result: []
      }
    } else {
      return data
    }
  }).catch(e => {
    return e
  })
  return data
};

export default getData;