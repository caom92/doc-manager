import { OnInit } from '@angular/core'
import { BackendService, BackendResponse } from '../services/app.backend'
import { ToastService } from '../services/app.toast'
import { GlobalElementsService } from '../services/app.globals'
import { LanguageService } from '../services/app.language'
import { MzModalService } from 'ngx-materialize'
import { FormBuilder, FormGroup } from '@angular/forms'
import { StateService } from '@uirouter/core'


// Tipo auxiliar que define los elementos recuperados del servidor que no 
// posean un padre en la BD
export interface NoParentElement {
  id: number,
  name: string
}

// Tipo auxiliar que define los elementos recuperados del servidor que
// poseen un padre en la BD
export interface SingleParentElement {
  id: number,
  name: string,
  parent_id: number
}

// Este componente define el comportamiento base necesario para que el 
// usuario busque un documento en el sistema
export abstract class DefaultDocumentSearchComponent implements OnInit {

  numDocsWithPhysicalCopy = 0
  searchResults: Array<any> = []

  // Valores de la opcion para elegir todas las zonas de la lista de seleccion
  noParentOptionAll: NoParentElement = {
    id: null,
    name: 'ALL - TODOS'
  }

  // Valores de la opcion para elegir todos los ranchos/productores/areas de la 
  // lista de seleccion
  singleParentOptionAll: SingleParentElement = {
    id: null,
    name: 'ALL - TODOS',
    parent_id: null
  }
  
  // La lista de zonas a elegir por el usuario
  zones: Array<NoParentElement> = [
    this.noParentOptionAll
  ]

  // Instancia que representa el formulario de captura donde el usuario subira 
  // el documento
  searchForm: FormGroup = null

  // El ID del tipo de documento elegido por el usuario
  protected selectedDocumentTypeID: number = null

  protected searchParams = new URLSearchParams()

  protected numPendingService = 0

  // El constructor de este componente, inyectando los servicios requeridos
  constructor(
    protected server: BackendService,
    protected toastManager: ToastService,
    protected global: GlobalElementsService,
    protected langManager: LanguageService,
    protected modalManager: MzModalService,
    protected formBuilder: FormBuilder,
    protected stateService: StateService
  ) {
  }

  // Esta funcion se ejecuta al iniciar la vista
  ngOnInit(): void {
    this.selectedDocumentTypeID = 
      this.stateService.params.selectedDocumentTypeID

    if (this.global.roleName !== 'Director') {
      this.zones = [ this.global.zone ]
    } else {
      // obtenemos la lista de zonas del servidor
      this.server.read(
        'list-zones',
        {},
        (response: BackendResponse) => {
          // revisamos si el servidor respondio con exito
          if (response.meta.return_code === 0) {
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
    }
  } // ngOnInit(): void

  protected updateUrl(): void {
    window.history.pushState('', '', 
      `${ window.location.origin }/#/${ this.stateService.current.name }/`
      + `${ this.stateService.params.selectedDocumentTypeID }`
      + `?${ this.searchParams.toString() }`
    )
  }

  protected readonly setValueOnControlChange = (control: string) => {
    this.searchForm.controls[control].valueChanges.subscribe(() => {
      this.searchParams.set(control, this.searchForm.controls[control].value)
      console.debug(this.searchParams.get(control))
    })
  }

  protected readonly setIdOnControlChange = (control: string) => {
    this.searchForm.controls[control].valueChanges.subscribe(() => {
      this.searchParams.set(
        control, 
        this.searchForm.controls[control].value.id
      )
      console.debug(this.searchParams.get(control))
    })
  }
  
  protected readonly finishService = () => {
    --this.numPendingService
    if (this.numPendingService === 0) {
      this.afterServiceResponses()
    }
  }

  protected setControlValue(param: string, array: Array<any>, value: any) {
    const params = this.stateService.params
    let idx = -1

    if (params[param] !== undefined) {
      idx = array.findIndex((element) => {
        return element.id === parseInt(params[param])
      })
      this.searchForm.controls[param].setValue(array[idx])
    } else {
      this.searchForm.controls[param].setValue(value)
    }
  }

  protected abstract afterServiceResponses(): void
}
