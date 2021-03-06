import { Component, OnInit, ComponentFactoryResolver } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService } from 'ngx-materialize'
import { ProgressModalComponent } from './modal.please.wait'
import { DynamicComponentResolver } from './dynamic.resolver'
import { LabDocumentReportModalComponent } from './modal.report.lab'
import { LabReportResultsComponent } from './report.lab'

// Este componente define el comportamiento de la pagina donde se generaran los 
// reportes de los documentos
@Component({
  templateUrl: '../templates/app.report.html'
})
export class ReportComponent
  extends DynamicComponentResolver
  implements OnInit {

  // El tipo de documento elegido por el usuario
  selectedDocument: {
    id: number,
    name: string
  } = null
  
  // La lista de los diferentes tipos de documentos que estan en el sistema
  documents: Array<{
    id: number,
    name: string
  }> = []

  // El componente que desplegara el reporte
  reportComponent: any = {
    hasData: true
  }

  // El constructor de este componente, inyectando los servicios requeridos
  constructor(
    private server: BackendService,
    private toastManager: ToastService,
    private global: GlobalElementsService,
    private langManager: LanguageService,
    private modalManager: MzModalService,
    factoryResolver: ComponentFactoryResolver
  ) {
    super(factoryResolver)
  }

  // Esta funcion se ejecuta al iniciar la pagina
  ngOnInit(): void {
    // desplegamos el modal de espera
    const modal = this.modalManager.open(ProgressModalComponent)
    
    // enviamos los datos al servidor
    this.server.read(
      'list-documents',
      {},
      (response: BackendResponse) => {
        // cuando el servidor responda, cerramos el modal de espera
        modal.instance.modalComponent.closeModal()
        
        // revisamos si el servidor respondio con exito
        if (response.meta.return_code === 0) {
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
    switch (this.selectedDocument.id) {
      case 1:
        this.reportComponent =
          this.loadComponent(LabReportResultsComponent, {
            parent: this
          }).instance
          
        this.modalManager.open(LabDocumentReportModalComponent, {
          parent: this.reportComponent
        })
      break
    } // switch (this.selectedDocument.name)
  } // onDocumentTypeSelected(): void
} // export class ReportComponent
