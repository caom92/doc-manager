import { Component, OnInit } from '@angular/core'
import { GlobalElementsService } from '../services/app.globals'
import { BackendService } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { LanguageService } from '../services/app.language'
import { MzModalService, MzBaseModal } from 'ng2-materialize'
import { ProgressModalComponent } from './modal.please.wait'

// Componente que define el comportamiento de la pagina de editar perfil de 
// usuario
@Component({
  templateUrl: '../templates/app.edit.profile.html'
})
export class EditProfileComponent implements OnInit
{
  // Interfaz que representa el contenido y las reglas de validacion del 
  // formulario para editar la contraseña
  passwordEditionForm: FormGroup  

  // Interfaz que representa el contenido y las reglas de validacion del 
  // formulario para editar el nombre de usuario
  usernameEditionForm: FormGroup

  // El constructor del componente importando los servicios y componentes 
  // necesarios
  constructor(
    private global: GlobalElementsService,
    private server: BackendService,
    private toastManager: ToastService,
    private formBuilder: FormBuilder,
    private langManager: LanguageService,
    private modalManager: MzModalService
  ) {
  }

  // Esta funcion se invoca cuando el componente es inicializado
  ngOnInit(): void {
    // inicializamos las reglas de validacion del formulario de edicion de 
    // contraseña
    this.passwordEditionForm = this.formBuilder.group({
      oldPassword: [ null, Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])],
      newPasswordConfirmation: [ null, Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ]) ],
      newPassword: [ null, Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ]) ]
    }, { 
      validator: function(group: FormGroup) {
        // es necesario comparar los campos de la nueva contraseña y de la 
        // confirmacion de la nueva contraseña para asegurarse de que sean 
        // iguales
        let password = group.controls['newPassword'].value 
        let passwordConfirmation = 
          group.controls['newPasswordConfirmation'].value
        
        // si no lo son, hay que retornar una bandera de error que activara el 
        // mensaje de error a desplegar
        return (password === passwordConfirmation) ? 
          null 
          : { arePasswordsDifferent: true }
      }
    })

    // hacemos lo mismo para el formulario de edicion de nombre de usuario
    this.usernameEditionForm = this.formBuilder.group({
      newUsername: [ null, Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])],
      password: [ null, Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])]
    })
  }

  // Esta funcion es invocada cada vez que se hace clic en el boton de enviar 
  // del formulario de edicion de contraseña
  onPasswordEditionFormSubmit(): void {
    // desplegamos el modal de progreso
    let modal = this.modalManager.open(ProgressModalComponent)

    // recuperamos los datos capturados en el formulario
    let data = new FormData()
    data.append('user_id', this.global.userID.toString())
    data.append('password', this.passwordEditionForm.value.oldPassword)
    data.append('new_password', this.passwordEditionForm.value.newPassword)

    // los enviamos al servidor
    this.server.write(
      'change-password',
      data,
      (response: any) => {
        // cerramos el modal
        modal.instance.modalComponent.close()

        // damos retroalimentacion al usuario del resultado de esta opreacion
        this.toastManager.showText(
          this.langManager.getServiceMessage(
            'change-password', 
            response.meta.return_code
          )
        )
      }, // (response: Response)
      BackendService.url.fsm
    ) // this.server.update
  } // onPasswordEditionFormSubmit()

  // Esta funcion es invocada cada vez que se hace clic en el boton de enviar 
  // del formulario de edicion de nombre de usuario
  onUsernameEditionFormSubmit(): void {
    // desplegamos el modal de progreso
    let modal = this.modalManager.open(ProgressModalComponent)

    // primero recuperamos los datos capturados del formulario
    let newUsername = this.usernameEditionForm.value.newUsername
    let data = new FormData()
    data.append('new_username', newUsername)
    data.append('password', this.usernameEditionForm.value.password)

    // luego los enviamos al servidor
    this.server.write(
      'change-username',
      data,
      (response: any) => {
        // cerramos el modal
        modal.instance.modalComponent.close()

        // damos retroalimentacion al usuario del resultado de esta operacion
        this.toastManager.showText(
          this.langManager.getServiceMessage(
            'change-username', response.meta.return_code
          )
        )

        // si el cambio se realizo con exito en la base de datos, hay que 
        // actualizar la copia que tenemos en memoria local
        if (response.meta.return_code == 0) {
          this.global.loginName = newUsername
        }
      }, // (response: Response)
      BackendService.url.fsm
    ) // this.server.update
  } // onUsernameEditionFormSubmit()
} // export class EditProfileComponent implements OnInit