import { Component, OnInit } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService } from 'ngx-materialize'
import { ProgressModalComponent } from './modal.please.wait'
import { 
  SignDocumentConfirmationModalComponent 
} from './modal.confirmation.sign'
import { Router } from '@angular/router'

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

  lastSearch: FormData

  // El constructor de este componente, inyectando los servicios requeridos
  constructor(
    private server: BackendService,
    private toastManager: ToastService,
    private global: GlobalElementsService,
    private langManager: LanguageService,
    private modalManager: MzModalService,
    private router: Router
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
        stateName = 'search-training'
      break
      
      case 5: // certificados
        stateName = 'search-certificate'
      break
    } // switch (this.selectedDocument.name)

    this.router.navigateByUrl(`/${ stateName }/${ selectedDocument.id }`)
  } // onDocumentTypeSelected(): void

  onSignDocumentRequested(document: any): void {
    // this.modalManager.open(LabSubAreaReassignComponent, { areaID: 
    // document.area_id, documentID: document.id, parent: this })
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

  // TODO: TEMP: Actualiza la búsqueda tras una actualización del subarea
  updateSearch(): void {
    // Comente esta funcion porque el comentario de arriba dice que es temporal 
    // y porque de todas funcion el componente que invoca esta funcion nunca es 
    // invocado (mira la linea 114 de este archivo)
    // const modal = this.modalManager.open(ProgressModalComponent)

    // this.server.write(
    //   'search-lab',
    //   this.lastSearch,
    //   (response: BackendResponse) => {
    //     // al responder el servidor, cerramos el modal de espera
    //     modal.instance.modalComponent.closeModal()

    //     // si el servidor respondio con exito, reiniciamos el formulario
    //     // para que el usuario capture un nuevo documento
    //     if (response.meta.return_code === 0) {
    //       this.listComponent.numDocsWithPhysicalCopy =
    //         response.data.num_docs_with_physical_copy
    //       this.listComponent.searchResults = response.data.documents
    //     } else {
    //       // notificamos al usuario del resultado obtenido
    //       this.toastManager.showText(
    //         this.langManager.getServiceMessage(
    //           'search-lab',
    //           response.meta.return_code
    //         )
    //       )
    //     }
    //   } // (response: BackendResponse)
    // ) // this.server.write
  }
} // export class SearchComponent implements OnInit
