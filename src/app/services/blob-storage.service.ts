import { Injectable } from '@angular/core';
import { BlobServiceClient } from '@azure/storage-blob';

@Injectable({
  providedIn: 'root'
})
export class BlobStorageService {

  constructor() { }

  async uploadFile(fileName: string, data: any) {
    const blobServiceClient = new BlobServiceClient('https://gbcstorageaccount.blob.core.windows.net/?sv=2022-11-02&ss=b&srt=sco&sp=rwlac&se=2040-10-18T04:51:47Z&st=2024-07-10T20:51:47Z&spr=https&sig=4rJ%2FzIY%2Fwn6msdrTPeYjU9W2z3uCYafyDMDvOj%2BEqbg%3D');
    const containerClient = blobServiceClient.getContainerClient('air-hockey');
    const blobClient = containerClient.getBlockBlobClient(fileName);
    await blobClient.uploadData(data);
  }

  async testListBlobs() {

    const blobServiceClient = new BlobServiceClient('https://gbcstorageaccount.blob.core.windows.net/?sv=2022-11-02&ss=b&srt=sco&sp=rwlac&se=2040-10-18T04:51:47Z&st=2024-07-10T20:51:47Z&spr=https&sig=4rJ%2FzIY%2Fwn6msdrTPeYjU9W2z3uCYafyDMDvOj%2BEqbg%3D');
    const containerClient = blobServiceClient.getContainerClient('air-hockey');

    
    const blobClient = containerClient.getBlockBlobClient('some-new-file');

    const value = 'here is some text';


    await blobClient.upload(value, value.length);

    let iter = containerClient.listBlobsFlat();
    let blobItem = await iter.next();
    let s = '';
    while (!blobItem.done) {
        //fileList.size += 1;
        s += `<option>${blobItem.value.name}</option>`;


        blobItem = await iter.next();
    }

    return s;

  }
}
