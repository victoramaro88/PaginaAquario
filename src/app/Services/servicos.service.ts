import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Servicos {
  constructor(
    private http: HttpClient
    ) { }

    private httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'X-API-KEY': ''
      })
    };

    public Logar(username: string, password: string) {
      return this.http.get<any>(`${environment.urlAPI}LoginUsuario/LoginUsuario/` + username + '/' + password);
    }
  }
