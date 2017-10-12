import { Component, OnInit, Input } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService, MzBaseModal } from 'ng2-materialize'
import { ProgressModalComponent } from './modal.please.wait'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AreaSearchResultsListComponent } from './list.area'

// Tipo auxiliar que define los elementos recuperados del servidor que no 
// posean un padre en la BD
export type ElementWithoutParent = {
  id: number,
  name: string
}

// Tipo auxiliar que define los elementos recuperados del servidor que
// poseen un padre en la BD
export type ElementWithParent = {
  id: number,
  name: string,
  parent_id: number
}

// Este componente define el comportamiento por defecto necesario para que el 
// usuario busque un documento en el sistema
@Component({
  templateUrl: '../templates/modal.search.area.html'
})
export class AreaDocumentSearchModalComponent
  extends MzBaseModal 
  implements OnInit
{ 
  // El ID del tipo de documento elegido por el usuario
  @Input()
  selectedDocumentTypeID: number = null

  // Las opciones de configuracion del modal
  modalOptions = {
  }

  // Valores de la opcion para elegir todas las zonas de la lista de seleccion
  zoneOptionAll: ElementWithoutParent = {
    id: null,
    name: 'ALL - TODOS'
  }

  // Valores de la opcion para elegir todos los ranchos/productores/areas de la 
  // lista de seleccion
  optionAll: ElementWithParent = {
    id: null,
    name: 'ALL - TODOS',
    parent_id: null
  }
  
  // La lista de zonas a elegir por el usuario
  zones: Array<ElementWithoutParent> = [
    this.zoneOptionAll
  ]

  // La lista de ranchos a elegir por el usuario
  ranches: Array<ElementWithParent> = [
    this.optionAll
  ]

  // La lista de productores a elegir por el usuario
  producers: Array<ElementWithParent> = [
    this.optionAll
  ]

  // La lista de areas a elegir por el usuario
  areas: Array<ElementWithParent> = [
    this.optionAll
  ]

  // El componente que invoco este componente
  parent: any = null

  // Instancia que representa el formulario de captura donde el usuario subira 
  // el documento
  defaultDocumentSearchForm: FormGroup = null

  // El constructor de este componente, inyectando los servicios requeridos
  constructor(
    protected server: BackendService,
    protected toastManager: ToastService,
    protected global: GlobalElementsService,
    protected langManager: LanguageService,
    protected modalManager: MzModalService,
    protected formBuilder: FormBuilder
  ) {
    // invocamos el constructor de la clase padre
    super()
  }

  // Esta funcion inicializa el formulario de captura
  initForm(): void {
    // configuramos las reglas de validacion del formulario de captura
    this.defaultDocumentSearchForm = this.formBuilder.group({
      startDate: [ null, Validators.required ],
      endDate: [ null, Validators.required ],
      zone: [ null ],
      ranch: [ null ],
      producer: [ null ],
      area: [ null ]
    })
  } // initForm(): void

  // Esta funcion se encarga de solicitar al servidor los datos iniciales que 
  // necesita este formulario para comenzar su captura
  retrieveInitialData(): void {
    // obtenemos la lista de zonas del servidor
    this.server.read(
      'list-zones',
      {},
      (response: BackendResponse) => {
        // revisamos si el servidor respondio con exito
        if (response.meta.return_code == 0) {
          // si el servidor respondio con exito, cargamos la respuesta al 
          // objeto de sugerencias de zonas
          this.zones = this.zones.concat(response.data)
        } else {
          // si el servidor respondio con error, notificamos al usuario
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'list-zones',
              response.meta.return_code
            )
          )
        } // if (response.meta.return_code == 0)
      } // (response: BackendResponse)
    ) // this.server.read
  } // retrieveInitialData(): void

  // Esta funcion se ejecuta al iniciar la vista
  ngOnInit(): void {
    // configuramos el formulario de captura
    this.initForm()

    // inicializamos el selector de fecha
    $('.datepicker').pickadate(
      this.langManager.messages.global.datePickerConfig
    )

    // cada vez que el selector de fecha cambie, recuperamos la fecha elegida 
    // formateada 
    $('#start-date').change(
      this.defaultDocumentSearchForm, 
      function(event: any): void {
        event.data.controls.startDate.setValue(event.target.value)
      }
    )
    $('#end-date').change(
      this.defaultDocumentSearchForm, 
      function(event: any): void {
        event.data.controls.endDate.setValue(event.target.value)
      }
    )

    // retrieve the server data
    this.retrieveInitialData()
  } // ngOnInit(): void

  // Esta funcion se invoca cuando el usuario ingreso el nombre de una zona
  onZoneSelected(): void {
    // borramos los valores del rancho y productor en caso que ya hayan tenido 
    // algun valor previamente y el usuario este cambiando de zona
    this.defaultDocumentSearchForm.controls.ranch.setValue(null)
    this.defaultDocumentSearchForm.controls.producer.setValue(null)
    this.defaultDocumentSearchForm.controls.area.setValue(null)
    this.ranches = this.producers = this.areas = [
      this.optionAll
    ]

    // si la zona es valida, mandamos una peticion al servidor para recuperar 
    // los ranchos de esta zona
    let selectedZone = 
      <ElementWithoutParent>this.defaultDocumentSearchForm.controls.zone.value
    if (selectedZone.id) {
      // preparamos los datos que seran enviados al usuario
      let data = new FormData()
      data.append('zone_name', selectedZone.name)

      // recuperamos los ranchos del servidor
      this.server.create(
        'list-ranches-of-zone',
        data,
        (response: BackendResponse) => {
          // revisamos si el servidor respondio con exito
          if (response.meta.return_code == 0) {
            // si asi fue, ingresamos los ranchos recuperados al objeto de 
            // sugerencias de ranchos
            this.ranches = this.ranches.concat(response.data)
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
      ) // this.server.create
    } // if (this.defaultDocumentSearchForm.controls.zone.valid)
  } // onZoneSelected(event: any): void

  // Esta funcion se invoca cuando el usuario ingresa el nombre de un rancho
  onRanchSelected(): void {
    // borramos el valor del productor elegido en caso de que haya tenido un 
    // valor previo y el usuario este cambiando de rancho
    this.defaultDocumentSearchForm.controls.producer.setValue(null)
    this.defaultDocumentSearchForm.controls.area.setValue(null)
    this.producers = this.areas = [
      this.optionAll
    ]

    // si el rancho ingresado es valido
    let selectedRanch = 
      <ElementWithParent>this.defaultDocumentSearchForm.controls.ranch.value
    if (selectedRanch.id) {
      // preparamos los datos que seran enviados al servidor
      let data = new FormData()
      data.append('ranch_name', selectedRanch.name)

      // enviamos la peticion al servidor para recuperar los productores de 
      // este rancho
      this.server.create(
        'list-producers-of-ranch',
        data,
        (response: BackendResponse) => {
          // revisamos si el rancho respondio con exito
          if (response.meta.return_code == 0) {
            // si asi fue guardamos los productores en el objeto de sugerencias 
            // del campo de productores
            this.producers = this.producers.concat(response.data)
          } else {
            // en caso de que el servidor responda con error, hay que notificar 
            // al usuario
            this.toastManager.showText(
              this.langManager.getServiceMessage(
                'list-producers-of-ranch',
                response.meta.return_code
              )
            )
          } // if (response.meta.return_code == 0)
        } // (response: BackendResponse)
      ) // this.server.create
    } // if (this.defaultDocumentSearchForm.controls.ranch.valid)
  } // onRanchSelected(event: any): void 

  // Esta funcion se invoca cuando el usuario ingresa el nombre de un rancho
  onProducerSelected(): void {
    // borramos el valor del productor elegido en caso de que haya tenido un 
    // valor previo y el usuario este cambiando de rancho
    this.defaultDocumentSearchForm.controls.area.setValue(null)
    this.areas = [
      this.optionAll
    ]

    // si el productor ingresado es valido
    let selectedProducer = 
      <ElementWithParent>this.defaultDocumentSearchForm.controls.producer.value
    if (selectedProducer.id) {
      // preparamos los datos que seran enviados al servidor
      let data = new FormData()
      data.append('producer_name', selectedProducer.name)

      // enviamos la peticion al servidor para recuperar las areas de este 
      // productor
      this.server.create(
        'list-areas-of-producer',
        data,
        (response: BackendResponse) => {
          // revisamos si el rancho respondio con exito
          if (response.meta.return_code == 0) {
            // si asi fue guardamos las areas en el objeto de sugerencias 
            // del campo de areas
            this.areas = this.areas.concat(response.data)
          } else {
            // en caso de que el servidor responda con error, hay que notificar 
            // al usuario
            this.toastManager.showText(
              this.langManager.getServiceMessage(
                'list-areas-of-producer',
                response.meta.return_code
              )
            )
          } // if (response.meta.return_code == 0)
        } // (response: BackendResponse)
      ) // this.server.create
    } // if (this.defaultDocumentSearchForm.controls.ranch.valid)
  } // onProducerSelected(event: any): void 

  // Esta funcion se invoca cuando el formulario de captura de documento es 
  // enviado al servidor
  onDefaultDocumentSearch(): void {
    let data = new FormData()
    data.append('document_type_id', this.selectedDocumentTypeID.toString())
    data.append(
      'start_date', 
      $('input[type="hidden"][name="start-date_submit"]').val()
    )
    data.append(
      'end_date', 
      $('input[type="hidden"][name="end-date_submit"]').val()
    )

    let selectedZone = 
      <ElementWithoutParent>this.defaultDocumentSearchForm.controls.zone.value
    if (selectedZone && selectedZone != this.zoneOptionAll) {
      data.append('zone_id', selectedZone.id.toString())
    }

    let selectedRanch = 
      <ElementWithParent>this.defaultDocumentSearchForm.controls.ranch.value
    if (selectedRanch && selectedRanch != this.optionAll) {
      data.append('ranch_id', selectedRanch.id.toString())
    }

    let selectedProducer = 
      <ElementWithParent>this.defaultDocumentSearchForm.controls.producer.value
    if (selectedProducer && selectedProducer != this.optionAll) {
      data.append('producer_id', selectedProducer.id.toString())
    }

    let selectedArea = 
      <ElementWithParent>this.defaultDocumentSearchForm.controls.area.value
    if (selectedArea && selectedArea != this.optionAll) {
      data.append('area_id', selectedArea.id.toString())
    }

    // mostramos el modal de espera
    let modal = this.modalManager.open(ProgressModalComponent)
    
    // enviamos los datos al servidor
    this.server.create(
      'search-default',
      data,
      (response: BackendResponse) => {
        // al responder el servidor, cerramos el modal de espera
        modal.instance.modalComponent.close()

        // si el servidor respondio con exito, reiniciamos el formulario para 
        // que el usuario capture un nuevo documento
        if (response.meta.return_code == 0) {
          this.parent.searchResults = response.data
          this.parent.hasSearchResults = response.data.length > 0
        } else {
          // notificamos al usuario del resultado obtenido
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'search-default',
              response.meta.return_code
            )
          )
        }
      } // (response: BackendResponse)
    ) // this.server.create
  } // onDefaultDocumentUpload(): void
} // export class DefaultDocumentUploadComponent implements OnInit
