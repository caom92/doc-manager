import { Component } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService } from 'ngx-materialize'
import { ProgressModalComponent } from './modal.please.wait'
import { FormBuilder, Validators } from '@angular/forms'
import { 
  DefaultDocumentSearchComponent, NoParentElement, SingleParentElement 
} from './modal.search.default'
import { StateService } from '@uirouter/core'


// Este componente define el comportamiento de la pagina donde el usuario puede 
// visualizar los documentos de laboratorios
@Component({
  templateUrl: '../templates/modal.search.lab.html'
})
export class LabDocumentSearchComponent 
  extends DefaultDocumentSearchComponent {

  // La lista de productores a elegir por el usuario
  producers: Array<SingleParentElement> = [
    this.singleParentOptionAll
  ]

  // La lista de laboratorios a elegir por el usuario
  labs: Array<NoParentElement> = [
    this.noParentOptionAll
  ]

  // La lista de analisis de laboratorio a elegir por el usuario
  analysisTypes: Array<NoParentElement> = [
    this.noParentOptionAll
  ]

  // La lista de subtipos de analisis de laboratorio a elegir por el usuario
  subTypes: Array<SingleParentElement> = [
    this.singleParentOptionAll
  ]

  // La lista de areas a elegir por el usuario
  areas: Array<SingleParentElement> = [
    this.singleParentOptionAll
  ]

  // El constructor de este componente, inyectando los servicios requeridos
  constructor(
    server: BackendService,
    toastManager: ToastService,
    global: GlobalElementsService,
    langManager: LanguageService,
    modalManager: MzModalService,
    formBuilder: FormBuilder,
    stateService: StateService
  ) {
    // invocamos el constructor de la clase padre
    super(
      server, toastManager, global, langManager, modalManager, formBuilder, 
      stateService
    )
  }

  // Esta funcion se ejecuta al iniciar la vista
  ngOnInit(): void {
    super.ngOnInit()

    this.numPendingService = 2
    if (this.global.roleName !== 'Director') {
      ++this.numPendingService

      this.server.read(
        'list-producers-of-zone',
        {
          zone_name: this.global.zone.id
        },
        (response: BackendResponse) => {
          // revisamos si el servidor respondio con exito
          if (response.meta.return_code === 0) {
            // si asi fue, ingresamos los ranchos recuperados al objeto de 
            // sugerencias de ranchos
            this.producers = this.producers.concat(response.data)
          } else {
            // si el servidor repondio con error, notificamos al usuario
            this.toastManager.showText(
              this.langManager.getServiceMessage(
                'list-zones-ranches-of-zone',
                response.meta.return_code
              )
            )
          } // if (response.meta.return_code == 0)

          this.finishService()
        } // (response: BackendResponse)
      ) // this.server.write
    }

    // obtenemos la lista de zonas del servidor
    this.server.read(
      'list-labs',
      {},
      (response: BackendResponse) => {
        // revisamos si el servidor respondio con exito
        if (response.meta.return_code === 0) {
          // si el servidor respondio con exito, cargamos la respuesta al 
          // objeto de sugerencias de zonas
          this.labs = this.labs.concat(response.data)
        } else {
          // si el servidor respondio con error, notificamos al usuario
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'list-labs',
              response.meta.return_code
            )
          )
        } // if (response.meta.return_code == 0)

        this.finishService()
      } // (response: BackendResponse)
    ) // this.server.read

    // obtenemos la lista de zonas del servidor
    this.server.read(
      'list-analysis-types',
      {},
      (response: BackendResponse) => {
        // revisamos si el servidor respondio con exito
        if (response.meta.return_code === 0) {
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

        this.finishService()
      } // (response: BackendResponse)
    ) // this.server.read

    // configuramos las reglas de validacion del formulario de captura
    this.searchForm = this.formBuilder.group({
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
          }
      ],
      subtype: [ null ],
      producer: [ null ],
      area: [ null ],
      lab: [ null ],
      type: [ null ]
    })

    this.setValueOnControlChange('startDate')
    this.setValueOnControlChange('endDate')
    this.setIdOnControlChange('producer')
    this.setIdOnControlChange('lab')
    this.setIdOnControlChange('type')
    this.setIdOnControlChange('subtype')
    this.setIdOnControlChange('area')
  } // ngOnInit(): void

  // Esta funcion se invoca cuando el usuario ingreso el nombre de una zona
  onZoneSelected(): void {
    // borramos el valor del productor en caso que ya hayan tenido 
    // algun valor previamente y el usuario este cambiando de zona
    this.searchForm.controls.producer.setValue(null)
    this.producers = [
      this.singleParentOptionAll
    ]

    // si la zona es valida, mandamos una peticion al servidor para recuperar 
    // los ranchos de esta zona
    const selectedZone = 
      <NoParentElement> this.searchForm.controls.zone.value
    if (selectedZone.id) {
      // recuperamos los productores del servidor
      this.server.read(
        'list-producers-of-zone',
        {
          zone_name: selectedZone.id
        },
        (response: BackendResponse) => {
          // revisamos si el servidor respondio con exito
          if (response.meta.return_code === 0) {
            // si asi fue, ingresamos los ranchos recuperados al objeto de 
            // sugerencias de ranchos
            this.producers = this.producers.concat(response.data)
          } else {
            // si el servidor repondio con error, notificamos al usuario
            this.toastManager.showText(
              this.langManager.getServiceMessage(
                'list-zones-ranches-of-zone',
                response.meta.return_code
              )
            )
          } // if (response.meta.return_code == 0)
        } // (response: BackendResponse)
      ) // this.server.write
    } // if (this.searchForm.controls.zone.valid)
  } // onZoneSelected(event: any): void

  // Esta funcion se invoca cuando el usuario elije un tipo de la lista de 
  // seleccion
  onAnalysisTypeSelected(): void {
    // borramos los valores de subtipo en caso que ya hayan tenido 
    // algun valor previamente y el usuario este cambiando de tipo
    this.searchForm.controls.subtype.setValue(null)
    this.searchForm.controls.area.setValue(null)
    this.subTypes = this.areas = [
      this.singleParentOptionAll
    ]

    // si el tipo es valido, mandamos una peticion al servidor para recuperar 
    // la lista de subtipos
    const selectedType =
      <NoParentElement> this.searchForm.controls.type.value
    if (selectedType.id) {
      // preparamos los datos que seran enviados al usuario
      const data = new FormData()
      data.append('type', selectedType.id.toString())

      // recuperamos los ranchos del servidor
      this.server.write(
        'list-analysis-subtypes-of-type',
        data,
        (response: BackendResponse) => {
          // revisamos si el servidor respondio con exito
          if (response.meta.return_code === 0) {
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
    } // if (this.searchForm.controls.typeName.valid)
  } // onAnalysisTypeSelected(event: any): void

  // Esta funcion se invoca cuando el usuario elije un subtipo de la lista de 
  // seleccion
  onSubTypeSelected(): void {
    this.searchForm.controls.area.setValue(null)
    this.areas = [
      this.singleParentOptionAll
    ]

    const selectedSubType = 
      <SingleParentElement> this.searchForm.controls.subtype.value
    if (selectedSubType.id) {
      // preparamos los datos que seran enviados al usuario
      const data = new FormData()
      data.append('subtype', selectedSubType.id.toString())

      // recuperamos los ranchos del servidor
      this.server.write(
        'list-areas-of-subtype',
        data,
        (response: BackendResponse) => {
          // revisamos si el servidor respondio con exito
          if (response.meta.return_code === 0) {
            this.areas = this.areas.concat(response.data)
          } else {
            // si el servidor repondio con error, notificamos al usuario
            this.toastManager.showText(
              this.langManager.getServiceMessage(
                'list-areas-of-subtype',
                response.meta.return_code
              )
            )
          } // if (response.meta.return_code == 0)
        } // (response: BackendResponse)
      ) // this.server.write
    } // if (selectedSubType.id)
  } // onSubTypeSelected(): void

  // Esta funcion se invoca cuando el formulario de captura de documento es 
  // enviado al servidor
  onLabDocumentSearch(): void {
    this.updateUrl()
    this.searchDocument()
  } // onDefaultDocumentUpload(): void

  searchDocument(): void {
    const data = new FormData()
    data.append(
      'document_type_id',
      this.selectedDocumentTypeID.toString()
    )
    data.append(
      'start_date', 
      this.searchForm.controls.startDate.value
    )
    data.append(
      'end_date', 
      this.searchForm.controls.endDate.value
    )

    const selectedZone = 
      <NoParentElement> this.searchForm.controls.zone.value
    if (selectedZone && selectedZone !== this.noParentOptionAll) {
      data.append('zone_id', selectedZone.id.toString())
    }

    const selectedProducer = 
      <SingleParentElement> this.searchForm.controls.producer.value
    if (selectedProducer && selectedProducer !== this.singleParentOptionAll) {
      data.append('producer_id', selectedProducer.id.toString())
    }

    const selectedLab =
      <NoParentElement> this.searchForm.controls.lab.value
    if (selectedLab && selectedLab !== this.noParentOptionAll) {
      data.append('lab_id', selectedLab.id.toString())
    }

    const selectedType =
      <NoParentElement> this.searchForm.controls.type.value
    if (selectedType && selectedType !== this.noParentOptionAll) {
      data.append('analysis_type_id', selectedType.id.toString())
    }

    const selectedSubType = 
      <SingleParentElement> this.searchForm.controls.subtype.value
    if (selectedSubType && selectedSubType !== this.singleParentOptionAll) {
      data.append('analysis_subtype_id', selectedSubType.id.toString())
    }

    const selectedArea = 
      <SingleParentElement> this.searchForm.controls.area.value
    if (selectedArea && selectedArea !== this.singleParentOptionAll) {
      data.append('area_id', selectedArea.id.toString())
    }

    // mostramos el modal de espera
    const modal = this.modalManager.open(ProgressModalComponent)
    
    // enviamos los datos al servidor
    this.server.write(
      'search-lab',
      data,
      (response: BackendResponse) => {
        // al responder el servidor, cerramos el modal de espera
        modal.instance.modalComponent.closeModal()

        // si el servidor respondio con exito, reiniciamos el formulario para 
        // que el usuario capture un nuevo documento
        if (response.meta.return_code === 0) {
          this.numDocsWithPhysicalCopy = 
            response.data.num_docs_with_physical_copy
          this.searchResults = response.data.documents
        } else {
          // notificamos al usuario del resultado obtenido
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'search-lab',
              response.meta.return_code
            )
          )
        }
      } // (response: BackendResponse)
    ) // this.server.write
  }

  protected afterServiceResponses(): void {
    if (
      this.stateService.params.startDate !== undefined 
      && this.stateService.params.endDate !== undefined
    ) {
      this.searchForm.controls.startDate.setValue(
        this.stateService.params.startDate
      )
      this.searchForm.controls.endDate.setValue(
        this.stateService.params.endDate
      )

      this.setControlValue(
        'producer', this.producers, this.singleParentOptionAll
      )
      this.setControlValue('lab', this.labs, this.noParentOptionAll)
      this.setControlValue('type', this.analysisTypes, this.noParentOptionAll)
      this.setControlValue('subtype', this.subTypes, this.singleParentOptionAll)
      this.setControlValue('area', this.areas, this.singleParentOptionAll)
  
      this.searchDocument()
    }
  }
}
