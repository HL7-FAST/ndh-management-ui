import { Injectable } from '@angular/core';
import { AES, enc } from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private key = "whatAnIncrediblySecureKey";

  constructor() { }

  public setItem(key: string, value: string) {
    localStorage.setItem(key, this.encrypt(value));
  }

  public getItem(key: string) {
    let data = localStorage.getItem(key)|| "";
    return this.decrypt(data);
  }
  public removeItem(key: string) {
    localStorage.removeItem(key);
  }

  public clearItem() {
    localStorage.clear();
  }

  private encrypt(txt: string): string {
    return AES.encrypt(txt, this.key).toString();
  }

  private decrypt(txtToDecrypt: string) {
    return AES.decrypt(txtToDecrypt, this.key).toString(enc.Utf8);
  }

}
