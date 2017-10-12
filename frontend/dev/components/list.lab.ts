import { Component, Input } from '@angular/core'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { SearchComponent } from './app.search'

// El componente que lista los resultados de busqueda de documentos
@Component({
  templateUrl: '../templates/list.lab.html'
})
export class LabSearchResultsListComponent
{
  // El componente responsable de la creacion de este componente
  @Input()
  parent: SearchComponent = null

  // La lista de los documentos encontrados
  @Input()
  searchResults: Array<{
    upload_date: string,
    file_date: string,
    file_path: string,
    lab_name: string,
    zone_name: string,
    ranch_name: string,
    producer_name: string,
    area_name: string,
    notes: string
  }> = []

  // Bandera que indica si hay resultados de busqueda o no
  @Input()
  hasSearchResults: boolean = true

  // El constructor de este componente, inyectando los servicios requeridos
  constructor(
    private global: GlobalElementsService,
    private langManager: LanguageService
  ) {
  }
}