import { Component, OnInit, Input } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService, MzBaseModal } from 'ng2-materialize'
import { ProgressModalComponent } from './modal.please.wait'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { DefaultDocumentUploadModalComponent, AutoCompleteObject } from './modal.upload.default'

// Este componente define el comportamiento de la pagina donde el usuario 
// capturara un archivo de laboratorio
@Component({
  templateUrl: '../templates/modal.upload.lab.html'
})
export class LabDocumentUploadModalComponent 
  extends DefaultDocumentUploadModalComponent
  implements OnInit
{
  // Las sugerencias de autocompletado del campo de laboratorio
  labSuggestions: AutoCompleteObject = {
    data: {},
    limit: 4   
  }

  // Las sugerencias de autocompletado del campo de tipos de analisis
  typeSuggestions: AutoCompleteObject = {
    data: {},
    limit: 4   
  }

  // Las sugerencias de autocompletado del campo de subtipos de analisis
  subtypeSuggestions: AutoCompleteObject = {
    data: {},
    limit: 4   
  }

  // Las sugerencias de autocompletado del campo de productores
  producerSuggestions: AutoCompleteObject = {
    data: {},
    limit: 4
  }

  // Las sugerencias de autocompletado del campo de areas o productos
  areaSuggestions: AutoCompleteObject = {
    data: {},
    limit: 4
  }

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

    if (this.global.roleName !== 'Director') {
      this.server.read(
        'list-producers-of-zone',
        {
          zone_id: this.global.zone.id
        },
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
                'list-producers-of-zone',
                response.meta.return_code
              )
            )
          } // if (response.meta.return_code == 0)
        } // (response: BackendResponse)
      ) // this.server.read
    } // if (this.global.roleName !== 'Director')

    // obtenemos la lista de laboratorios del servidor
    this.server.read(
      'list-labs',
      {},
      (response: BackendResponse) => {
        // revisamos si el servidor respondio con exito
        if (response.meta.return_code == 0) {
          // si el servidor respondio con exito, cargamos la respuesta al 
          // objeto de sugerencias de zonas
          this.labSuggestions = {
            data: {},
            limit: 4   
          }
          for (let lab of response.data) {
            this.labSuggestions.data[lab.name] = null
          }
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

    // obtenemos la lista de tipos de analisis del servidor
    this.server.read(
      'list-analysis-types',
      {},
      (response: BackendResponse) => {
        // revisamos si el servidor respondio con exito
        if (response.meta.return_code == 0) {
          // si el servidor respondio con exito, cargamos la respuesta al 
          // objeto de sugerencias de zonas
          this.typeSuggestions = {
            data: {},
            limit: 4   
          }
          for (let type of response.data) {
            this.typeSuggestions.data[type.name] = null
          }
        } else {
          // si el servidor respondio con error, notificamos al usuario
          this.toastManager.showText(
            this.langManager.getServiceMessage(
              'list-analysis-types',
              response.meta.return_code
            )
          )
        } // if (response.meta.return_code == 0)
      } // (response: BackendResponse)
    ) // this.server.read

    // configuramos las reglas de validacion del formulario de captura
    this.uploadForm = this.formBuilder.group({
      documentDate: [ null, Validators.required ],
      typeName: [ null, Validators.compose([
        Validators.required,
        Validators.maxLength(255)
      ])],
      labName: [ null, Validators.compose([
        Validators.required,
        Validators.maxLength(255)
      ])],
      zone: [
        {
          value: this.global.zone,
          disabled: true
        },
        Validators.compose([
          Validators.required
        ])
      ],
      subtype: [ null, Validators.compose([
        Validators.required,
        Validators.maxLength(255)
      ])],
      producer: [ null, Validators.compose([
        Validators.required,
        Validators.maxLength(255)
      ])],
      area: [ null, Validators.compose([
        Validators.required,
        Validators.maxLength(255)
      ])],
      notes: [ null, Validators.maxLength(65535)]
    })
  } // // ngOnInit(): void

  // Esta funcion se invoca cuando el usuario ingreso el nombre de una zona
  onZoneSelected(): void {
    // borramos los valores de productor en caso que ya hayan tenido 
    // algun valor previamente y el usuario este cambiando de zona
    this.uploadForm.controls.producer.setValue(null)

    // si la zona es valida, mandamos una peticion al servidor para recuperar 
    // la lista de productores
    if (this.uploadForm.controls.zone.valid) {
      // preparamos los datos que seran enviados al servidor
      let selectedZone = 
        <any>this.uploadForm.controls.zone.value

      // enviamos la peticion al servidor para recuperar los productores de 
      // este rancho
      this.server.read(
        'list-producers-of-zone',
        {
          zone_id: selectedZone.id
        },
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
                'list-producers-of-zone',
                response.meta.return_code
              )
            )
          } // if (response.meta.return_code == 0)
        } // (response: BackendResponse)
      ) // this.server.write
    } // if (this.uploadForm.controls.zone.valid)
  } // onZoneSelected(event: any): void

  // Esta funcion se invoca cuando el usuario ingresa un productor
  onProducerSelected(event: any): void {
    // guardamos el productor ingresado
    this.uploadForm.controls.producer.setValue(
      event.target.value
    )
  } // onProducerSelected(event: any): void

  // Esta funcion se invoca cuando el usuario ingresa el nombre de un 
  // laboratorio
  onLabSelected(event: any): void {
    // necesitamos agregar el nombre ingresado al elegir una opcion de la lista 
    // de sugerencias, de lo contrario, solo se guardara la tecla que el 
    // usuario presiono para activar la lista de sugerencias
    this.uploadForm.controls.labName.setValue(
      event.target.value
    )
  }

  // Esta funcion se invoca cuando el usuario ingresa un tipo de analisis
  onAnalysisTypeSelected(event: any): void {
    // necesitamos agregar el nombre ingresado al elegir una opcion de la lista 
    // de sugerencias, de lo contrario, solo se guardara la tecla que el 
    // usuario presiono para activar la lista de sugerencias
    this.uploadForm.controls.typeName.setValue(
      event.target.value
    )

    // borramos los valores de subtipo en caso que ya hayan tenido 
    // algun valor previamente y el usuario este cambiando de tipo
    this.uploadForm.controls.subtype.setValue(null)
    this.uploadForm.controls.area.setValue(null)

    // si el tipo es valido, mandamos una peticion al servidor para recuperar 
    // la lista de subtipos
    if (this.uploadForm.controls.typeName.valid) {
      // preparamos los datos que seran enviados al usuario
      let data = new FormData()
      data.append('type_name', event.target.value)

      // recuperamos los ranchos del servidor
      this.server.write(
        'list-analysis-subtypes-of-type',
        data,
        (response: BackendResponse) => {
          // revisamos si el servidor respondio con exito
          if (response.meta.return_code == 0) {
            // si asi fue, ingresamos los subtipos recuperados al objeto de 
            // sugerencias
            this.subtypeSuggestions = {
              data: {},
              limit: 4
            }
            for (let subtype of response.data) {
              this.subtypeSuggestions.data[subtype.name] = null
            }
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
    } // if (this.uploadForm.controls.typeName.valid)
  } // onAnalysisTypeSelected(event: any): void

  // Esta funcion se invoca cuando el usuario ingresa el nombre de un subtipo
  onSubTypeSelected(event: any): void {
    this.uploadForm.controls.subtype.setValue(
      event.target.value
    )

    this.uploadForm.controls.area.setValue(null)

    // si el tipo es valido, mandamos una peticion al servidor para recuperar 
    // la lista de subtipos
    if (this.uploadForm.controls.subtype.valid) {
      // preparamos los datos que seran enviados al usuario
      let data = new FormData()
      data.append('subtype_name', event.target.value)

      // recuperamos los ranchos del servidor
      this.server.write(
        'list-areas-of-subtype',
        data,
        (response: BackendResponse) => {
          // revisamos si el servidor respondio con exito
          if (response.meta.return_code == 0) {
            // si asi fue, ingresamos los subtipos recuperados al objeto de 
            // sugerencias
            this.areaSuggestions = {
              data: {},
              limit: 4
            }
            for (let area of response.data) {
              this.areaSuggestions.data[area.name] = null
            }
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
    } // if (this.uploadForm.controls.subtype.valid)
  } // onSubTypeSelected(event: any): void

  // Esta funcion se invoca cuando el usuario ingresa un area o producto
  onAreaSelected(event: any): void {
    // guardamos el productor ingresado
    this.uploadForm.controls.area.setValue(
      event.target.value
    )
  } // onAreaSelected(event: any): void

  // Esta funcion se invoca cuando el usuario elije un archivo de solicitud
  onAnalysisFileSelected(event: any): void {
    // borramos el archivo elegido anteriormente
    this.selectedDocumentFile = null
    
    // recuperamos el archivo elegido
    let files = event.srcElement.files
    
    // si el usuario subio un archivo, lo guardamos para su futuro uso
    if (files.length > 0) {
      this.selectedDocumentFile = files[0]
    }
  }

  // Esta funcion se invoca cuando el usuario hace clic en el boton de capturar 
  // documento
  onLabDocumentUpload(): void {
    // preparamos los datos que seran enviados al servidor
    let data = new FormData()
    data.append('document_type_id', this.selectedDocumentTypeID.toString())
    data.append('capture_date', this.global.getFormattedDate())
    data.append(
      'file_date', 
      this.uploadForm.controls.documentDate.value
    )
    let selectedZone = <any>this.uploadForm.controls.zone.value
    data.append('zone', selectedZone.id)
    data.append(
      'producer', 
      this.uploadForm.controls.producer.value
    )
    data.append(
      'lab_name', 
      this.uploadForm.controls.labName.value
    )
    data.append(
      'analysis_type_name',
      this.uploadForm.controls.typeName.value
    )
    data.append('subtype', this.uploadForm.controls.subtype.value)
    data.append(
      'area',
      this.uploadForm.controls.area.value
    )

    if (this.uploadForm.controls.notes.value) {
      data.append(
        'notes',
        this.uploadForm.controls.notes.value
      )
    }

    data.append(
      'analysis_file', 
      this.selectedDocumentFile, 
      this.selectedDocumentFile.name
    )

    // mostramos el modal de espera
    let modal = this.modalManager.open(ProgressModalComponent)

    // enviamos los datos al servidor
    this.server.write(
      'capture-lab',
      data,
      (response: BackendResponse) => {
        // al responder el servidor, cerramos el modal de espera
        modal.instance.modalComponent.close()

        // notificamos al usuario del resultado obtenido
        this.toastManager.showText(
          this.langManager.getServiceMessage(
            'capture-lab',
            response.meta.return_code
          )
        )

        // si el servidor respondio con exito, reiniciamos el formulario para 
        // que el usuario capture un nuevo documento
        if (response.meta.return_code == 0) {
          this.uploadForm.reset()
        }
      } // (response: BackendResponse)
    ) // this.server.write
  } // onLabDocumentUpload(): void
} // export class LabDocumentUploadModalComponent extends AreaDocumentUploadModalComponent