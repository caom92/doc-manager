import { Component, OnInit } from '@angular/core'
import { GlobalElementsService } from '../services/app.globals'
import { BackendService } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { LanguageService } from '../services/app.language'
import { MzModalService, MzBaseModal } from 'ng2-materialize'
import { ProgressModalComponent } from './modal.please.wait'

// Este componente describe el comportamiento de la pagina donde el usuario 
// administra la informacion de los usuarios
@Component({
  templateUrl: '../templates/app.users.html'
})
export class UsersComponent implements OnInit
{
  // La lista de usuarios a desplegar en la pantalla
  users = []

  // El constructor del componente donde importamos todos los servicios 
  // requeridos
  constructor(
    private langManager: LanguageService,
    private global: GlobalElementsService,
    private modalManager: MzModalService,
    private server: BackendService,
    private toastManager: ToastService
  ) {
  }

  // Esta funcion se invoca cuando el componente es inicializado
  ngOnInit(): void {
    // desplegamos el modal de espera
    let modal = this.modalManager.open(ProgressModalComponent)

    // solicitamos al servidor la lista de usuarios
    this.server.write(
      'list-users',
      new FormData(),
      (response: any) => {
        // cuando el servidor responda, cerramos el modal de espera
        modal.instance.modalComponent.close()

        // revisamos si el servidor respondio con exito
        if (response.meta.return_code == 0) {
          // si asi fue, guardamos la lista de usuarios
          this.users = response.data
        } else {
          // en caso de que el servidor respondiera con un error, notificamos 
          // al usuario
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'list-users',
              response.meta.return_code
            )
          )
        } // if (response.meta.return_code == 0)
      }, // (response: any)
      BackendService.url.fsm
    ) // this.server.update
  } // ngOnInit(): void

  // Esta funcion se invoca cuando el usuario hace clic en el switch que 
  // controla la activacion del usuario
  onToggleUserActivation(userIdx: number, isActive: boolean): void {
    // preparamos los datos a enviar al servidor
    let data = new FormData()
    data.append('user_id', this.users[userIdx].id)
    
    // desplegamos el modal de espera
    let modal = this.modalManager.open(ProgressModalComponent)

    // solicitamos al servidor invertir la activacion del usuario especificado
    this.server.write(
      'toggle-account-activation',
      data,
      (response: any) => {
        // cerramos el modal de espera cuando el servidor responda
        modal.instance.modalComponent.close()

        // revisamos si el servidor respondio con exito
        if (response.meta.return_code == 0) {
          // si asi fue, invertimos la activacion del usuario en la pantalla
          this.users[userIdx].is_active = isActive
        } else {
          // en caso contrario, dejamos la activacion del usuario en su estado 
          // actual
          this.users[userIdx].is_active = !isActive

          // y notificamos al usuario del error
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'toggle-account-activation',
              response.meta.return_code
            )
          )
        } // if (response.meta.return_code == 0)
      }, // (response: any)
      BackendService.url.fsm
    ) // this.server.update
  } // onToggleUserActivation(userIdx: number, isActive: boolean): void
} // export class UsersComponent implements OnInit