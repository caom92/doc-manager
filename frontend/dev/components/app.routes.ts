import { Routes, Route, ExtraOptions } from '@angular/router'
import { LogInComponent } from './app.login'
import { UploadComponent } from './app.upload'
import { SearchComponent } from './app.search'
import { EditProfileComponent } from './app.edit.profile'
import { UsersComponent } from './app.users'
import { ReportComponent } from './app.report'
import { InventoryComponent } from './app.inventory'
import { LabDocumentSearchComponent } from './modal.search.lab'
import { GuaranteeDocumentSearchComponent } from './modal.search.guarantee'
import { ProcedureDocumentSearchComponent } from './modal.search.procedure'
import { TrainingDocumentSearchComponent } from './modal.search.training'
import { CertificateDocumentSearchComponent } from './modal.search.certificate'
import { AuthenticationNavGuard } from './guard.authentication'


function getRouteRequiringAuthentication(path: string, component: any): Route {
  return {
    path: path,
    component: component,
    data: { requiresLogIn: true },
    canActivate: [ AuthenticationNavGuard ]
  }
}

export function getRouterConfig(enableTracing: boolean): ExtraOptions {
  return {
    enableTracing: enableTracing,
    onSameUrlNavigation: 'reload',
    anchorScrolling: 'enabled'
  }
}


export const routes: Routes = [
  {
    path: 'login',
    component: LogInComponent
  },
  {
    path: 'upload',
    component: UploadComponent,
    data: { requiresLogIn: true },
    canActivate: [ AuthenticationNavGuard ]
  },
  {
    path: 'search',
    component: SearchComponent,
    data: { requiresLogIn: true },
    canActivate: [ AuthenticationNavGuard ]
  },
  {
    path: 'edit-profile',
    component: EditProfileComponent,
    data: { requiresLogIn: true },
    canActivate: [ AuthenticationNavGuard ]
  },
  {
    path: 'users',
    component: UsersComponent,
    data: { requiresLogIn: true },
    canActivate: [ AuthenticationNavGuard ]
  },
  {
    path: 'report',
    component: ReportComponent,
    data: { requiresLogIn: true },
    canActivate: [ AuthenticationNavGuard ]
  },
  {
    path: 'inventory',
    component: InventoryComponent,
    data: { requiresLogIn: true },
    canActivate: [ AuthenticationNavGuard ]
  },
  {
    path: 'search-lab/:selectedDocumentTypeID',
    component: LabDocumentSearchComponent,
    data: { requiresLogIn: true },
    canActivate: [ AuthenticationNavGuard ]
  },
  {
    path: 'search-guarantee/:selectedDocumentTypeID',
    component: GuaranteeDocumentSearchComponent,
    data: { requiresLogIn: true },
    canActivate: [ AuthenticationNavGuard ]
  },
  {
    path: 'search-procedure/:selectedDocumentTypeID',
    component: ProcedureDocumentSearchComponent,
    data: { requiresLogIn: true },
    canActivate: [ AuthenticationNavGuard ]
  },
  {
    path: 'search-training/:selectedDocumentTypeID',
    component: TrainingDocumentSearchComponent,
    data: { requiresLogIn: true },
    canActivate: [ AuthenticationNavGuard ]
  },
  {
    path: 'search-certificate/:selectedDocumentTypeID',
    component: CertificateDocumentSearchComponent,
    data: { requiresLogIn: true },
    canActivate: [ AuthenticationNavGuard ]
  },
  {
    path: '**',
    redirectTo: 'edit-profile'
  }
]
