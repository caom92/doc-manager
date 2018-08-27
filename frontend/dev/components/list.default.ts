import { Input } from '@angular/core'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'

// El componente que lista los resultados de busqueda de documentos
export class SearchResultsListComponent {

  // Bandera que indica si hay resultados de busqueda o no
  @Input()
  hasSearchResults = true

  // Numero de documentos recuperados del servidor que tienen una copia fisica 
  // registrada
  @Input()
  numDocsWithPhysicalCopy = 0

  // El componente responsable de la creacion de este componente
  @Input()
  parent: any = null

  // La lista de los documentos encontrados
  @Input()
  _searchResults: Array<any> = []
  set searchResults(value: Array<any>) {
    this._searchResults = value
    this.hasSearchResults = (this._searchResults !== null) ?
      this._searchResults.length > 0
      : false
  }
  get searchResults() {
    return this._searchResults
  }

  // El constructor de este componente, inyectando los servicios requeridos
  constructor(
    protected global: GlobalElementsService,
    protected langManager: LanguageService
  ) {
  }

  // Cambia el valor de uno de los atributos de uno de los elementos de la 
  // lista de resultados de busqueda
  setItemValue(idx: number, attribute: string, value: any): void {
    this._searchResults[idx][attribute] = value
  }
}
