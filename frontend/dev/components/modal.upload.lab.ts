import { Component, OnInit, Input } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService, MzBaseModal } from 'ng2-materialize'
import { ProgressModalComponent } from './modal.please.wait'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ProducerDocumentUploadModalComponent, AutoCompleteObject } from './modal.upload.producer'

// Este componente define el comportamiento de la pagina donde el usuario 
// capturara un archivo de laboratorio
@Component({
  templateUrl: '../templates/modal.upload.lab.html'
})
export class LabDocumentUploadModalComponent extends ProducerDocumentUploadModalComponent
{
  // El archivo de solicitud elegido por el usuario
  selectedAnalysisFile: any = null

  // El archivo de resultado elegido por el usuario
  selectedResultFile: any = null

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

  // Esta funcion se invoca cuando el usuario elije un archivo de solicitud
  onAnalysisFileSelected(event: any): void {
    // borramos el archivo elegido anteriormente
    this.selectedAnalysisFile = null
    
    // recuperamos el archivo elegido
    let files = event.srcElement.files
    
    // si el usuario subio un archivo, lo guardamos para su futuro uso
    if (files.length > 0) {
      this.selectedAnalysisFile = files[0]
    }
  }

  // Esta funcion se invoca cuando el usuario elije un archivo de resultado
  onResultFileSelected(event: any): void {
    // borramos el archivo elegido anteriormente
    this.selectedResultFile = null
    
    // recuperamos el archivo elegido
    let files = event.srcElement.files
    
    // si el usuario subio un archivo, lo guardamos para su futuro uso
    if (files.length > 0) {
      this.selectedResultFile = files[0]
    }
  }

  // Esta funcion se invoca cuando el usuario hace clic en el boton de capturar 
  // documento
  onLabDocumentUpload(): void {
    // preparamos los datos que seran enviados al servidor
    let data = new FormData()
    data.append('document_type_id', this.selectedDocumentTypeID.toString())
    data.append('capture_date', this.global.getFormattedDate())
    data.append(
      'file_date', 
      $('input[type="hidden"][name="document-date_submit"]').val()
    )
    data.append('zone', this.defaultDocumentUploadForm.controls.zone.value)
    data.append('ranch', this.defaultDocumentUploadForm.controls.ranch.value)
    data.append(
      'producer', 
      this.defaultDocumentUploadForm.controls.producer.value
    )
    data.append(
      'analysis_file', 
      this.selectedAnalysisFile, 
      this.selectedAnalysisFile.name
    )
    data.append(
      'result_file', 
      this.selectedResultFile, 
      this.selectedResultFile.name
    )

    // mostramos el modal de espera
    let modal = this.modalManager.open(ProgressModalComponent)

    // enviamos los datos al servidor
    this.server.create(
      'capture-lab',
      data,
      (response: BackendResponse) => {
        // al responder el servidor, cerramos el modal de espera
        modal.instance.modalComponent.close()

        // notificamos al usuario del resultado obtenido
        this.toastManager.showText(
          this.langManager.getServiceMessage(
            'capture-lab',
            response.meta.return_code
          )
        )

        // si el servidor respondio con exito, reiniciamos el formulario para 
        // que el usuario capture un nuevo documento
        if (response.meta.return_code == 0) {
          this.defaultDocumentUploadForm.reset()
        }
      } // (response: BackendResponse)
    ) // this.server.create
  }
}