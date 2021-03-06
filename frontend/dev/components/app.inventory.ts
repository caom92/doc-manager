import { Component, OnInit, ComponentFactoryResolver } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService } from 'ngx-materialize'
import { ProgressModalComponent } from './modal.please.wait'
import { DynamicComponentResolver } from './dynamic.resolver'
import { LabInventoryComponent } from './inventory.lab'
import { GuaranteeInventoryComponent } from './inventory.guarantee'
import { ProcedureInventoryComponent } from './inventory.procedure'
import { TrainingInventoryComponent } from './inventory.training'
import { CertificateInventoryComponent } from './inventory.certificate'

// Componente que define el comportamiento de la pagina donde se cargara el 
// inventario dependiendo del tipo de archivo elegido 
@Component({
  templateUrl: '../templates/app.inventory.html'
})
export class InventoryComponent 
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

  // El componente que desplegara el inventario del tipo de documento elegido
  inventoryComponent: any = null

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
        this.inventoryComponent = this.loadComponent(LabInventoryComponent, {})
      break

      case 2:
        this.inventoryComponent = 
          this.loadComponent(GuaranteeInventoryComponent, {})
      break
      
      case 3:
        this.inventoryComponent = 
          this.loadComponent(ProcedureInventoryComponent, {})
      break
      
      case 4:
        this.inventoryComponent = this.loadComponent(TrainingInventoryComponent, {})
      break
      
      case 5:
        this.inventoryComponent = this.loadComponent(CertificateInventoryComponent, {})
      break
    } // switch (this.selectedDocument.name)
  } // onDocumentTypeSelected(): void
} // class InventoryComponent 
