import { Component, OnInit } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService } from 'ng2-materialize'
import { ProgressModalComponent } from './modal.please.wait'
import { LabDocumentUploadModalComponent } from './modal.upload.lab'
import { GuaranteeDocumentUploadModalComponent } from './modal.upload.guarantee'
import { ProcedureDocumentUploadModalComponent } from './modal.upload.procedure'

// Componente que define el comportamiento de la pagina donde el usuario puede 
// capturar nuevos documentos
@Component({
  templateUrl: '../templates/app.upload.html'
})
export class UploadComponent implements OnInit
{
  // El tipo de documento elegido por el usuario
  selectedDocument: any = null

  // La lista de los diferentes tipos de documentos que estan en el sistema
  documents: Array<any> = []

  // El constructor de este componente, inyectando los servicios requeridos
  constructor(
    private server: BackendService,
    private toastManager: ToastService,
    private global: GlobalElementsService,
    private langManager: LanguageService,
    private modalManager: MzModalService
  ) {
  }

  // Esta funcion se ejecuta al iniciar la pagina
  ngOnInit(): void {
    // desplegamos el modal de espera
    let modal = this.modalManager.open(ProgressModalComponent)

    // enviamos los datos al servidor
    this.server.read(
      'list-documents',
      {},
      (response: BackendResponse) => {
        // cuando el servidor responda, cerramos el modal de espera
        modal.instance.modalComponent.close()
        
        // revisamos si el servidor respondio con exito
        if (response.meta.return_code == 0) {
          // si asi fue, obtenemos la lista de documentos
          this.documents = response.data
        } else {
          // si el servidor respondio con un error, notificamos al usuario
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'list-documents',
              response.meta.return_code
            )
          )
        } // if (response.meta.return_code == 0)
      } // (response: any)
    ) // this.server.read
  } // ngOnInit(): void

  // Esta funcion se invoca cuando el usuario elije un documento de la lista de 
  // seleccion
  onDocumentTypeSelected(): void {
    // dependiendo del tipo de documento elegido, se cargara el componente que 
    // le corresponde donde el usuario podra capturar el documento y la info. 
    // relacionada con el
    switch (this.selectedDocument.id) {
      case 1:
        this.modalManager.open(LabDocumentUploadModalComponent, {
          selectedDocumentTypeID: this.selectedDocument.id
        })
      break

      case 2:
        this.modalManager.open(GuaranteeDocumentUploadModalComponent, {
          selectedDocumentTypeID: this.selectedDocument.id
        })
      break

      case 3:
        this.modalManager.open(ProcedureDocumentUploadModalComponent, {
          selectedDocumentTypeID: this.selectedDocument.id
        })
      break
    } // switch (this.selectedDocument.name)
  } // onDocumentTypeSelected(): void
} // export class UploadComponent implements OnInit