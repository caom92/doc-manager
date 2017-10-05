import { Component, OnInit, Input } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService, MzBaseModal } from 'ng2-materialize'
import { ProgressModalComponent } from './modal.please.wait'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

// Tipo auxiliar que declara la estructura necesaria para implementar 
// sugerencias de autocompletado en los campos de texto del formulario
export type AutoCompleteObject = {
  data: {
    [key: string]: string
  },
  limit: number
}

// Este componente define el comportamiento por defecto necesario para que el 
// usuario capture un documento en el sistema
@Component({
  templateUrl: '../templates/modal.upload.producer.html'
})
export class ProducerDocumentUploadModalComponent 
  extends MzBaseModal 
  implements OnInit
{ 
  // El ID del tipo de documento elegido por el usuario
  @Input()
  selectedDocumentTypeID: number = null

  // Las opciones de configuracion del modal
  modalOptions = {
  }

  // El archivo del documento que sera subido al servidor
  selectedDocumentFile: any = null

  // Las sugerencias de autocompletado del campo de zonas
  zoneSuggestions: AutoCompleteObject = {
    data: {},
    limit: 4
  }

  // Las sugerencias de autocompletado del campo de ranchos
  ranchSuggestions: AutoCompleteObject = {
    data: {},
    limit: 4
  }

  // Las sugerencias de autocompletado del campo de productores
  producerSuggestions: AutoCompleteObject = {
    data: {},
    limit: 4
  }

  // Instancia que representa el formulario de captura donde el usuario subira 
  // el documento
  defaultDocumentUploadForm: FormGroup = null

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
    this.defaultDocumentUploadForm = this.formBuilder.group({
      documentDate: [ null, Validators.required ],
      zone: [ null, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(3)
      ])],
      ranch: [ null, Validators.compose([
        Validators.required,
        Validators.maxLength(255)
      ])],
      producer: [ null, Validators.compose([
        Validators.required,
        Validators.maxLength(255)
      ])]
    })
  }

  // Esta funcion se ejecuta al iniciar la vista
  ngOnInit(): void {
    // configuramos las reglas de validacion del formulario de captura
    this.initForm()

    // inicializamos el selector de fecha
    $('.datepicker').pickadate(
      this.langManager.messages.global.datePickerConfig
    )

    // cada vez que el selector de fecha cambie, recuperamos la fecha elegida 
    // formateada 
    $('#document-date').change(
      this.defaultDocumentUploadForm, 
      function(event: any): void {
        event.data.controls.documentDate.setValue(event.target.value)
      }
    )

    // obtenemos la lista de zonas del servidor
    this.server.read(
      'list-zones',
      {},
      (response: BackendResponse) => {
        // revisamos si el servidor respondio con exito
        if (response.meta.return_code == 0) {
          // si el servidor respondio con exito, cargamos la respuesta al 
          // objeto de sugerencias de zonas
          this.zoneSuggestions = {
            data: {},
            limit: 4
          }
          for (let zone of response.data) {
            this.zoneSuggestions.data[zone.name] = null
          }
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
  } // ngOnInit(): void

  // Esta funcion se invoca cuando el usuario ingreso el nombre de una zona
  onZoneSelected(event: any): void {
    // guardamos la zona ingresada por el usuario
    this.defaultDocumentUploadForm.controls.zone.setValue(event.target.value)

    // borramos los valores del rancho y productor en caso que ya hayan tenido 
    // algun valor previamente y el usuario este cambiando de zona
    this.defaultDocumentUploadForm.controls.ranch.setValue(null)
    this.defaultDocumentUploadForm.controls.producer.setValue(null)

    // si la zona es valida, mandamos una peticion al servidor para recuperar 
    // los ranchos de esta zona
    if (this.defaultDocumentUploadForm.controls.zone.valid) {
      // preparamos los datos que seran enviados al usuario
      let data = new FormData()
      data.append('zone_name', event.target.value)

      // recuperamos los ranchos del servidor
      this.server.create(
        'list-ranches-of-zone',
        data,
        (response: BackendResponse) => {
          // revisamos si el servidor respondio con exito
          if (response.meta.return_code == 0) {
            // si asi fue, ingresamos los ranchos recuperados al objeto de 
            // sugerencias de ranchos
            this.ranchSuggestions = {
              data: {},
              limit: 4
            }
            for (let ranch of response.data) {
              this.ranchSuggestions.data[ranch.name] = null
            }
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
    } // if (this.defaultDocumentUploadForm.controls.zone.valid)
  } // onZoneSelected(event: any): void

  // Esta funcion se invoca cuando el usuario ingresa el nombre de un rancho
  onRanchSelected(event: any): void {
    // almacenamos el nombre del rancho ingresado
    this.defaultDocumentUploadForm.controls.ranch.setValue(event.target.value)

    // borramos el valor del productor elegido en caso de que haya tenido un 
    // valor previo y el usuario este cambiando de rancho
    this.defaultDocumentUploadForm.controls.producer.setValue(null)

    // si el rancho ingresado es valido
    if (this.defaultDocumentUploadForm.controls.ranch.valid) {
      // preparamos los datos que seran enviados al servidor
      let data = new FormData()
      data.append('ranch_name', event.target.value)

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
            this.producerSuggestions = {
              data: {},
              limit: 4
            }
            for (let producer of response.data) {
              this.producerSuggestions.data[producer.name] = null
            }
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
    } // if (this.defaultDocumentUploadForm.controls.ranch.valid)
  } // onRanchSelected(event: any): void 

  // Esta funcion se invoca cuando el usuario ingresa un productor
  onProducerSelected(event: any): void {
    // guardamos el productor ingresado
    this.defaultDocumentUploadForm.controls.producer.setValue(
      event.target.value
    )
  }


  // Esta funcion se invoca cuando el usuario elije un archivo para subirlo al 
  // servidor
  onDocumentFileSelected(event: any): void {
    // borramos el archivo elegido anteriormente
    this.selectedDocumentFile = null

    // recuperamos el archivo elegido
    let files = event.srcElement.files
    
    // si el usuario subio un archivo, lo guardamos para su futuro uso
    if (files.length > 0) {
      this.selectedDocumentFile = files[0]
    }
  }

  // Esta funcion se invoca cuando el formulario de captura de documento es 
  // enviado al servidor
  onDefaultDocumentUpload(): void {
    // preparamos los datos que seran enviados al servidor
    let data = new FormData()
    data.append('document_type_id', this.selectedDocumentTypeID.toString())
    data.append('capture_date', this.global.getFormattedDate())
    data.append(
      'file_date', 
      $('input[type="hidden"][name="document-date_submit"]').val()
    )
    data.append('zone', this.defaultDocumentUploadForm.controls.zone.value)
    data.append('ranch', this.defaultDocumentUploadForm.controls.ranch.value)
    data.append(
      'producer', 
      this.defaultDocumentUploadForm.controls.producer.value
    )
    data.append(
      'document_file', 
      this.selectedDocumentFile, 
      this.selectedDocumentFile.name
    )

    // mostramos el modal de espera
    let modal = this.modalManager.open(ProgressModalComponent)

    // enviamos los datos al servidor
    this.server.create(
      'capture-default',
      data,
      (response: BackendResponse) => {
        // al responder el servidor, cerramos el modal de espera
        modal.instance.modalComponent.close()

        // notificamos al usuario del resultado obtenido
        this.toastManager.showText(
          this.langManager.getServiceMessage(
            'capture-default',
            response.meta.return_code
          )
        )

        // si el servidor respondio con exito, reiniciamos el formulario para 
        // que el usuario capture un nuevo documento
        if (response.meta.return_code == 0) {
          this.defaultDocumentUploadForm.reset()
        }
      } // (response: BackendResponse)
    ) // this.server.create
  } // onDefaultDocumentUpload(): void
} // export class DefaultDocumentUploadComponent implements OnInit
