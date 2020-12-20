import { Component, OnInit, ɵConsole } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ConfigAquarioModel } from 'src/app/Models/configAquario.model';
import { Servicos } from 'src/app/Services/servicos.service';
import { environment } from 'src/environments/environment';

declare var $ : any; //-> Usando jquery.

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MessageService]
})

export class HomeComponent implements OnInit {
  msgs = [];
  blocked = false;
  valoresRetorno: ConfigAquarioModel = new ConfigAquarioModel();
  valoresNovos: ConfigAquarioModel = new ConfigAquarioModel();
  intervalo: any;
  flagEditarParametros = false;
  senhaSecundariaForm = '';
  validaCampoSenhaSec = true;
  senhaSecundariaInvalida = false;
  indexTab = 0;

  constructor(
    private router: Router,
    private httpServicos: Servicos,
    private messageService: MessageService,
    ) { }

    ngOnInit(): void {
      this.senhaSecundariaForm = environment.senhaSecundaria;
      this.CarregaInformacoes();
      this.SetarCarregamentoAutomático();
    }

    // ->TIMER
    timeLeft: number = 5;
    interval;
    startTimer() {
      this.interval = setInterval(() => {
        if(this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.timeLeft = 5;
        }
      },1000)
    }

    CarregaInformacoes() {
      this.blocked = true;
      this.httpServicos.GetValores().subscribe((ret: ConfigAquarioModel) => {
        // console.log(ret);
        this.valoresRetorno = ret;
        console.log(this.valoresRetorno);
        this.blocked = false;
        this.startTimer();
      }, (err) => {
        // console.log(err.error);
        this.blocked = false;
        this.messageService.add({severity:'error', summary:'Erro: ', detail: err.error});
      });
    }

    SetarCarregamentoAutomático() {
      this.intervalo = setInterval(() => {
        this.httpServicos.GetValores().subscribe((ret: ConfigAquarioModel) => {
          this.valoresRetorno = ret;
          // console.log(this.valoresRetorno);
          this.blocked = false;
        }, (err) => {
          // console.log(err.error);
          this.blocked = false;
          this.messageService.add({severity:'error', summary:'Erro: ', detail: err.error});
        });
        this.timeLeft -= 1;
      }, 5000);
    }

    AlteraStatusFlag(parametro: string, flag: boolean) {
      this.blocked = true;
      this.httpServicos.AtivaFuncoes(this.valoresRetorno.idConfig, parametro, flag).subscribe((ret: string) => {
        // console.log(ret);
        this.messageService.add({severity:'success', summary:'Comando enviado com sucesso!', detail: ''})
        this.TimerMensagem(2000);
        this.blocked = false;
      }, (err) => {
        // console.log(err.error);
        this.blocked = false;
        this.messageService.add({severity:'error', summary:'Erro: ', detail: err.error});
      });
    }

    EditarParametros() {
      if(!this.flagEditarParametros) {
        let objValores = new ConfigAquarioModel();
        objValores.idConfig = this.valoresRetorno.idConfig;
        objValores.descLocal = this.valoresRetorno.descLocal;
        objValores.dataAtualizacao = this.valoresRetorno.dataAtualizacao;
        objValores.infoMACUltimoAcesso = this.valoresRetorno.infoMACUltimoAcesso;
        objValores.temperatura = this.valoresRetorno.temperatura;
        objValores.tempMaxResfr = this.valoresRetorno.tempMaxResfr;
        objValores.tempMinAquec = this.valoresRetorno.tempMinAquec;
        objValores.tempDesliga = this.valoresRetorno.tempDesliga;
        objValores.iluminHoraLiga = this.valoresRetorno.iluminHoraLiga;
        objValores.iluminHoraDesliga = this.valoresRetorno.iluminHoraDesliga;
        objValores.flagCirculador = this.valoresRetorno.flagCirculador;
        objValores.flagBolhas = this.valoresRetorno.flagBolhas;
        objValores.flagIluminacao = this.valoresRetorno.flagIluminacao;
        objValores.flagAquecedor = this.valoresRetorno.flagAquecedor;
        objValores.flagResfriador = this.valoresRetorno.flagResfriador;
        objValores.flagEncher = this.valoresRetorno.flagEncher;

        this.valoresNovos = objValores;
      }
    }

    ValidaSenhaSecundaria() {
      this.senhaSecundariaInvalida = false;
      if(this.senhaSecundariaForm.length > 0) {
        this.blocked = true;
        this.httpServicos.VerificaSenhaSecundaria(this.valoresRetorno.idConfig, this.senhaSecundariaForm).subscribe((ret: boolean) => {
          // console.log(ret);
          if(ret) {
            this.senhaSecundariaForm = environment.senhaSecundaria;
            $('#modalMensagem').modal('hide');
            this.flagEditarParametros = !this.flagEditarParametros;
          } else {
            this.senhaSecundariaInvalida = true;
          }
          this.blocked = false;
          this.validaCampoSenhaSec = true;
        }, (err) => {
          // console.log(err.error);
          this.blocked = false;
          this.messageService.add({severity:'error', summary:'Erro: ', detail: err.message});
        });
      } else {
        this.validaCampoSenhaSec = false;
      }
    }

    ngOnDestroy() {
      if (this.intervalo) {
        clearInterval(this.intervalo);
      }
      if(this.interval) {
        clearInterval(this.interval);
      }
    }

    Logout() {
      this.router.navigate(['login']);
    }

    TimerMensagem(tempoMilis: number) {
      setTimeout(()=>{
        this.msgs = [];
      }, tempoMilis);
    }

    CancelaOpParametros() {
      this.indexTab = 0;
    }
  }
