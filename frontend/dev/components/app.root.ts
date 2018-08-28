// Importamos modulos externos necesarios para ejecutar la aplicacion
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { UIRouterModule } from '@uirouter/angular'
import { MaterializeModule } from 'ngx-materialize'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'

// Importamos los componentes de cada pagina de nuestra aplicacion
import { HomeComponent } from './app.home'
import { UploadComponent } from './app.upload'
import { SearchComponent } from './app.search'
import { LogInComponent } from './app.login'
import { EditProfileComponent } from './app.edit.profile'
import { UsersComponent } from './app.users'
import { ReportComponent } from './app.report'
import { InventoryComponent } from './app.inventory'

// Importamos los componentes de los modales
import { ProgressModalComponent } from './modal.please.wait'
import { DeleteDocumentConfirmationModalComponent } from './modal.confirmation.delete'
import { DefaultDocumentDisplayModalComponent } from './modal.display.default'
import { LabDocumentUploadModalComponent } from './modal.upload.lab'
import { LabDocumentSearchComponent } from './modal.search.lab'
import { LabSearchResultsListComponent } from './list.lab'
import { LabDocumentReportModalComponent } from './modal.report.lab'
import { LabReportResultsComponent } from './report.lab'
import { LabInventoryComponent } from './inventory.lab'
import { LabTypesInventoryModalComponent } from './modal.inventory.lab.type'
import { LabSubTypesInventoryModalComponent } from './modal.inventory.lab.subtype'
import { LabProductInventoryModalComponent } from './modal.inventory.lab.product'
import { LabLabInventoryModalComponent } from './modal.inventory.lab.lab'
import { LabProducerInventoryModalComponent } from './modal.inventory.lab.producer'
import { GuaranteeDocumentUploadModalComponent } from './modal.upload.guarantee'
import { GuaranteeDocumentSearchComponent } from './modal.search.guarantee'
import { GuaranteeSearchResultsListComponent } from './list.guarantee'
import { GuaranteeInventoryComponent } from './inventory.guarantee'
import { SupplierGuaranteeInventoryModalComponent } from './modal.inventory.guarantee.supplier'
import { ProcedureDocumentUploadModalComponent } from './modal.upload.procedure'
import { ProcedureDocumentSearchComponent } from './modal.search.procedure'
import { ProcedureSearchResultsListComponent } from './list.procedure'
import { ProcedureInventoryComponent } from './inventory.procedure'
import { SectionProcedureInventoryModalComponent } from './modal.inventory.procedure.section'
import { LabDocumentDisplayModalComponent } from './modal.display.lab'

// Importamos los servicios que van a ser necesitados por cada pagina del 
// sistema
import { uiRouterAuthenticatedNavConfig } from '../functions/ui.router.authenticated.nav.config'
import { KeysPipe } from '../pipes/app.keys'
import { ClickStopPropagationDirective } from '../directives/app.stop.propagation'
import { GlobalElementsService } from '../services/app.globals'
import { BackendService } from '../services/app.backend'
import { LanguageService } from '../services/app.language'
import { ToastService } from '../services/app.toast'
import { DynamicComponentContainerDirective } from '../directives/dynamic.container'

// Declaramos el modulo raiz que indica el inicio de nuestra aplicacion
@NgModule({
  // declaramos los modulos globales que vamos a importar
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MaterializeModule.forRoot(),
    UIRouterModule.forRoot({
      // hay que configurar ui-router para poder redireccionar al usuario 
      // dependiendo si la sesion esta iniciada o no
      config: uiRouterAuthenticatedNavConfig,
      states: [
        {
          name: 'login',
          url: '/login',
          component: LogInComponent
        },
        {
          name: 'upload',
          url: '/upload',
          component: UploadComponent
        },
        {
          name: 'search',
          url: '/search',
          component: SearchComponent
        },
        {
          name: 'edit-profile',
          url: '/edit-profile',
          component: EditProfileComponent
        },
        {
          name: 'users',
          url: '/users',
          component: UsersComponent
        },
        {
          name: 'report',
          url: '/report',
          component: ReportComponent
        },
        {
          name: 'inventory',
          url: '/inventory',
          component: InventoryComponent
        },
        {
          name: 'search-lab',
          url: '/search-lab/{selectedDocumentTypeID}',
          component: LabDocumentSearchComponent
        },
        {
          name: 'search-guarantee',
          url: '/search-guarantee/{selectedDocumentTypeID}',
          component: GuaranteeDocumentSearchComponent
        },
        {
          name: 'search-procedure',
          url: '/search-procedure/{selectedDocumentTypeID}',
          component: ProcedureDocumentSearchComponent
        }
      ],
      useHash: true,
      otherwise: '/edit-profile'
    })
  ],
  // declaramos los servicios globales
  providers: [
    GlobalElementsService,
    BackendService,
    ToastService,
    LanguageService
  ],
  // declaramos los componentes que va a utilizar nuestro sistema
  declarations: [
    ClickStopPropagationDirective,
    HomeComponent,
    KeysPipe,
    ProgressModalComponent,
    UploadComponent,
    SearchComponent,
    DefaultDocumentDisplayModalComponent,
    LabDocumentUploadModalComponent,
    LabDocumentSearchComponent,
    DynamicComponentContainerDirective,
    LabSearchResultsListComponent,
    DeleteDocumentConfirmationModalComponent,
    LogInComponent,
    EditProfileComponent,
    UsersComponent,
    ReportComponent,
    LabDocumentReportModalComponent,
    LabReportResultsComponent,
    InventoryComponent,
    LabInventoryComponent,
    LabTypesInventoryModalComponent,
    LabSubTypesInventoryModalComponent,
    LabProductInventoryModalComponent,
    LabLabInventoryModalComponent,
    LabProducerInventoryModalComponent,
    GuaranteeDocumentUploadModalComponent,
    GuaranteeDocumentSearchComponent,
    GuaranteeSearchResultsListComponent,
    GuaranteeInventoryComponent,
    SupplierGuaranteeInventoryModalComponent,
    ProcedureDocumentUploadModalComponent,
    ProcedureDocumentSearchComponent,
    ProcedureSearchResultsListComponent,
    ProcedureInventoryComponent,
    SectionProcedureInventoryModalComponent,
    LabDocumentDisplayModalComponent
  ],
  // declaramos cualquier componente que sera inyectado dinamicamente
  entryComponents: [
    ProgressModalComponent,
    DefaultDocumentDisplayModalComponent,
    LabDocumentUploadModalComponent,
    LabSearchResultsListComponent,
    DeleteDocumentConfirmationModalComponent,
    LabDocumentReportModalComponent,
    LabReportResultsComponent,
    LabInventoryComponent,
    LabTypesInventoryModalComponent,
    LabSubTypesInventoryModalComponent,
    LabProductInventoryModalComponent,
    LabLabInventoryModalComponent,
    LabProducerInventoryModalComponent,
    GuaranteeDocumentUploadModalComponent,
    GuaranteeSearchResultsListComponent,
    SupplierGuaranteeInventoryModalComponent,
    GuaranteeInventoryComponent,
    ProcedureDocumentUploadModalComponent,
    ProcedureSearchResultsListComponent,
    SectionProcedureInventoryModalComponent,
    ProcedureInventoryComponent,
    LabDocumentDisplayModalComponent
  ],
  // indicamos cual es el componente raiz
  bootstrap: [ HomeComponent ]
})
export class RootModule { 
  // Constructor del modulo raiz importa aquellos servicios que seran globales 
  // para todos los demas modulos
  constructor(
    private global: GlobalElementsService,
    private langManager: LanguageService
  ) {
  }
}
