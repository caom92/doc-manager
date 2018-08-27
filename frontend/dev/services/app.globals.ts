import { Injectable } from '@angular/core'

// Este servicio contiene los atributos y metodos declarados en el componente 
// de la pantalla principal para que puedan ser accesibles a otros componentes 
// derivados del mismo
@Injectable()
export class GlobalElementsService {

  // Bandera que indica si se debe desplegar el menu lateral
  private _showSideNav = false

  // Bandera que indica si se debe desplegar la animacion de carga en la 
  // pantalla o no
  private _showSpinner = true

  // El ID del usuario que tiene registrado en la base de datos
  private _userID: number = 
    (localStorage.getItem('user_id') !== undefined) ?
      parseInt(localStorage.getItem('user_id'), 10)
      : null

  // El nombre del rol del usuario
  private _roleName: string = 
    (localStorage.getItem('role_name') !== undefined) ?
      localStorage.getItem('role_name')
      : null

  // El numero de indentificacion del empleado en la empresa
  private _employeeNum: string = 
    (localStorage.getItem('employee_num') !== undefined) ?
      localStorage.getItem('employee_num')
      : null

  // El nombre completo del usuario que sera desplegado en el menu lateral
  private _userFullName: string = 
    (localStorage.getItem('user_full_name') !== undefined) ?
      localStorage.getItem('user_full_name')
      : null

  // El nombre de cuenta del usuario para iniciar sesion
  private _loginName: string = 
    (localStorage.getItem('login_name') !== undefined) ?
      localStorage.getItem('login_name')
      : null
  
  // Informacion de la compañia
  private _company = {
    name: (localStorage.getItem('company_name') !== undefined) ? 
      localStorage.getItem('company_name') : null,
    logo: (localStorage.getItem('company_logo') !== undefined) ? 
      localStorage.getItem('company_logo') : null,
    address: (localStorage.getItem('company_address') !== undefined) ? 
      localStorage.getItem('company_address') : null
  }

  // Informacion de la zona del usuario
  private _zone = {
    id: (localStorage.getItem('zone_id') !== undefined) ? 
      parseInt(localStorage.getItem('zone_id'), 10) : null,
    name: (localStorage.getItem('zone_name') !== undefined) ? 
      localStorage.getItem('zone_name') : null
  }

  get showSideNav() {
    return this._showSideNav
  }

  // Despliega el menu lateral
  displaySideNav() {
    this._showSideNav = true
  }

  // Oculta el menu lateral
  hideSideNav() {
    this._showSideNav = false
  }

  get showSpinner() {
    return this._showSpinner
  }
  
  displaySpinner() {
    this._showSpinner = true
  }

  hideSpinner() {
    this._showSpinner = false
  }

  set userID(value: number) {
    this._userID = value
    localStorage.setItem('user_id', value.toString())
  }

  get userID() {
    return this._userID
  }

  set roleName(value: string) {
    this._roleName = value
    localStorage.setItem('role_name', value)
  }

  get roleName() {
    return this._roleName
  }

  set employeeNum(value: string) {
    this._employeeNum = value
    localStorage.setItem('employee_num', value)
  }

  get employeeNum() {
    return this._employeeNum
  }

  set userFullName(value: string) {
    this._userFullName = value
    localStorage.setItem('user_full_name', value)
  }

  get userFullName() {
    return this._userFullName
  }

  set loginName(value: string) {
    this._loginName = value
    localStorage.setItem('login_name', value)
  }

  get loginName() {
    return this._loginName
  }

  set companyName(value: string) {
    this._company.name = value
    localStorage.setItem('company_name', value)
  }

  set companyLogo(value: string) {
    this._company.logo = value
    localStorage.setItem('company_logo', value)
  }

  set companyAddress(value: string) {
    this._company.address = value
    localStorage.setItem('company_address', value)
  }

  get company() {
    return this._company
  }

  set zoneID(value: number) {
    this._zone.id = value
    localStorage.setItem('zone_id', value.toString())
  }

  set zoneName(value: string) {
    this._zone.name = value
    localStorage.setItem('zone_name', value)
  }

  get zone() {
    return this._zone
  }

  get lang(): string {
    return localStorage.getItem('lang')
  }

  set lang(value: string) {
    localStorage.setItem('lang', value)
  }

  // Retorna la fecha de hoy en una cadena con formato AAAA-MM-DD
  getFormattedDate(): string {
    // primero obtenemos la fecha de hoy 
    const today = new Date()

    // luego obtenemos el año, el mes y el dia individualmente como cadenas
    const year = today.getUTCFullYear().toString()
    let month = (today.getMonth() + 1).toString()
    let day = today.getUTCDate().toString()

    // el mes y el dia no estan precedidos por un 0 cuando son valores menores 
    // a 10, para corregir esto, le agregamos el 0 al principio y luego 
    // recuperamos los ultimos 2 caracteres; si el valor es menor a 10, 
    // agregarle el 0 hara que la cadena tenga solo 2 caracteres, por lo que la 
    // funcion slice() retornara la cadena completa, en cambio si el valor es 
    // mayor a 10, agregarle el 0 hara que la cadena tenga 3 caracteres y la 
    // funcion slice retornara los ultimos 2 caracteres, borrando el cero que 
    // le habiamos agregado
    month = ('0' + month).slice(-2)
    day = ('0' + day).slice(-2)

    // retornamos la cadena de fecha formateada
    return `${ year }-${ month }-${ day }`
  }

  // Convierte la fecha en formato YYYY-MM-DD a formato DD-mmm-YY, donde mmm
  // son las primeras 3 letras del mes en cuestión en el idioma elegido por lang
  translateDate(date: string, lang: string) {
    const translations = {
      es: {
        '01': 'Ene',
        '02': 'Feb',
        '03': 'Mar',
        '04': 'Abr',
        '05': 'May',
        '06': 'Jun',
        '07': 'Jul',
        '08': 'Ago',
        '09': 'Sep',
        '10': 'Oct',
        '11': 'Nov',
        '12': 'Dic'
      },
      en: {
        '01': 'Jan',
        '02': 'Feb',
        '03': 'Mar',
        '04': 'Apr',
        '05': 'May',
        '06': 'Jun',
        '07': 'Jul',
        '08': 'Aug',
        '09': 'Sep',
        '10': 'Oct',
        '11': 'Nov',
        '12': 'Dec'
      }
    }

    const dateParts = date.split('-')
    const year = dateParts[0].slice(-2)
    const month = translations[lang][dateParts[1]]
    const day = dateParts[2]

    return `${ day }-${ month }-${ year }`
  }
} // export class HomeElementsService
