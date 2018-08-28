import { Component, OnInit, ComponentFactoryResolver } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService } from 'ngx-materialize'
import { ProgressModalComponent } from './modal.please.wait'
import { LabDocumentSearchComponent } from './modal.search.lab'
import { DefaultDocumentDisplayModalComponent } from './modal.display.default'
// import { DynamicComponentResolver } from './dynamic.resolver'
import { LabSearchResultsListComponent } from './list.lab'
import { DeleteDocumentConfirmationModalComponent } from './modal.confirmation.delete'
import { GuaranteeDocumentSearchComponent } from './modal.search.guarantee'
import { GuaranteeSearchResultsListComponent } from './list.guarantee'
import { ProcedureDocumentSearchComponent } from './modal.search.procedure'
import { ProcedureSearchResultsListComponent } from './list.procedure'
import { LabDocumentDisplayModalComponent } from './modal.display.lab'
import { StateService } from '@uirouter/core'


// Componente que define el comportamiento de la pagina donde el usuario puede 
// buscar documentos 
@Component({
  templateUrl: '../templates/app.search.html'
})
export class SearchComponent implements OnInit {

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

  // El componente que actualmente esta listando los resultados de busqueda
  listComponent: any = {
    searchResults: [],
    hasSearchResults: true
  }

  // El constructor de este componente, inyectando los servicios requeridos
  constructor(
    private server: BackendService,
    private toastManager: ToastService,
    private global: GlobalElementsService,
    private langManager: LanguageService,
    private modalManager: MzModalService,
    private router: StateService
    // factoryResolver: ComponentFactoryResolver
  ) {
    // super(factoryResolver)
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
  onDocumentTypeSelected(selectedDocument: {
    id: number,
    name: string
  }): void {
    // dependiendo del tipo de documento elegido, se cargara el componente que 
    // le corresponde donde el usuario podra capturar el documento y la info. 
    // relacionada con el
    switch (selectedDocument.id) {
      case 1:
        this.router.go(this.router.get('search-lab'), {
          selectedDocumentTypeID: selectedDocument.id
        })

        // this.listComponent = 
        //   this.loadComponent(LabSearchResultsListComponent, {
        //     parent: this
        //   }).instance
      break

      case 2:
        this.router.go(this.router.get('search-guarantee'), {
          selectedDocumentTypeID: selectedDocument.id
        })

        // this.listComponent = 
        //   this.loadComponent(GuaranteeSearchResultsListComponent, {
        //     parent: this
        //   }).instance
      break

      case 3:
        this.router.go(this.router.get('search-procedure'), {
          selectedDocumentTypeID: selectedDocument.id
        })
        
        // this.listComponent = 
        //   this.loadComponent(ProcedureSearchResultsListComponent, {
        //     parent: this
        //   }).instance
      break
    } // switch (this.selectedDocument.name)
  } // onDocumentTypeSelected(): void

  // Esta funcion se invoca cuando el usuario hace clic en el boton de aceptar 
  // en el modal de confirmacion de borrado
  onDocumentDeleteClicked(
    suffix: string, 
    documentID: number, 
    idx: number
  ): void {
    // invocamos el modal de espera
    const modal = this.modalManager.open(ProgressModalComponent)

    // enviamos los datos al servidor
    this.server.delete(
      `delete-${ suffix }`,
      { document_id: documentID },
      (response: BackendResponse) => {
        // cuando el servidor responda cerramos el modal
        modal.instance.modalComponent.closeModal()

        // notificamos al usuario del resultado de la operacion
        this.toastManager.showText(
          this.langManager.getServiceMessage(
            'delete-*',
            response.meta.return_code
          )
        )

        // si el resultado fue exitoso, borramos el documento del arreglo
        if (response.meta.return_code === 0) {
          // si el documento tenia una copia fisica, hay que actualizar el 
          // conteo
          if (this.listComponent.searchResults[idx].has_physical_copy === 1) {
            this.listComponent.numDocsWithPhysicalCopy--
          }

          this.listComponent.searchResults.splice(idx, 1)
        }
      } // (response: BackendResponse)
    ) // this.server.delete
  } // onDocumentDeleteClicked()

  // Esta funcion se invoca cuando el usuario hace clic en el boton de ordenar 
  // los resultados
  onSortButtonClick(): void {
    this.listComponent.searchResults.reverse()
  } // onSortButtonClick(): void
} // export class SearchComponent implements OnInit
