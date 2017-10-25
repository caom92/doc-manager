import { Component, Input } from '@angular/core'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { ReportComponent } from './app.report'
import { ReportResultsComponent } from './report.default'

// El componente que lista los resultados de reporte de documentos
@Component({
  templateUrl: '../templates/report.lab.html'
})
export class LabReportResultsComponent extends ReportResultsComponent
{
  // La lista de productores que se van a desplegar como encabezados de la tabla
  @Input()
  tableHeaders: Array<string> = []

  // El constructor de este componente, inyectando los servicios requeridos
  constructor(
    global: GlobalElementsService,
    langManager: LanguageService
  ) {
    super(global, langManager)
  }
}