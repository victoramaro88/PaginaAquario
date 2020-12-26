import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ConfigAquarioModel } from '../Models/configAquario.model';

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

    public GetValores() {
      return this.http.get<ConfigAquarioModel>(`${environment.urlAPI}Config/RetornaInfo`);
    }

    public VerificaSenhaSecundaria(idConf: number, snhSec: string) {
      return this.http.get<boolean>(`${environment.urlAPI}Config/VerificaSenhaSecundaria/${idConf}/${snhSec}`);
    }

    public AtivaFuncoes(idConf: number, funcionalidade: string, flag: boolean) {
      return this.http.get<string>(`${environment.urlAPI}Config/AtivaFuncoes/${idConf}/${funcionalidade}/${flag}`);
    }

    public ManterOpcoes(idConfig: number, tempMaxResfr: number, tempMinAquec: number, tempDesliga: number, iluminHoraLiga: string, iluminHoraDesliga: string) {
      return this.http.get<string>(`${environment.urlAPI}Config/ManterOpcoes/${idConfig}/${tempMaxResfr}/${tempMinAquec}/${tempDesliga}/${iluminHoraLiga}/${iluminHoraDesliga}`);
    }
  }
