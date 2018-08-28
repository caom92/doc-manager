import { Input } from '@angular/core'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService } from 'ngx-materialize'
import { 
  DeleteDocumentConfirmationModalComponent 
} from './modal.confirmation.delete'
import { DefaultDocumentDisplayModalComponent } from './modal.display.default'


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
    protected modalManager: MzModalService
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
}
