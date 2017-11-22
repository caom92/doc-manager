import { Component, OnInit, Input } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService, MzBaseModal } from 'ng2-materialize'
import { ProgressModalComponent } from './modal.please.wait'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NoParentElement, SingleParentElement } from './modal.search.default'
import { DefaultDocumentReportModalComponent } from './modal.report.default'

// Esta funcion 
@Component({
  templateUrl: '../templates/modal.report.lab.html'
})
export class LabDocumentReportModalComponent
  extends DefaultDocumentReportModalComponent
  implements OnInit
{
  // La lista de analisis de laboratorio a elegir por el usuario
  analysisTypes: Array<NoParentElement> = []

  // La lista de subtipos de analisis de laboratorio a elegir por el usuario
  subTypes: Array<SingleParentElement> = [] 

  // El constructor de este componente, inyectando los servicios requeridos
  constructor(
    server: BackendService,
    toastManager: ToastService,
    global: GlobalElementsService,
    langManager: LanguageService,
    modalManager: MzModalService,
    formBuilder: FormBuilder
  ) {
    // invocamos el constructor de la clase padre
    super(server, toastManager, global, langManager, modalManager, formBuilder)
  }

  // Esta funcion se ejecuta al iniciar la vista
  ngOnInit(): void {
    super.ngOnInit()

    // configuramos las reglas de validacion del formulario
    this.reportForm = this.formBuilder.group({
      startDate: [ null, Validators.required ],
      endDate: [ null, Validators.required ],
      zone: [
        (this.global.roleName !== 'Director') ?
          {
            value: this.global.zone,
            disabled: true
          }
          : {
            value: null,
            disabled: false
          },
        Validators.required
      ],
      type: [ null, Validators.required ],
      subtype: [ null, Validators.required ]
    })

    // obtenemos la lista de zonas del servidor
    this.server.read(
      'list-analysis-types',
      {},
      (response: BackendResponse) => {
        // revisamos si el servidor respondio con exito
        if (response.meta.return_code == 0) {
          // si el servidor respondio con exito, cargamos la respuesta al 
          // objeto de sugerencias de zonas
          this.analysisTypes = this.analysisTypes.concat(response.data)
        } else {
          // si el servidor respondio con error, notificamos al usuario
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'list-labs',
              response.meta.return_code
            )
          )
        } // if (response.meta.return_code == 0)
      } // (response: BackendResponse)
    ) // this.server.read
  }

  // Funcion que se invoca cuando un tipo de analisis es seleccionado
  onAnalysisTypeSelected(): void {
    // borramos los valores de subtipo en caso que ya hayan tenido 
    // algun valor previamente y el usuario este cambiando de tipo
    this.reportForm.controls.subtype.setValue(null)
    this.subTypes = []

    // si el tipo es valido, mandamos una peticion al servidor para recuperar 
    // la lista de subtipos
    let selectedType =
      <NoParentElement>this.reportForm.controls.type.value
    if (selectedType.id) {
      // preparamos los datos que seran enviados al usuario
      let data = new FormData()
      data.append('type_name', selectedType.name)

      // recuperamos los ranchos del servidor
      this.server.write(
        'list-analysis-subtypes-of-type',
        data,
        (response: BackendResponse) => {
          // revisamos si el servidor respondio con exito
          if (response.meta.return_code == 0) {
            this.subTypes = this.subTypes.concat(response.data)
          } else {
            // si el servidor repondio con error, notificamos al usuario
            this.toastManager.showText(
              this.langManager.getServiceMessage(
                'list-analysis-subtypes-of-type',
                response.meta.return_code
              )
            )
          } // if (response.meta.return_code == 0)
        } // (response: BackendResponse)
      ) // this.server.write
    } // if (this.reportForm.controls.typeName.valid)
  }

  // Esta funcion se invoca cuando el formulario de captura de documento es 
  // enviado al servidor
  onLabDocumentReport(): void {
    // mostramos el modal de espera
    let modal = this.modalManager.open(ProgressModalComponent)

    // enviamos los datos al servidor
    this.server.read(
      'report-lab',
      {
        start_date: this.reportForm.controls.startDate.value,
        end_date: this.reportForm.controls.endDate.value,
        zone_id: this.reportForm.controls.zone.value.id,
        subtype_id: this.reportForm.controls.subtype.value.id
      },
      (response: BackendResponse) => {
        // al responder el servidor, cerramos el modal de espera
        modal.instance.modalComponent.close()

        // si el servidor respondio con exito, reiniciamos el formulario para 
        // que el usuario capture un nuevo documento
        if (response.meta.return_code == 0) {
          // this.parent.tableHeaders = response.data.types
          this.parent.reportData = response.data
          this.parent.startDate = this.reportForm.controls.startDate.value
          this.parent.endDate = this.reportForm.controls.endDate.value
          this.parent.zone = this.reportForm.controls.zone.value.name
          this.parent.type = this.reportForm.controls.type.value.name
          this.parent.subtype = this.reportForm.controls.subtype.value.name
          this.parent.prepareReportHTML()
        } else {
          // notificamos al usuario del resultado obtenido
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'report-lab',
              response.meta.return_code
            )
          )
        } // if (response.meta.return_code == 0)
      } // (response: BackendResponse)
    ) // this.server.read
  } // onLabDocumentReport(): void
} // class LabDocumentReportModalComponent