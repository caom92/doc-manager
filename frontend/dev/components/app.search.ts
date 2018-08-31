import { Component, OnInit } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService } from 'ngx-materialize'
import { ProgressModalComponent } from './modal.please.wait'
import { StateService } from '@uirouter/core'
import { SignDocumentConfirmationModalComponent } from './modal.confirmation.sign'

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

  lastSearch: FormData

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
    let stateName: string = null

    switch (selectedDocument.id) {
      case 1:
        stateName = 'search-lab'
      break

      case 2:
        stateName = 'search-guarantee'
      break

      case 3:
        stateName = 'search-procedure'
      break
      
      case 4: // capacitaciones
        // this.listComponent =
        //   this.loadComponent(TrainingSearchResultsListComponent, {
        //     parent: this
        //   }).instance

        // this.modalManager.open(TrainingDocumentSearchComponent, {
        //   parent: this.listComponent,
        //   selectedDocumentTypeID: this.selectedDocument.id
        // })
        stateName = 'search-training'
      break
      
      case 5: // certificados
        // this.listComponent =
        //   this.loadComponent(CertificateSearchResultsListComponent, {
        //     parent: this
        //   }).instance

        // this.modalManager.open(CertificateDocumentSearchComponent, {
        //   parent: this.listComponent,
        //   selectedDocumentTypeID: this.selectedDocument.id
        // })
        stateName = 'search-certificate'
      break
    } // switch (this.selectedDocument.name)

    this.router.go(this.router.get(stateName), {
      selectedDocumentTypeID: selectedDocument.id
    })
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

  onSignDocumentRequested(document: any): void {
    // this.modalManager.open(LabSubAreaReassignComponent, { areaID: 
    // document.area_id, documentID: document.id, parent: this })
    console.log(document)
    this.modalManager.open(SignDocumentConfirmationModalComponent, {
      title: this.langManager.messages.signConfirmation.title,
      message: this.langManager.messages.signConfirmation.message,
      parent: this,
      documentID: document.document_id
    })
  }

  onSignDocumentClicked(documentID: number): void {
    // let modal = this.modalManager.open(ProgressModalComponent)

    const docData = new FormData()

    docData.append('document_id', String(documentID))

    // enviamos los datos al servidor
    this.server.write(
      'sign-document',
      docData,
      (response: BackendResponse) => {
        // modal.instance.modalComponent.closeModal()
        this.updateSearch()

        // notificamos al usuario del resultado de la operacion
        this.toastManager.showText(
          this.langManager.getServiceMessage(
            'sign-*',
            response.meta.return_code
          )
        )
      }
    )
  }

  // Esta funcion se invoca cuando el usuario hace clic en el boton de ordenar 
  // los resultados
  onSortButtonClick(): void {
    this.listComponent.searchResults.reverse()
  } // onSortButtonClick(): void

  // TODO: TEMP: Actualiza la búsqueda tras una actualización del subarea
  updateSearch(): void {
    const modal = this.modalManager.open(ProgressModalComponent)

    this.server.write(
      'search-lab',
      this.lastSearch,
      (response: BackendResponse) => {
        // al responder el servidor, cerramos el modal de espera
        modal.instance.modalComponent.closeModal()

        // si el servidor respondio con exito, reiniciamos el formulario para 
        // que el usuario capture un nuevo documento
        if (response.meta.return_code === 0) {
          this.listComponent.numDocsWithPhysicalCopy =
            response.data.num_docs_with_physical_copy
          this.listComponent.searchResults = response.data.documents
        } else {
          // notificamos al usuario del resultado obtenido
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'search-lab',
              response.meta.return_code
            )
          )
        }
      } // (response: BackendResponse)
    ) // this.server.write
  }
} // export class SearchComponent implements OnInit
