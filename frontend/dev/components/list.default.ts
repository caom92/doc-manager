import { Input } from '@angular/core'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService } from 'ngx-materialize'
import { 
  DeleteDocumentConfirmationModalComponent 
} from './modal.confirmation.delete'
import { DefaultDocumentDisplayModalComponent } from './modal.display.default'
import { ProgressModalComponent } from './modal.please.wait'
import { BackendResponse, BackendService } from '../services/app.backend'
import { ToastService } from '../services/app.toast'


// El componente que lista los resultados de busqueda de documentos
export abstract class SearchResultsListComponent {

  // Bandera que indica si hay resultados de busqueda o no
  @Input()
  hasSearchResults = true

  // Numero de documentos recuperados del servidor que tienen una copia fisica 
  // registrada
  @Input()
  numDocsWithPhysicalCopy = 0

  // La lista de los documentos encontrados
  _searchResults: Array<any> = []

  @Input()
  set searchResults(value: Array<any>) {
    this._searchResults = value
    this.hasSearchResults = (this._searchResults !== null) ?
      this._searchResults.length > 0
      : false
  }

  get searchResults() {
    return this._searchResults
  }

  abstract get documentName(): string

  abstract get baseName(): string

  // El constructor de este componente, inyectando los servicios requeridos
  constructor(
    protected global: GlobalElementsService,
    protected langManager: LanguageService,
    protected modalManager: MzModalService,
    protected server: BackendService,
    protected toastManager: ToastService
  ) {
  }

  // Cambia el valor de uno de los atributos de uno de los elementos de la 
  // lista de resultados de busqueda
  setItemValue(idx: number, attribute: string, value: any): void {
    this._searchResults[idx][attribute] = value
  }

  // Esta funcion se invoca cuando el usuario hace clic en el boton de 
  // solicitar el borrado de uno de los documentos
  onDocumentDeletionRequested(
    suffix: string, 
    documentID: number, 
    idx: number
  ): void {
    // desplegamos el modal de confirmacion
    this.modalManager.open(DeleteDocumentConfirmationModalComponent, {
      title: this.langManager.messages.deleteConfirmation.title,
      message: this.langManager.messages.deleteConfirmation.message,
      parent: this,
      documentIdx: idx,
      documentID: documentID,
      serviceSuffix: suffix
    })
  } // onDocumentDeletionRequested()

  // Esta funcion se invoca cuando el usuario hace clic en uno de los enlaces 
  // generados al buscar documentos en la base de datos
  onDocumentLinkClicked(index: number): void {
    this.modalManager.open(DefaultDocumentDisplayModalComponent, {
      index: index,
      documentType: this.documentName,
      baseFolder: this.baseName,
      parent: this
    })
  }

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
          if (this.searchResults[idx].has_physical_copy === 1) {
            this.numDocsWithPhysicalCopy--
          }

          this.searchResults.splice(idx, 1)
        }
      } // (response: BackendResponse)
    ) // this.server.delete
  } // onDocumentDeleteClicked()

  // Esta funcion se invoca cuando el usuario hace clic en el boton de ordenar 
  // los resultados
  onSortButtonClick(): void {
    this.searchResults.reverse()
  } // onSortButtonClick(): void
}
