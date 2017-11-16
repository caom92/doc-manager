import { Component, OnInit } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { LabTypesInventoryModalComponent } from './modal.inventory.lab.type'
import { LabSubTypesInventoryModalComponent } from './modal.inventory.lab.subtype'
import { LabProductInventoryModalComponent } from './modal.inventory.lab.product'
import { MzModalService } from 'ng2-materialize'

// Componente que define el comportamiento de la pagina donde el usuario 
// manejara el inventario de laboratorios
@Component({
  templateUrl: '../templates/inventory.lab.html'
})
export class LabInventoryComponent implements OnInit
{
  // La lista de categorias recuperada de la base de datos 
  rows: Array<any> = []

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
        if (response.meta.return_code == 0) {
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
  } // ngOnInit(): void

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
}