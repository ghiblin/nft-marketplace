import { create as ipfsHttpClient } from "ipfs-http-client";

// const projectId = ’23jSp...XXX;
// const projectSecret = ‘23...XXX’;
// const auth =
//     ‘Basic ’ + Buffer.from(projectId + ‘:’ + projectSecret).toString(‘base64’);
// const client = ipfsClient.create({
//     host: ‘ipfs.infura.io’,
//     port: 5001,
//     protocol: ‘https’,
//     headers: {
//         authorization: auth,
//     },
// });

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

/**
 * Utility: Upload content to to IPFS
 *
 * @param {string} data
 * @returns {Promise<string|undefined>} URL to IPFS
 */
async function _upload(data) {
  try {
    const added = await client.add(data, {
      progress: (prog) => {
        console.log(`received: ${prog}`);
      },
    });
    const url = `https://ipfs.infura.io/ipfs/${added.path}`;
    // after metadata is uploaded to IPFS, return the URL to use it in the transaction
    return url;
  } catch (error) {
    console.error("Failed to uploading to IPFS:", error);
  }
}

/**
 * Upload image file to IPFS
 *
 * @param {*} file
 * @returns {Promise<string|undefined>} URL to IPFS
 */
export async function uploadFileToIPFS(file) {
  // validate arguments
  if (!file) return;

  // upload file to IPFS
  const url = await _upload(file);

  return url;
}

/**
 * Upload NFT metadata to IPFS
 *
 * @param {string} name
 * @param {string} description
 * @param {string} fileUrl
 * @returns {Promise<string|undefined>} URL to IPFS
 */
export async function uploadMetadataToIPFS(name, description, fileUrl) {
  // validate arguments
  if (!name || !description || !fileUrl) return;

  const data = JSON.stringify({ name, description, image: fileUrl });

  const url = await _upload(data);

  return url;
}
