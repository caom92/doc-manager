import { Component, Input } from '@angular/core'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { ReportComponent } from './app.report'

// El componente que lista los resultados de busqueda de documentos
export class ReportResultsComponent
{
  // Bandera que indica si el reporte se encuentra vacio o no
  @Input()
  hasData: boolean = false

  // El componente responsable de la creacion de este componente
  @Input()
  parent: ReportComponent = null

  // La lista de los documentos encontrados
  @Input()
  _reportData: any = null
  set reportData(value: any) {
    this._reportData = value
    this.hasData = (this._reportData !== null) ?
      this._reportData.length > 0 || Object.keys(this._reportData).length > 0
      : false
  }
  get reportData() {
    return this._reportData
  }

  // El constructor de este componente, inyectando los servicios requeridos
  constructor(
    protected global: GlobalElementsService,
    protected langManager: LanguageService
  ) {
  }
}