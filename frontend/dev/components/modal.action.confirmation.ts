import { Component, Input } from '@angular/core'
import { MzBaseModal } from 'ngx-materialize'
import { LanguageService } from '../services/app.language'

// El componente base para el modal que desplegara un mensaje de advertencia y 
// pedira confirmacion del usuario antes de continuar con la accion solicitada
export abstract class ActionConfirmationModalComponent extends MzBaseModal {
  
  // Las opciones de configuracion del modal
  modalOptions = {
    // el modal no se cerrara aunque el usuario haga clic fuera de el
    dismissible: false 
  }

  // El titulo del modal a desplegar
  @Input()
  title: string = null

  // El mensaje a desplegar dentro del modal
  @Input()
  message: string = null

  @Input()
  parent: any = null

  // Constructor del componente donde importaremos una instancia del servicio 
  // de idioma
  constructor(
    protected langManager: LanguageService
  ) {
    super() // invocamos el constructor de la clase padre
  }

  // Esta funcion se invoca cuando el usuario confirma que desea continuar con 
  // la accion
  abstract onActionConfirmed(): void
}
