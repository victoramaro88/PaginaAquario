import { isNull } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ɵConsole } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ConfigAquarioModel } from 'src/app/Models/configAquario.model';
import { Servicos } from 'src/app/Services/servicos.service';
import { environment } from 'src/environments/environment';
import { isNullOrUndefined } from 'util';

declare var $ : any; //-> Usando jquery.

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MessageService]
})

export class HomeComponent implements OnInit {
  idUsr = 0;
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
  statusConexao = false;
  dataAtualizacaoFormatada = '';

  stateOptions = [
    { label: "Não", value: false },
    { label: "Sim", value: true }
  ];
  valorManual: boolean = false;

  constructor(
    private router: Router,
    private httpServicos: Servicos,
    private messageService: MessageService,
    ) { }

    ngOnInit(): void {
      this.idUsr = +sessionStorage.getItem('idUsr');
      this.senhaSecundariaForm = environment.senhaSecundaria;
      this.CarregaInformacoes();
      this.SetarCarregamentoAutomático();
    }

    CarregaInformacoes() {
      this.blocked = true;
      this.httpServicos.GetValores().subscribe((ret: ConfigAquarioModel) => {
        this.valoresRetorno = ret;
        // console.log(this.valoresRetorno);
        this.FormataDataAtualizacao(this.valoresRetorno.dataAtualizacao.toString());
        // this.statusConexao = true;
        // this.VerificaStatusConexao(new Date(this.valoresRetorno.dataAtualizacao.toString().replace('T', ' ')));

        this.valorManual = this.valoresRetorno.flagManual;
        this.valoresNovos.flagCirculador = this.valoresRetorno.flagCirculador;
        this.valoresNovos.flagBolhas = this.valoresRetorno.flagBolhas;
        this.valoresNovos.flagIluminacao = this.valoresRetorno.flagIluminacao;
        this.valoresNovos.flagAquecedor = this.valoresRetorno.flagAquecedor;
        this.valoresNovos.flagResfriador = this.valoresRetorno.flagResfriador;
        this.valoresNovos.flagEncher = this.valoresRetorno.flagEncher;

        this.blocked = false;
      }, (err) => {
        // console.log(err.error);
        this.blocked = false;
        this.statusConexao = false;
        if(err.status === 0) {
          this.messageService.add({severity:'error', summary:'Erro: ', detail: 'Falha na conexão, aguarde ou saia e tente novamente.'});
        } else {
          this.messageService.add({severity:'error', summary:'Erro: ', detail: err.message});
        }
      });
    }

    SetarCarregamentoAutomático() {
      this.blocked = true;
      this.intervalo = setInterval(() => {
        this.httpServicos.GetValores().subscribe((ret: ConfigAquarioModel) => {
          this.valoresRetorno = ret;
          // console.log(this.valoresRetorno);
          this.FormataDataAtualizacao(this.valoresRetorno.dataAtualizacao.toString());
          // this.statusConexao = true;
          // this.VerificaStatusConexao(new Date(this.valoresRetorno.dataAtualizacao.toString().replace('T', ' ')));

          this.valorManual = this.valoresRetorno.flagManual;
          this.valoresNovos.flagCirculador = this.valoresRetorno.flagCirculador;
          this.valoresNovos.flagBolhas = this.valoresRetorno.flagBolhas;
          this.valoresNovos.flagIluminacao = this.valoresRetorno.flagIluminacao;
          this.valoresNovos.flagAquecedor = this.valoresRetorno.flagAquecedor;
          this.valoresNovos.flagResfriador = this.valoresRetorno.flagResfriador;
          this.valoresNovos.flagEncher = this.valoresRetorno.flagEncher;

          this.messageService.clear();
          this.blocked = false;
        }, (err) => {
          this.LimpaInformacoes();
          this.blocked = false;
          this.statusConexao = false;
          if(err.status === 0) {
            this.messageService.clear();
            this.messageService.add({severity:'error', summary:'Erro: ', detail: 'Falha na conexão, aguarde ou saia e tente novamente.'});
          } else {
            this.messageService.clear();
            this.messageService.add({severity:'error', summary:'Erro: ', detail: err.message});
          }
        });
      }, 5000);
    }

    FormataDataAtualizacao(data: string) {
      if(data.length > 0) {
        this.dataAtualizacaoFormatada = data.substring(8,10) + '/' + data.substring(5,7) + '/' + data.substring(0,4)
        + '-' + data.substring(11,13) + ':' + data.substring(14,16) + ':' + data.substring(17,19);
        // console.log(this.dataAtualizacaoFormatada);

        this.VerificaStatusConexao(data);
      }
    }

    VerificaStatusConexao(valor: string) {
      // console.log(valor);
      const diaAtual = (new Date().getDate().toString().length === 1) ? '0' + new Date().getDate().toString() : new Date().getDate().toString();
      const mesAtual = ((+new Date().getMonth().toString() + 1).toString().length === 1) ? '0' + (+new Date().getMonth().toString() + 1).toString() : (+new Date().getMonth().toString() + 1).toString();
      const anoAtual = new Date().getFullYear().toString();
      const horaAtual = (new Date().getHours().toString().length === 1) ? '0' + new Date().getHours().toString() : new Date().getHours().toString();
      const minutoaAtual = (new Date().getMinutes().toString().length === 1) ? '0' + new Date().getMinutes().toString() : new Date().getMinutes().toString();
      const segundosaAtual = (new Date().getSeconds().toString().length === 1) ? '0' + new Date().getSeconds().toString() : new Date().getSeconds().toString();
      // console.log(diaAtual + '/' + mesAtual + '/' + anoAtual + ' - ' + horaAtual + ':' + minutoaAtual + ':' + segundosaAtual);
      // console.log('Dia: '+valor.substring(8,10) + ' / ' + diaAtual);
      // console.log('Mês: '+valor.substring(5,7) + ' / ' + mesAtual);
      // console.log('Ano: '+valor.substring(0,4) + ' / ' + anoAtual);
      // console.log('Hora: '+valor.substring(11,13) + ' / ' + horaAtual);
      // console.log('Minuto: '+valor.substring(14,16) + ' / ' + minutoaAtual);

      if(valor.substring(8,10) === diaAtual) {
        if(valor.substring(5,7) === mesAtual) {
          if(valor.substring(0,4) === anoAtual) {
            if(valor.substring(11,13) === horaAtual) {
              if(valor.substring(14,16) === minutoaAtual || (+valor.substring(14,16)) + 1 === +minutoaAtual || (+valor.substring(14,16)) + 2 === +minutoaAtual) {
                this.statusConexao = true;
                // let diferencaSegundos = +segundosaAtual - +valor.substring(17,19);
                // console.log(diferencaSegundos);
              } else {
                // console.log('minuto invalido');
                this.statusConexao = false;
                this.LimpaInformacoes();
              }
            } else {
              // console.log('hora invalida');
              this.statusConexao = false;
              this.LimpaInformacoes();
            }
          } else {

            // console.log('ano invalido');
            this.statusConexao = false;
            this.LimpaInformacoes();
          }
        } else {
          // console.log('mes invalido');
          this.statusConexao = false;
          this.LimpaInformacoes();
        }
      } else {
        // console.log('dia invalido');
        this.statusConexao = false;
        this.LimpaInformacoes();
      }
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
        if(err.status === 0) {
          this.messageService.add({severity:'error', summary:'Erro: ', detail: 'Falha na conexão com o banco de dados, saia e entre novamente.'});
        } else {
          this.messageService.add({severity:'error', summary:'Erro: ', detail: err.message});
        }
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
          if(err.status === 0) {
            this.messageService.add({severity:'error', summary:'Erro: ', detail: 'Falha na conexão com o banco de dados, saia e entre novamente.'});
          } else {
            this.messageService.add({severity:'error', summary:'Erro: ', detail: err.message});
          }
        });
      } else {
        this.validaCampoSenhaSec = false;
      }
    }

    ngOnDestroy() {
      if (this.intervalo) {
        clearInterval(this.intervalo);
      }
    }

    Logout() {
      this.router.navigate(['login']);
      sessionStorage.clear();
    }

    TimerMensagem(tempoMilis: number) {
      setTimeout(()=>{
        this.msgs = [];
      }, tempoMilis);
    }

    CancelaOpParametros() {
      this.indexTab = 0;
      this.valoresNovos.tempMaxResfr = this.valoresRetorno.tempMaxResfr;
      this.valoresNovos.tempMinAquec = this.valoresRetorno.tempMinAquec;
      this.valoresNovos.tempDesliga = this.valoresRetorno.tempDesliga;
      this.valoresNovos.iluminHoraLiga = this.valoresRetorno.iluminHoraLiga;
      this.valoresNovos.iluminHoraDesliga = this.valoresRetorno.iluminHoraDesliga;
    }

    LimpaInformacoes() {
      this.valoresRetorno = new ConfigAquarioModel();
      this.valoresNovos = new ConfigAquarioModel();
    }

    SalvaOpcoes() {
      this.blocked = true;

      // ->Formatando a temperatura
      this.valoresNovos.tempMaxResfr = this.FormataTemperatura(this.valoresNovos.tempMaxResfr);
      this.valoresNovos.tempMinAquec = this.FormataTemperatura(this.valoresNovos.tempMinAquec);
      this.valoresNovos.tempDesliga = this.FormataTemperatura(this.valoresNovos.tempDesliga);

      // ->Formatando a hora
      this.valoresNovos.iluminHoraLiga = this.FormataHora(this.valoresNovos.iluminHoraLiga);
      this.valoresNovos.iluminHoraDesliga = this.FormataHora(this.valoresNovos.iluminHoraDesliga);

      // console.log(this.valoresNovos);

      if(this.ValidaHora(this.valoresNovos.iluminHoraLiga)) {
        if(this.ValidaHora(this.valoresNovos.iluminHoraDesliga)) {
          this.httpServicos.ManterOpcoes(this.valoresNovos.idConfig, this.valoresNovos.tempMaxResfr, this.valoresNovos.tempMinAquec,
            this.valoresNovos.tempDesliga, this.valoresNovos.iluminHoraLiga, this.valoresNovos.iluminHoraDesliga).subscribe((ret: string) => {
              // console.log(ret);
              this.messageService.add({severity:'success', summary:'Informações salvas com sucesso!', detail: ''})
              this.TimerMensagem(2000);
              setTimeout(()=>{
                this.indexTab = 0;
              }, 2000);
              this.blocked = false;
            }, (err) => {
              // console.log(err.error);
              this.blocked = false;
              this.messageService.add({severity:'error', summary:'Erro: ', detail: err.message});
            });
          } else {
            this.blocked = false;
            this.messageService.add({severity:'error', summary:'Erro: ', detail: 'Horário de desligar luzes inválida'});
          }
        } else {
          this.blocked = false;
          this.messageService.add({severity:'error', summary:'Erro: ', detail: 'Horário de ligar luzes inválida'});
        }

      }

      FormataTemperatura(valor: number) {
        let valorArray = valor.toString().split('.');
        if(valorArray.length > 1) {
          if(valorArray[0].length === 1) {
            valor = valor * 10;
          }
          return valor;
        } else {
          if(valor.toString().length > 2) {
            return valor/100;
          } else {
            return valor;
          }
        }
      }

      FormataHora(valor: string) {
        let valorArray = valor.split(':');
        if(valorArray.length > 1) {
          return valor;
        } else {
          let hora = valor.substring(0, 2);
          let minuto = valor.substring(2,4);
          return hora + ':' + minuto;
        }
      }

      ValidaHora(valor: string) {
        let hora = valor.substring(0, 2);
        let minuto = valor.substring(3,5);

        if(hora.length === 2 && +hora >= 0 && +hora <= 23) {
          if(minuto.length === 2 && +minuto >= 0 && +minuto <= 60) {
            return true;
          }
          else {
            return false;
          }
        }
        else {
          return false;
        }
      }

    }
