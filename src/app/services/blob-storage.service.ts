import { Injectable } from '@angular/core';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { PlayerAvatar } from '../models/player-avatar';
import { arrayBufferToString } from './utilities';

@Injectable({
  providedIn: 'root'
})
export class BlobStorageService {

  constructor() { }

  getBlobClient() : ContainerClient {
    const blobServiceClient = new BlobServiceClient('https://gbcstorageaccount.blob.core.windows.net/?sv=2022-11-02&ss=b&srt=sco&sp=rwlac&se=2040-10-18T04:51:47Z&st=2024-07-10T20:51:47Z&spr=https&sig=4rJ%2FzIY%2Fwn6msdrTPeYjU9W2z3uCYafyDMDvOj%2BEqbg%3D');
    const containerClient = blobServiceClient.getContainerClient('air-hockey');

    return containerClient;
  }

  async uploadFile(fileName: string, data: any) {

    const containerClient = this.getBlobClient();
    const blobClient = containerClient.getBlockBlobClient(fileName);
    await blobClient.uploadData(data);
  }

  async uploadTextFile(fileName: string, text: string) {

    const enc = new TextEncoder();

    const data = enc.encode(text)
    await this.uploadFile(fileName, data);
  }

  async uploadJSONObject(fileName: string, obj: any) {
    const json = JSON.stringify(obj);
    await this.uploadTextFile(fileName, json);
  }

  async getPlayers() {
    const containerClient =  this.getBlobClient();
    const blobClient = containerClient.getBlockBlobClient(`players.json`);
    const azureBlob = await blobClient.download();
    
    const blobBody = await azureBlob.blobBody;
    const arrayBuffer = await blobBody.arrayBuffer();
    const json = arrayBufferToString(arrayBuffer);
    const players: PlayerAvatar[]= JSON.parse(json);

    for(const player of players) {
      player.baseUrl = `https://gbcstorageaccount.blob.core.windows.net/air-hockey/player-avatars/${player.id}.jpg`;
    }

    return players;
    
  }



  async savePlayers(players: PlayerAvatar[]) {
    await this.uploadJSONObject(`players.json`, players);
  }

  // async testListBlobs() {

  //   const blobServiceClient = new BlobServiceClient('https://gbcstorageaccount.blob.core.windows.net/?sv=2022-11-02&ss=b&srt=sco&sp=rwlac&se=2040-10-18T04:51:47Z&st=2024-07-10T20:51:47Z&spr=https&sig=4rJ%2FzIY%2Fwn6msdrTPeYjU9W2z3uCYafyDMDvOj%2BEqbg%3D');
  //   const containerClient = blobServiceClient.getContainerClient('air-hockey');

    
  //   const blobClient = containerClient.getBlockBlobClient('some-new-file');

  //   const value = 'here is some text';


  //   await blobClient.upload(value, value.length);

  //   let iter = containerClient.listBlobsFlat();
  //   let blobItem = await iter.next();
  //   let s = '';
  //   while (!blobItem.done) {
  //       //fileList.size += 1;
  //       s += `<option>${blobItem.value.name}</option>`;


  //       blobItem = await iter.next();
  //   }

  //   return s;

  // }
}
