import { Component, Input, OnInit } from '@angular/core'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { ReportComponent } from './app.report'
import { ReportResultsComponent } from './report.default'
import { BackendService, BackendResponse } from '../services/app.backend'

// El componente que lista los resultados de reporte de documentos
@Component({
  templateUrl: '../templates/report.lab.html'
})
export class LabReportResultsComponent extends ReportResultsComponent
{
  // La lista de productores que se van a desplegar como encabezados de la tabla
  @Input()
  tableHeaders: Array<string> = []

  // La fecha de inicio en la que se realizo la busqueda
  @Input()
  startDate: string = ''

  // La fecha final en la que se realizo la busqueda
  @Input()
  endDate: string = ''

  // La zona en la que se realizo la busqueda
  @Input()
  zone: string = ''

  // El tipo de analisis cuyos datos fueron buscados
  @Input()
  type: string = ''

  // El subtipo de analisis cuyos datos fueron buscados
  @Input()
  subtype: string = ''

  // El idioma implementado
  lang: string = localStorage.lang

  // Los datos a enviar al servidor para generar el reporte
  content: string = JSON.stringify([{
    header: '',
    body: '',
    footer: ''  
  }])

  // La hoja de estilo CSS a utilizar para dibujar la tabla en el reporte PDF
  style: string = 
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
      .product {
        width: 75px;
        text-align: right;
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
  orientation: string = 'L'
  
  // El pie de pagina
  footer: string = ''

  // El nombre del supervisor que autorizo el reporte
  supervisor: string = ''

  // La firma del supervisor que autorizo el reporte
  signature: string = ''

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
    // inicializamos el JSON que sera enviado
    let content = [{
      header: 
        `<table>
          <tr>
            <td>
              <b>${
                (localStorage.lang == 'en') ?
                  'From: ' : 'Del: ' 
              }</b>
              <span>${ this.startDate } </span>
              <b>${
                (localStorage.lang == 'en') ?
                'To: ' : 'al: '
              }</b>
              <span>${ this.endDate }</span>
              <br>
              <b>${
                (localStorage.lang == 'en') ?
                  'Document Type: ' : 'Tipo de Documento: '
              }</b>
              <span>${
                (localStorage.lang == 'en') ?
                  'LABORATORIES' : 'LABORATORIOS'
              }</span>
              <br>
              <b>${
                (localStorage.lang == 'en') ?
                  'Zone: ' : 'Zona: '
              }</b>
              <span>${ this.zone }</span>
              <br>
              <b>${
                (localStorage.lang == 'en') ?
                  'Analysis Type: ' : 'Tipo de Análisis: '
              }</b>
              <span>${ this.type }</span>
              <br>
              <b>${
                (localStorage.lang == 'en') ?
                  'Analysis Subtype: ' : 'Subtipo de Análisis: '
              }</b>
              <span>${ this.subtype }</span>
            </td>
          </tr>
        </table>`,
      body: '',
      footer: `<span></span>`
    }]

    // indicamos desde donde vamos a empezar a imprimir los valores de los 
    // productores
    let startingCol = 2

    // Debido a que la tabla que sera desplegada en el reporte contiene tantas 
    // columnas como Unidades de produccion, existe la posibilidad de que no 
    // todas queden dentro del ancho de la hoja, asi que limitaremos el 
    // despliegue de la tabla a un numero determinado de columnas
    while (startingCol < this.tableHeaders.length) {
      // comenzamos agregando el encabezado de la primera columna que contiene 
      // el nombre de las areas
      content[0].body += 
        `<table>
          <thead>
            <tr>
              <th>${
                (localStorage.lang == 'en') ?
                  'Area/Product' : 'Área/Producto'
              }</th>`
      
      // luego agregamos cada celda que contiene el nombre de la unidad 
      // productora, imprimiendolas hasta que se agoten o hasta que se hayan 
      // impreso 9 de ellas, lo que sea que llegue primero
      for (
        let i = startingCol; 
        i < this.tableHeaders.length && i < startingCol + 11; 
        ++i
      ) {
        content[0].body += `<th class="product">${ this.tableHeaders[i] }</th>`
      }
      content[0].body += `</tr></thead><tbody>`

      // una vez impresos los encabezados, imprimimos los datos renglon por 
      // renglon
      for (let row of this.reportData) {
        // primero imprimimos la 1ra columna, que contiene el nombre del area
        content[0].body += 
          `<tr>
            <td>${ row.name }</td>`
        
        // luego imprimiremos 10 columnas o las que sobren, lo que llegue 1ro
        for (
          let j = startingCol - 2; 
          j < row.values.length && j < startingCol + 9; 
          ++j
        ) {
          content[0].body += `<td class="product">${ row.values[j] }</td>`
        }
        content[0].body += `</tr>`
      }

      // cerramos la tabla
      content[0].body += '</tbody></table>'

      // avanzamos al siguiente grupo de 10 columnas
      startingCol += 11
    } // for (let row of this.reportData)

    // generamos la cadena que representa el JSON que sera enviado al servidor
    this.content = JSON.stringify(content)
  } // prepareReportHTML(): void
} // export class LabReportResultsComponent extends ReportResultsComponent