import { Component, Input } from '@angular/core'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { ReportResultsComponent } from './report.default'
import { BackendService } from '../services/app.backend'


// El componente que lista los resultados de reporte de documentos
@Component({
  templateUrl: '../templates/report.lab.html'
})
export class LabReportResultsComponent extends ReportResultsComponent {
  // La lista de productores que se van a desplegar como encabezados de la tabla
  @Input()
  tableHeaders: Array<any> = []

  // La fecha de inicio en la que se realizo la busqueda
  @Input()
  startDate = ''

  // La fecha final en la que se realizo la busqueda
  @Input()
  endDate = ''

  // La zona en la que se realizo la busqueda
  @Input()
  zone = ''

  // El tipo de analisis cuyos datos fueron buscados
  @Input()
  type = ''

  // El subtipo de analisis cuyos datos fueron buscados
  @Input()
  subtype = ''

  // El idioma implementado
  lang = localStorage.getItem('lang')

  // Los datos a enviar al servidor para generar el reporte
  content: string = JSON.stringify([{
    body: '',
    footer: '',
    header: ''
  }])

  // La hoja de estilo CSS a utilizar para dibujar la tabla en el reporte PDF
  style = 
    `<style>
      table { 
        font-family: arial, 
        sans-serif; 
        border-collapse: collapse; 
      }
      td { 
        border: 1px solid #000000; 
        text-align: left;
      }
      th { 
        border: 1px solid #000000; 
        text-align: left; 
        font-weight: bold; 
        background-color: #4CAF50;
      }
      .producer-cell {
        width: 75px;
        text-align: center;
      }
      .header {
        width: 100%;
      }
    </style>`

  // El nombre de la compañia
  company: string = this.global.company.name

  // La dirección de la compañia
  address: string = this.global.company.address

  // El logo de la compañia
  logo: string = this.global.company.logo

  // La orientacion de la hoja en el reporte PDF
  orientation = 'L'
  
  // El pie de pagina
  footer = ''

  // El nombre del supervisor que autorizo el reporte
  supervisor = ''

  // La firma del supervisor que autorizo el reporte
  signature = ''

  // El constructor de este componente, inyectando los servicios requeridos
  constructor(
    global: GlobalElementsService,
    langManager: LanguageService,
    private server: BackendService
  ) {
    super(global, langManager)
  }

  // Prepara los datos a enviar al servidor para generar el reporte PDF
  prepareReportHTML(): void {
    // preparamos el almacenamiento temporal donde se guardara el JSON con el 
    // reporte a enviar al servidor
    const content = []

    // obtenemos la lista de etiquetas a desplegar en el reporte dependiendo 
    // del idioma elegido por el usuario
    const labels = this.langManager.messages.report.lab

    // visitamos cada tipo de analisis ...
    for (const type of this.reportData.types) {
      // almacenamiento temporal para el JSON del reporte de este tipo
      const temp = {
        body: '',
        footer: `<span></span>`,
        header:
          `<table>
            <tr>
              <td>
                <b>${ labels.from }</b>
                <span>${ this.startDate } </span>
                <b>${ labels.to }</b>
                <span>${ this.endDate }</span>
                <br>
                <b>${ labels.docTypeLabel }</b>
                <span>${ labels.name }</span>
                <br>
                <b>${ labels.zone }</b>
                <span>${ this.zone }</span>
                <br>
                <b>${ labels.typeLabel }</b>
                <span>${ type.name }</span>
              </td>
            </tr>
          </table>`
      }

      // almacenamiento temporal para el cuerpo del reporte
      let body = ''

      // visitamos cada subtipo perteneciente al tipo de esta iteracion
      for (let s = type.start; s < type.start + type.length; ++s) {
        // obtenemos los datos del subtipo de esta iteracion
        const subtype = this.reportData.subtypes[s]

        // inicializamos el encabezado de la tabla
        body += 
          `<table>
            <thead>
              <tr>
                <th rowspan="2">${ labels.producer}</th>
                <th colspan="${ subtype.span }">${ subtype.name}</th>
              </tr>
              <tr>`

        // visitamos cada area perteneciente al subtipo de la iteracion actual
        for (let a = subtype.start; a < subtype.start + subtype.length; ++a) {
          // agregamos cada area al encabezado de la tabla
          body += `<th>${ this.reportData.areas[a] }</th>`
        }

        // cerramos el encabezado e inicializamos el cuerpo de la tabla
        body += `</tr></thead><tbody>`

        // visitamos cada productor de la zona elegida por el usuario
        for (const producer of this.reportData.producers) {
          // agregamos el nombre del productor en la 1ra columna de la tabla
          body += `<tr><td>${ producer.name }</td>`

          // visitamos cada valor registrado en el productor de la iteracion 
          // actual que concuerde con el area del subtipo de la iteracion actual
          for (let i = subtype.start; i < subtype.start + subtype.length; ++i) {
            // obtenemos el valor del area
            const value = producer.values[i]

            // pintamos la celda de amarillo si tiene registrado al menos 1 
            // documento
            if (value > 0) {
              body += `<td style="background-color:yellow">${ value }</td>` 
            } else {
              body += `<td>${ value }</td>` 
            }
          }

          // cerramos el renglon
          body += `</tr>`
        }

        // cerramos la tabla
        body += `</tbody></table><br><br>`
      }

      // agregamos las tablas de subtipo creadas contenido final 
      temp.body = body
      content.push(temp)
    }

    // tras procesar todos los tipos, generamos el JSON en preparacion a ser 
    // enviado al servidor
    this.content = JSON.stringify(content)
  } // prepareReportHTML()
} // export class LabReportResultsComponent extends ReportResultsComponent
