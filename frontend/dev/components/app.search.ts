import { Component, OnInit, ComponentFactoryResolver } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService } from 'ng2-materialize'
import { ProgressModalComponent } from './modal.please.wait'
import { AreaDocumentSearchModalComponent } from './modal.search.area'
import { LabDocumentSearchModalComponent } from './modal.search.lab'
import { AreaDocumentDisplayModalComponent } from './modal.display.area'
import { LabDocumentDisplayModalComponent } from './modal.display.lab'
import { DynamicComponentResolver } from './dynamic.resolver'
import { AreaSearchResultsListComponent } from './list.area'
import { LabSearchResultsListComponent } from './list.lab'

// Componente que define el comportamiento de la pagina donde el usuario puede 
// buscar documentos 
@Component({
  templateUrl: '../templates/app.search.html'
})
export class SearchComponent 
  extends DynamicComponentResolver
  implements OnInit
{
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
    data: {
      searchResults: [],
      hasSearchResults: true
    }
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
    switch (this.selectedDocument.name) {
      case 'LABORATORIOS':
        this.listComponent = 
          this.loadComponent(LabSearchResultsListComponent, {
            parent: this
          }).instance

        this.modalManager.open(LabDocumentSearchModalComponent, {
          parent: this.listComponent,
          selectedDocumentTypeID: this.selectedDocument.id
        })
      break

      default:
        this.listComponent = 
          this.loadComponent(AreaSearchResultsListComponent, {
            parent: this
          }).instance
        
        this.modalManager.open(AreaDocumentSearchModalComponent, {
          parent: this.listComponent,
          selectedDocumentTypeID: this.selectedDocument.id
        })
      break
    } // switch (this.selectedDocument.name)
  } // onDocumentTypeSelected(): void

  // Esta funcion se invoca cuando el usuario hace clic en uno de los enlaces 
  // generados al buscar documentos en la base de datos
  onDocumentLinkClicked(document: any): void {
    switch (this.selectedDocument.name) {
      case 'LABORATORIOS':
        this.modalManager.open(LabDocumentDisplayModalComponent, {
          documentType: this.selectedDocument.name,
          fileName: document.file_path,
          fileDate: document.file_date,
          notes: document.notes
        })
      break

      default:
        this.modalManager.open(AreaDocumentDisplayModalComponent, {
          documentType: this.selectedDocument.name,
          fileName: document.file_path,
          fileDate: document.file_date,
          notes: document.notes
        })
      break
    }
  } // onDocumentLinkClicked(document: SearchedDocument): void

  // Esta funcion se invoca cuando el usuario hace clic en el boton de ordenar 
  // los resultados
  onSortButtonClick(): void {
    this.listComponent.data.searchResults.reverse()
  } // onSortButtonClick(): void
} // export class SearchComponent implements OnInit