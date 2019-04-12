import { Component, Input } from '@angular/core'
import { LanguageService } from '../services/app.language'
import { ActionConfirmationModalComponent } from './modal.action.confirmation'
import { BackendResponse, BackendService } from '../services/app.backend'
import { ToastService } from '../services/app.toast'

// El componente del modal que pide confirmacion del usuario para borrar un 
// documento elegido de la lista de resultados
@Component({
  templateUrl: '../templates/modal.action.confirmation.html'
})
export class SignDocumentConfirmationModalComponent
  extends ActionConfirmationModalComponent {
    
  // El ID del documento en la BD
  @Input()
  document: any = null

  // Constructor del componente donde importaremos una instancia del servicio 
  // de idioma
  constructor(
    private server: BackendService,
    private toastManager: ToastService,
    protected langManager: LanguageService
  ) {
    super(langManager) // invocamos el constructor de la clase padre
  }

  // Esta funcion se invoca cuando el usuario confirma que desea continuar con 
  // la accion
  onActionConfirmed(): void {
    let docData = new FormData()

    docData.append('document_id', String(this.document.document_id))

    this.server.write(
      'sign-document',
      docData,
      (response: BackendResponse) => {
        // notificamos al usuario del resultado de la operacion
        if (response.meta.return_code == 0) {
          this.document.signed_by = Number(localStorage.getItem('user_id'))
          this.document.signer = localStorage.getItem('user_full_name')
        }
        this.toastManager.showText(
          this.langManager.getServiceMessage(
            'sign-*',
            response.meta.return_code
          )
        )
      }
    )
  }
}
