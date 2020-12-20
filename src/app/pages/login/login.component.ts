import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Servicos } from 'src/app/Services/servicos.service';
import {MessageService} from 'primeng/api';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  msgs = [];
  blocked = false;
  usuario = '';
  senha = '';
  validaUsuario = false;
  validaSenha = false;

  constructor(
    private router: Router,
    private httpServicos: Servicos,
    private messageService: MessageService
    ) { }

    ngOnInit(): void {
      this.senha = environment.senhaLogin;
      this.usuario = environment.usrLogin;
    }

    LogarUsuario() {
      this.messageService.clear();
      this.blocked = true;
      this.ValidaUsuario();
      if(!this.validaUsuario && !this.validaSenha) {
        // -> Chama o serviço de autenticação.
        // console.log('Usuário: ' + this.usuario);
        // console.log('Senha: ' + this.senha);

        this.httpServicos.Logar(this.usuario, this.senha).subscribe((ret: any) => {
          // console.log(ret);
          this.router.navigate(['/home']);
          this.blocked = false;
        }, (err) => {
          // console.log(err.error);
          this.blocked = false;
          this.messageService.add({severity:'error', summary:'Erro: ', detail: err.error});
        });
      }
      else {
        this.blocked = false;
      }
    }

    ValidaUsuario() {
      this.validaUsuario = false;
      this.validaSenha = false;

      if(this.usuario.length > 0) {
        this.validaUsuario = false;
      } else
      {
        this.validaUsuario = true;
      }

      if(this.senha.length > 0) {
        this.validaSenha = false;
      } else {
        this.validaSenha = true;
      }
    }
  }
