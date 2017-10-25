import { Component, Input } from '@angular/core'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { SearchComponent } from './app.search'

// El componente que lista los resultados de busqueda de documentos
export class SearchResultsListComponent
{
  // Bandera que indica si hay resultados de busqueda o no
  @Input()
  hasSearchResults: boolean = true

  // El componente responsable de la creacion de este componente
  @Input()
  parent: SearchComponent = null

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
}