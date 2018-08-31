import { Component, OnInit } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { LabTypesInventoryModalComponent } from './modal.inventory.lab.type'
import { 
  LabSubTypesInventoryModalComponent 
} from './modal.inventory.lab.subtype'
import { 
  LabProductInventoryModalComponent 
} from './modal.inventory.lab.product'
import { LabSubProductInventoryModalComponent } from './modal.inventory.lab.subproduct'
import { LabLabInventoryModalComponent } from './modal.inventory.lab.lab'
import { 
  LabProducerInventoryModalComponent 
} from './modal.inventory.lab.producer'
import { MzModalService } from 'ngx-materialize'


// Componente que define el comportamiento de la pagina donde el usuario 
// manejara el inventario de laboratorios
@Component({
  templateUrl: '../templates/inventory.lab.html'
})
export class LabInventoryComponent implements OnInit {

  // La lista de categorias recuperada de la base de datos 
  rows: Array<any> = []

  // La lista de laboratorios recuperada de la base de datos
  laboratories: Array<{
    id: number,
    name: string
  }> = []

  // La lista de zonas recuperada de la base de datos
  zones: Array<{
    id: number,
    name: string
  }> = []

  // La lista de 
  producers: Array<{
    id: number,
    name: string,
    parent_id: number
  }> = []

  // La zona elegida por el usuario
  selectedZone: any = null


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
    // recuperamos la lista de categorias de la base de datos 
    this.server.read(
      'list-lab-categories',
      {},
      (response: BackendResponse) => {
        if (response.meta.return_code === 0) {
          this.rows = response.data
        } else {
          // si el servidor respondio con un error, notificamos al usuario
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'list-lab-categories',
              response.meta.return_code
            )
          )
        } // if (response.meta.return_code == 0)
      } // (response: BackendResponse)
    ) // this.server.read()

    // recuperamos la lista de categorias de la base de datos 
    this.server.read(
      'list-labs',
      {},
      (response: BackendResponse) => {
        if (response.meta.return_code === 0) {
          this.laboratories = response.data
        } else {
          // si el servidor respondio con un error, notificamos al usuario
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'list-labs',
              response.meta.return_code
            )
          )
        } // if (response.meta.return_code == 0)
      } // (response: BackendResponse)
    ) // this.server.read()

    this.server.read(
      'list-zones',
      {},
      (response: BackendResponse) => {
        if (response.meta.return_code === 0) {
          this.zones = response.data
        } else {
          // si el servidor respondio con un error, notificamos al usuario
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'list-zones',
              response.meta.return_code
            )
          )
        } // if (response.meta.return_code == 0)
      } // (response: BackendResponse)
    ) // this.server.read
  } // ngOnInit(): void

  // Esta funcion se ejecuta cuando el usuario selecciona una zona de la
  // lista de seleccion
  onZoneSelected(event: any): void {
    const zoneID = event.target.value.split(': ')[1]
    this.server.read(
      'list-producers-of-zone',
      {
        zone_id: zoneID
      },
      (response: BackendResponse) => {
        if (response.meta.return_code === 0) {
          this.producers = response.data
        } else {
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'list-producers-of-zone',
              response.meta.return_code
            )
          )
        }
      }
    )
  }

  // Funcion que se invoca cuando el usuario hace clic en el boton de agregar 
  // tipo de analisis
  onAddTypeButtonClick(): void {
    this.modalManager.open(LabTypesInventoryModalComponent, {
      parent: this
    })
  }

  // Funcion que se invoca cuando el usuario hace clic en el boton de agregar 
  // subtipo de analisis
  onAddSubTypeButtonClick(): void {
    this.modalManager.open(LabSubTypesInventoryModalComponent, {
      parent: this
    })
  }

  // Funcion que se invoca cuando el usuario hace clic en el boton de agregar 
  // producto o area
  onAddProductButtonClick(): void {
    this.modalManager.open(LabProductInventoryModalComponent, {
      parent: this
    })
  }

  // Funcion que se invoca cuando el usuario hace clic en el boton de agregar 
  // subproducto o subarea
  onAddSubProductButtonClick(): void {
    this.modalManager.open(LabSubProductInventoryModalComponent, {
      parent: this
    })
  }

  // Funcion que se invoca cuando el usuario hace clic en el boton de agregar
  // laboratorio
  onAddLabButtonClick(): void {
    this.modalManager.open(LabLabInventoryModalComponent, {
      parent: this
    })
  }

  // Funcion que se invoca cuando el usuario hace clic en el boton de agregar
  // unidad de productor
  onAddProducerButtonClick(): void {
    this.modalManager.open(LabProducerInventoryModalComponent, {
      parent: this
    })
  }
}
