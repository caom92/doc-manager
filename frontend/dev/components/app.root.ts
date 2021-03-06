// Importamos modulos externos necesarios para ejecutar la aplicacion
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MaterializeModule } from 'ngx-materialize'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'
import { RouterModule } from '@angular/router'
import { routes, getRouterConfig } from './app.routes'
import { environment } from '../environments/environment'

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
import { SignDocumentConfirmationModalComponent } from './modal.confirmation.sign'
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
import { LabSubProductInventoryModalComponent } from './modal.inventory.lab.subproduct'
import { LabSubAreaReassignComponent } from './modal.subarea.lab'
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
import { TrainingDocumentUploadModalComponent } from './modal.upload.training'
import { TrainingDocumentSearchComponent } from './modal.search.training'
import { TrainingSearchResultsListComponent } from './list.training'
import { TrainingInventoryComponent } from './inventory.training'
import { TrainingSectionInventoryModalComponent } from './modal.inventory.training.section'
import { CertificateDocumentUploadModalComponent } from './modal.upload.certificate'
import { CertificateInventoryComponent } from './inventory.certificate'
import { ProductCertificateInventoryModalComponent } from './modal.inventory.certificate.product'
import { CertificateDocumentSearchComponent } from './modal.search.certificate'
import { CertificateSearchResultsListComponent } from './list.certificate'
import { LabDocumentDisplayModalComponent } from './modal.display.lab'

// Importamos los servicios que van a ser necesitados por cada pagina del 
// sistema
import { KeysPipe } from '../pipes/app.keys'
import { ClickStopPropagationDirective } from '../directives/app.stop.propagation'
import { GlobalElementsService } from '../services/app.globals'
import { BackendService } from '../services/app.backend'
import { LanguageService } from '../services/app.language'
import { ToastService } from '../services/app.toast'
import { DynamicComponentContainerDirective } from '../directives/dynamic.container'
import { AuthenticationNavGuard } from './guard.authentication'


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
    RouterModule.forRoot(routes, getRouterConfig(environment.production))
  ],
  // declaramos los servicios globales
  providers: [
    GlobalElementsService,
    BackendService,
    ToastService,
    LanguageService,
    AuthenticationNavGuard
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
    SignDocumentConfirmationModalComponent,
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
    LabSubProductInventoryModalComponent,
    LabSubAreaReassignComponent,
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
    TrainingInventoryComponent,
    TrainingSectionInventoryModalComponent,
    TrainingSearchResultsListComponent,
    TrainingDocumentSearchComponent,
    TrainingDocumentUploadModalComponent,
    CertificateDocumentUploadModalComponent,
    ProductCertificateInventoryModalComponent,
    CertificateInventoryComponent,
    CertificateDocumentSearchComponent,
    CertificateSearchResultsListComponent,
    LabDocumentDisplayModalComponent
  ],
  // declaramos cualquier componente que sera inyectado dinamicamente
  entryComponents: [
    ProgressModalComponent,
    DefaultDocumentDisplayModalComponent,
    LabDocumentUploadModalComponent,
    LabSearchResultsListComponent,
    DeleteDocumentConfirmationModalComponent,
    SignDocumentConfirmationModalComponent,
    LabDocumentReportModalComponent,
    LabReportResultsComponent,
    LabInventoryComponent,
    LabTypesInventoryModalComponent,
    LabSubTypesInventoryModalComponent,
    LabProductInventoryModalComponent,
    LabSubProductInventoryModalComponent,
    LabSubAreaReassignComponent,
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
    TrainingInventoryComponent,
    TrainingSectionInventoryModalComponent,
    TrainingSearchResultsListComponent,
    TrainingDocumentSearchComponent,
    TrainingDocumentUploadModalComponent,
    ProductCertificateInventoryModalComponent,
    CertificateInventoryComponent,
    CertificateDocumentUploadModalComponent,
    CertificateDocumentSearchComponent,
    CertificateSearchResultsListComponent,
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
