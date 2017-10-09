import { Component, OnInit, Input } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService, MzBaseModal } from 'ng2-materialize'
import { ProgressModalComponent } from './modal.please.wait'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { SearchComponent } from './app.search'
import { AreaDocumentSearchModalComponent } from './modal.search.area'

// Este componente define el comportamiento de la pagina donde el usuario puede 
// visualizar los documentos de laboratorios
@Component({
  templateUrl: '../templates/modal.search.lab.html'
})
export class LabDocumentSearchModalComponent 
  extends AreaDocumentSearchModalComponent
{
  // El constructor de este componente, inyectando los servicios requeridos
  constructor(
    server: BackendService,
    toastManager: ToastService,
    global: GlobalElementsService,
    langManager: LanguageService,
    modalManager: MzModalService,
    formBuilder: FormBuilder
  ) {
    // invocamos el constructor de la clase padre
    super(server, toastManager, global, langManager, modalManager, formBuilder)
  }

  // Esta funcion se invoca cuando el formulario de captura de documento es 
  // enviado al servidor
  onLabDocumentSearch(): void {
    let data = new FormData()
    data.append(
      'start_date', 
      $('input[type="hidden"][name="start-date_submit"]').val()
    )
    data.append(
      'end_date', 
      $('input[type="hidden"][name="end-date_submit"]').val()
    )
    data.append(
      'producer_id', 
      this.defaultDocumentSearchForm.controls.producer.value
    )

    // mostramos el modal de espera
    let modal = this.modalManager.open(ProgressModalComponent)
    
    // enviamos los datos al servidor
    this.server.create(
      'search-lab',
      data,
      (response: BackendResponse) => {
        // al responder el servidor, cerramos el modal de espera
        modal.instance.modalComponent.close()

        // si el servidor respondio con exito, reiniciamos el formulario para 
        // que el usuario capture un nuevo documento
        if (response.meta.return_code == 0) {
          this.parent.searchResults = response.data
          this.parent.hasSearchResults = response.data.length > 0
        } else {
          // notificamos al usuario del resultado obtenido
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'search-default',
              response.meta.return_code
            )
          )
        }
      } // (response: BackendResponse)
    ) // this.server.create
  } // onDefaultDocumentUpload(): void
}