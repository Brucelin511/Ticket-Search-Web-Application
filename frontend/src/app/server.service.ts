import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ServerService {
  // configUrl = "http://ip-api.com/json";
  constructor(private http: HttpClient) { }
  getServers(prefix : string, parameterArr : string[][]) {
  	prefix += "?";
    for (let index in parameterArr) {
      prefix += parameterArr[index][0] + "=" + encodeURIComponent(parameterArr[index][1]) + "&";
    }
  	prefix = prefix.substr(0, prefix.length - 1);
  	console.log('angular=>nodejs',prefix);
    return this.http.get(prefix);
  }
}

