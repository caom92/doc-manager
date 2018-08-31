import { Component, Input, OnInit } from '@angular/core'
import { MzBaseModal, MzModalComponent } from 'ng2-materialize'
import { LanguageService } from '../services/app.language'
import { ActionConfirmationModalComponent } from './modal.action.confirmation'
import { SearchComponent } from './app.search'

// El componente del modal que pide confirmacion del usuario para borrar un 
// documento elegido de la lista de resultados
@Component({
  templateUrl: '../templates/modal.action.confirmation.html'
})
export class SignDocumentConfirmationModalComponent
  extends ActionConfirmationModalComponent {
  // El ID del documento en la BD
  @Input()
  documentID: number = null

  // Constructor del componente donde importaremos una instancia del servicio 
  // de idioma
  constructor(
    protected langManager: LanguageService
  ) {
    super(langManager) // invocamos el constructor de la clase padre
  }

  // Esta funcion se invoca cuando el usuario confirma que desea continuar con 
  // la accion
  onActionConfirmed(): void {
    this.parent.onSignDocumentClicked(
      this.documentID
    )
  } // onActionConfirmed(): void
} // export class DeleteDocumentConfirmation extends ActionConfirmationModalComponent