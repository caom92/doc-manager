import { Injectable } from '@angular/core'


// Este servicio se encarga de administrar los textos que se despliegan en la 
// pagina en el idioma elegido por el usuario
@Injectable()
export class LanguageService {

  // Las interfaces publicas a todos los textos del sistema; el sistema 
  // desplegara cualquier texto que este almacenado aqui
  messages = {
    global: {
      wait: null,
      selectPlaceholder: null,
      submit: null,
      datePickerConfig: null,
      erase: null,
      accept: null,
      cancel: null
    },
    loginForm: {
      title: null,
      username: null,
      password: null,
      submit: null,
      goTo: null,
      errors: {
        username: {
          required: null,
          minlength: null
        },
        password: {
          required: null,
          minlength: null
        }
      }
    },
    deleteConfirmation: {
      title: null,
      message: null
    },
    signConfirmation: {
      title: null,
      message: null
    },
    sideNav: {
      search: null,
      upload: null,
      documents: null,
      editProfile: null,
      logout: null,
      users: null,
      report: null
    },
    userProfile: {
      title: null,
      username: null,
      employeeNum: null,
      fullName: null,
      firstName: null,
      lastName: null,
    },
    editPasswordForm: {
      title: null,
      newPassword: null,
      newPasswordConfirmation: null,
      oldPassword: null,
      submit: null,
      error: null,
      errors: {
        newPassword: {
          required: null,
          minlength: null
        },
        newPasswordConfirmation: {
          required: null,
          minlength: null
        },
        oldPassword: {
          required: null,
          minlength: null
        }
      }
    },
    editUsernameForm: {
      title: null,
      newUsername: null,
      password: null,
      submit: null,
      errors: {
        newUsername: {
          required: null,
          minlength: null
        },
        password: {
          required: null,
          minlength: null
        }
      }
    },
    usersForm: {
      titles: [ null, null, null ],
      tableHeaders: [ null, null, null, null ],
      active: null,
      inactive: null,
      role: null
    },
    upload: {
      lab: {
        analysisLabel: null,
        resultLabel: null,
        labNameLabel: null,
        typeNameLabel: null,
        subtype: null,
        dateLabel: null,
        documentName: null
      },
      guarantee: {
        supplierNameLabel: null
      },
      procedure: {
        procedureLabel: null
      },
      title: null,
      typeLabel: null,
      zoneLabel: null,
      ranchLabel: null,
      areaLabel: null,
      producerLabel: null,
      notesLabel: null,
      docDateLabel: null,
      fileLabel: null,
      fileButtonLabel: null,
      supplierLabel: null,
      errors: {
        documentDate: {
          required: null
        },
        zone: {
          required: null,
          minlength: null,
          maxlength: null
        },
        ranch: {
          required: null,
          maxlength: null
        },
        notes: {
          maxlength: null
        }
      }
    },
    search: {
      title: null,
      startDateLabel: null,
      endDateLabel: null,
      buttonLabel: null,
      noSearchResults: null
    },
    display: {
      title: null,
      checkbox: null,
      lab: {
        tabs: [ null, null ]
      }
    },
    inventory: {
      title: null,
      lab: {
        categoriesTitle: null,
        categoriesTab: null,
        labsTab: null,
        productionUnitsTab: null,
        producerTitle: null,
        tableHeaders: [ null, null, null ],
        labTableHeaders: [ null ],
        addTypeButton: null,
        addSubTypeButton: null,
        addProductButton: null,
        addLabButton: null,
        addProducerButton: null,
        typeTitle: null,
        subtypeTitle: null,
        areaTitle: null,
        labTitle: null,
        parentErrors: {
          required: null
        },
        errors: {
          required: null,
          maxlength: null
        }
      },
      guarantee: {
        addSupplier: null,
        labTableHeaders: [
          null
        ]
      },
      supplierTitle: null,
      addSupplierButton: null
    },
    documents: {
      title: null,
      tableHeaders: [ null ],
      nameLabel: null,
      addButtonLabel: null,
      errors: {
        name: {
          required: null,
          maxlength: null
        }
      }
    },
    list: {
      view: null,
      numPhysicalDocs: null,
      area: {
        tableHeaders: [
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ]
      },
      lab: {
        tableHeaders: [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ]
      },
      guarantee: {
        tableHeaders: [
          null,
          null,
          null,
          null,
          null
        ]
      },
      procedure: {
        tableHeaders: [
          null,
          null,
          null,
          null,
          null
        ]
      }
    },
    report: {
      title: null,
      lab: {
        from: null,
        to: null,
        docTypeLabel: null,
        name: null,
        zone: null,
        typeLabel: null,
        producer: null
      }
    }
  }

  // La lista de traducciones para todos los textos del sistema
  private translations = {
    es: { // Español
      global: {
        wait: 'Por favor espere...',
        erase: 'Borrar',
        selectPlaceholder: 'Elija una opción',
        submit: 'Enviar',
        close: 'Cerrar',
        accept: 'Aceptar',
        cancel: 'Cancelar',
        datePickerConfig: {
          closeOnSelect: true,
          closeOnClear: false,
          monthsFull: [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
            'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
          ],
          monthsShort: [
            'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep',
            'Oct', 'Nov', 'Dec'
          ],
          weekdaysFull: [
            'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes',
            'Sábado'
          ],
          weekdaysShort: [
            'Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'
          ],
          weekdaysLetter: [
            'D', 'L', 'M', 'R', 'J', 'V', 'S'
          ],
          today: 'Hoy',
          clear: 'Borrar',
          close: 'Cerrar',
          format: 'dddd, dd mmmm, yyyy',
          formatSubmit: 'yyyy-mm-dd',
          selectYears: true,
          selectMonths: true,
        },
        reportButton: 'Reporte'
      },
      loginForm: {
        title: 'Inicie Sesión',
        username: 'Nombre de Usuario',
        password: 'Contraseña',
        submit: 'Entrar',
        goTo: 'Ir A Principal',
        errors: {
          username: {
            required: 'Este campo es obligatorio',
            minlength: 'Este campo debe tener al menos 3 caracteres'
          },
          password: {
            required: 'Este campo es obligatorio',
            minlength: 'Este campo debe tener al menos 6 caracteres'
          }
        }
      },
      deleteConfirmation: {
        title: '¿Seguro que desea borrar este documento?',
        message: 
          'Está a punto de borrar un documento. Una vez borrado el ' 
          + 'documento, NO podrá ser recuperado de nuevo.'
      },
      signConfirmation: {
        title: 'Are you sure you wish to sign this document?',
        message: 
          'You are about to sign a document. Once signed, this action cannot '
          + 'be undone and your name will be registered as the signer'
      },
      sideNav: {
        search: 'Buscar',
        upload: 'Capturar',
        documents: 'Tipos de Documento',
        editProfile: 'Editar Perfil',
        logout: 'Cerrar Sesión',
        users: 'Usuarios',
        report: 'Reportes',
        inventory: 'Inventario'
      },
      userProfile: {
        title: 'Su Perfil de Usuario',
        username: 'Nombre de usuario',
        employeeNum: 'ID de Empleado',
        fullName: 'Nombre completo',
        firstName: 'Nombre(s)',
        lastName: 'Apellido(s)',
      },
      editPasswordForm: {
        title: 'Cambiar la contraseña',
        newPassword: 'Nueva contraseña',
        newPasswordConfirmation: 'Confirme nueva contraseña',
        oldPassword: 'Contraseña actual',
        submit: 'Editar',
        error: 'Los campos para la nueva contraseña no coinciden',
        errors: {
          newPassword: {
            required: 'Este campo es obligatorio',
            minlength: 'Este campo debe tener al menos 6 caracteres'
          },
          newPasswordConfirmation: {
            required: 'Este campo es obligatorio',
            minlength: 'Este campo debe tener al menos 6 caracteres'
          },
          oldPassword: {
            required: 'Este campo es obligatorio',
            minlength: 'Este campo debe tener al menos 6 caracteres'
          }
        }
      },
      editUsernameForm: {
        title: 'Cambiar el nombre de usuario',
        newUsername: 'Nuevo nombre de usuario',
        password: 'Contraseña actual',
        submit: 'Editar',
        errors: {
          newUsername: {
            required: 'Este campo es obligatorio',
            minlength: 'Este campo debe tener al menos 3 caracteres'
          },
          password: {
            required: 'Este campo es obligatorio',
            minlength: 'Este campo debe tener al menos 6 caracteres'
          }
        }
      },
      usersForm: {
        titles: [
          'Lista de usuarios',
          'Información del Usuario',
          'Privilegios de Usuario'
        ],
        tableHeaders: [
          'ID de Empleado',
          'Nombre',
          'Rol',
          '¿Activo?'
        ],
        active: 'Sí',
        inactive: 'No',
        role: 'Rol de Usuario'
      },
      upload: {
        lab: {
          analysisLabel: 'Solicitud de Estudio',
          analysisPhotoLabel: 'Fotografía',
          link: 'Enlace externo',
          resultLabel: 'Resultado de Estudio',
          labNameLabel: 'Nombre del Laboratorio',
          typeNameLabel: 'Tipo de Análisis',
          subtype: 'Subtipo de Análisis',
          dateLabel: 'Fecha de Muestreo',
          documentName: 'Nombre del Documento'
        },
        guarantee: {
          supplierNameLabel: 'Nombre del Proveedor',
          letterLabel: 'Carta de Garantía'
        },
        procedure: {
          sectionNameLabel: 'Nombre de la Sección',
          procedureLabel: 'Procedimiento'
        },
        certificate: {
          productNameLabel: 'Nombre del Permiso o Certificado',
          letterLabel: 'Certificado'
        },
        title: 'Captura de Documento',
        typeLabel: 'Tipo de Documento',
        zoneLabel: 'Zona',
        ranchLabel: 'Rancho',
        areaLabel: 'Área o Producto',
        subAreaLabel: 'Subárea o Subproducto',
        notesLabel: 'Notas o Comentarios',
        producerLabel: 'Unidad de Producción',
        docDateLabel: 'Fecha del Documento',
        fileLabel: 'Archivo del Documento',
        fileButtonLabel: 'Subir',
        supplierLabel: 'Proveedor',
        certificateNameLabel: 'Nombre del Permiso o Certificado',
        sectionLabel: 'Sección Correspondiente',
        errors: {
          documentDate: {
            required: 'Este campo es obligatorio'
          },
          zone: {
            required: 'Este campo es obligatorio',
            minlength: 'Este campo debe ser de 3 caracteres de largo',
            maxlength: 'Este campo debe ser de 3 caracteres de largo'
          },
          ranch: {
            required: 'Este campo es obligatorio',
            maxlength: 'Este campo no debe ser mas de 255 caracteres de largo'
          },
          notes: {
            maxlength: 'Este campo no debe ser mas de 65535 caracteres de largo'
          },
          link: {
            maxlength: 'Este campo no debe ser mas de 65535 caracteres de largo'
          }
        }
      },
      search: {
        title: 'Buscar Documento',
        startDateLabel: 'Fecha de Inicio',
        endDateLabel: 'Fecha Final',
        buttonLabel: 'Buscar',
        noSearchResults: 'No se encontraron documentos con esas características'
      },
      display: {
        title: 'Visualizar Documento',
        checkbox: '¿Tiene una copia física?',
        lab: {
          tabs: [
            'Solicitud',
            'Resultados'
          ]
        }
      },
      inventory: {
        title: 'Control de Inventario',
        lab: {
          categoriesTitle: 'Categorías de Análisis',
          categoriesTab: 'Categorias',
          labsTab: 'Laboratorios',
          productionUnitsTab: 'U. Prod.',
          producerTitle: 'Agregar Unidad de Producción',
          tableHeaders: [
            'Tipo de Análisis',
            'Subtupo de Análisis',
            'Área o Producto',
            'Subárea o Subproducto'
          ],
          labTableHeaders: [
            'Nombre'
          ],
          addTypeButton: 'Tipo',
          addSubTypeButton: 'Subtipo',
          addProductButton: 'Producto',
          addSubProductButton: 'Subproducto',
          addLabButton: 'Agregar Lab',
          addProducerButton: 'Agregar UP',
          typeTitle: 'Agregar Tipo de Análisis',
          subtypeTitle: 'Agregar Subtipo de Análisis',
          areaTitle: 'Agregar Área o Producto',
          subAreaTitle: 'Agregar Subárea o Subproducto',
          labTitle: 'Agregar Laboratorio',
          parentErrors: {
            required: 'Este campo es requerido'
          },
          errors: {
            required: 'Este campo es requerido',
            maxlength: 'Este campo no debe exceder los 255 caracteres de largo'
          }
        },
        guarantee: {
          addSupplier: 'Agregar Proveedor',
          labTableHeaders: [
            'Proveedor'
          ],
          supplierTitle: 'Agregar Proveedor',
          addSupplierButton: 'Agregar'
        },
        procedure: {
          addSection: 'Agregar Sección',
          labTableHeaders: [
            'Sección'
          ],
          sectionTitle: 'Agregar Sección',
          addSectionButton: 'Agregar'
        },
        certificate: {
          addProduct: 'Agregar Producto',
          labTableHeaders: [
            'Nombre del Permiso o Certificado'
          ],
          productTitle: 'Agregar Certificado',
          addProductButton: 'Agregar'
        }
      },
      documents: {
        title: 'Tipos de Documento',
        tableHeaders: [
          'Nombre'
        ],
        nameLabel: 'Nombre del Tipo',
        addButtonLabel: 'Agregar',
        errors: {
          name: {
            required: 'Este campo es obligatorio',
            maxlength: 'Este campo no debe tener más de 255 caracteres'
          }
        }
      },
      list: {
        view: 'Ver',
        assign: 'Asignar Subárea/Subproducto',
        sign: 'Firmar',
        numPhysicalDocs: 'Número de documentos con copias físicas',
        area: {
          tableHeaders: [
            'Fecha',
            'Zona',
            'Rancho',
            'UP',
            'Área/Producto',
            'Ver',
            'Borrar'
          ]
        },
        lab: {
          tableHeaders: [
            'Fecha',
            'Zona',
            'UP',
            'Laboratorio',
            'Tipo de Análisis',
            'Subtipo',
            'Área/Producto',
            'Subárea/Subproducto',
            'Firma',
            '¿Copia Física?',
            'Ver',
            'Borrar'
          ]
        },
        guarantee: {
          tableHeaders: [
            'Fecha',
            'Zona',
            'Proveedor',
            'Ver',
            'Borrar'
          ]
        },
        procedure: {
          tableHeaders: [
            'Fecha',
            'Nombre del Doc.',
            'Zona',
            'Sección',
            'Ver',
            'Borrar'
          ]
        },
        training: {
          tableHeaders: [
            'Fecha',
            'Nombre del Doc.',
            'Zona',
            'Sección',
            'Ver',
            'Borrar'
          ]
        },
        certificate: {
          tableHeaders: [
            'Fecha',
            'Zona',
            'Producto',
            'Ver',
            'Borrar'
          ]
        }
      },
      report: {
        title: 'Reporte de Documentos',
        lab: {
          from: 'Del: ',
          to: 'Al: ',
          docTypeLabel: 'Tipo de Documento: ',
          name: 'LABORATORIOS',
          zone: 'Zona: ',
          typeLabel: 'Tipo de Análisis: ',
          producer: 'U. P.'
        }
      },
      login: {
        0: 'Sesión iniciada exitosamente',
        1: 'Las credenciales son incorrectas'
      },
      'check-session': {
        0: 'Sesión iniciada anteriormente'
      },
      'change-password': {
        0: 'La contraseña se cambió exitosamente',
        1: 'La vieja contraseña es incorrecta'
      },
      'change-username': {
        0: 'El nombre de usuario se cambió exitosamente',
        1: 'El nombre ingresado ya fue reclamado',
        2: 'La contraseña es incorrecta'
      },
      'capture-default': {
        0: 'Documento capturado con éxito',
        1: 'Error al subir el documento'
      },
      'capture-lab': {
        0: 'Documento capturado con éxito',
        1: 'Error al subir el documento'
      },
      'add-doc-type': {
        0: 'Tipo de documento agregado con éxito',
        1: 'Error al crear el tipo; el nombre ya está ocupado'
      },
      'delete-*': {
        0: 'Documento borrado exitosamente',
        1: 'Error al borrar el archivo del documento'
      },
      'add-product': {
        0: 'El área o producto fue agregado exitosamente'
      },
      'add-subarea': {
        0: 'El subárea o subproducto fue agregado exitosamente'
      },
      'edit-lab-subarea': {
        0: 'La subárea o subproducto fue actualizado exitosamente'
      },
      'add-lab': {
        0: 'El laboratorio fue agregado exitosamente'
      },
      'add-section': {
        0: 'La sección fue agregada exitosamente'
      },
      'add-analysis-type': {
        0: 'El tipo de análisis fue agregado exitosamente'
      },
      'add-analysis-subtype': {
        0: 'El subtipo de análisis fue agregado exitosamente'
      },
      'add-producer': {
        0: 'El productor fue agregado exitosamente'
      },
      'toggle-physical-copy-lab': {
        0: 'El estado de la copia física se guardó exitosamente'
      },
      'sign-*': {
        0: 'Documento firmado exitosamente',
        1: 'Error al firmar el documento'
      },
      100: 'No se pudo reconocer el servicio solicitado',
      101: 'Faltó enviar una entrada al servidor',
      102: 'Una entrada enviada al servidor no es un valor numérico',
      103: 'Una entrada enviada al servidor esta fuera del intervalo correcto',
      104: 'Una entrada enviada al servidor no es un número entero',
      105: 'Una entrada enviada al servidor no es un número real',
      106: 
        'Una entrada enviada al servidor no tiene la longitud de ' + 
        'caracteres correcta',
      107: 
        'La longitud de caracteres de una entrada enviada al servidor ' +
        'no esta dentro del intervalo apropiado',
      108: 'Una entrada enviada al servidor no es una cadena',
      109: 
        'Una entrada enviada al servidor no es una cadena de correo ' + 
        'electrónico',
      110: 'Una entrada enviada al servidor no es un valor lógico',
      111: 
        'Una entrada enviada al servidor no es una fecha o el formato es ' +
        'incorrecto',
      112: 'Una entrada enviada al servidor es un arreglo vacío',
      113: 'Un archivo enviado al servidor no es un documento',
      114: 'Un archivo enviado al servidor no es una imagen',
      115: 'No se pudo enviar un archivo al servidor',
      116: 'Una entrada enviada al servidor no es un número telefónico',
      117: 'No tiene el rol apropiado para usar este servicio',
      118: 'La sesión no ha sido iniciada',
      200: 'Fallo al instanciar un DAO'
    },
    en: { // Ingles
      global: {
        wait: 'Please wait...',
        erase: 'Delete',
        selectPlaceholder: 'Choose an option',
        submit: 'Send',
        close: 'Close',
        accept: 'Accept',
        cancel: 'Cancel',
        datePickerConfig: {
          closeOnSelect: true,
          closeOnClear: false,
          format: 'dddd, dd mmmm, yyyy',
          formatSubmit: 'yyyy-mm-dd',
          selectYears: true,
          selectMonths: true,
        },
        reportButton: 'Report'
      },
      loginForm: {
        title: 'Sign In',
        username: 'Username',
        password: 'Password',
        submit: 'Enter',
        goTo: 'Go to Main',
        errors: {
          username: {
            required: 'This field is required',
            minlength: 'This field must be at least 3 characters long'
          },
          password: {
            required: 'This field is required',
            minlength: 'This field must be at least 6 characters long'
          }
        }
      },
      deleteConfirmation: {
        title: 'Are you sure you wish to delete this document?',
        message: 'You are about to delete a document. Once deleted, a document CANNOT be recovered.'
      },
      signConfirmation: {
        title: 'Are you sure you wish to sign this document?',
        message: 'You are about to sign a document. Once signed, this action cannot be undone and your name will be registered as the signer'
      },
      sideNav: {
        search: 'Search',
        upload: 'Upload',
        documents: 'Document Types',
        editProfile: 'Edit Profile',
        logout: 'Log Out',
        users: 'Users',
        report: 'Reports',
        inventory: 'Inventory'
      },
      userProfile: {
        title: 'Your User Profile',
        username: 'Username',
        employeeNum: 'Employee ID',
        fullName: 'Full Name',
        firstName: 'First name',
        lastName: 'Last name',
      },
      editPasswordForm: {
        title: 'Change password',
        newPassword: 'New password',
        newPasswordConfirmation: 'Confirm new password',
        oldPassword: 'Current password',
        submit: 'Edit',
        error: 'The fields for the new password differ from one another',
        errors: {
          newPassword: {
            required: 'This field is required',
            minlength: 'This field must be at least 6 characters long'
          },
          newPasswordConfirmation: {
            required: 'This field is required',
            minlength: 'This field must be at least 6 characters long'
          },
          oldPassword: {
            required: 'This field is required',
            minlength: 'This field must be at least 6 characters long'
          }
        }
      },
      editUsernameForm: {
        title: 'Change username',
        newUsername: 'New username',
        password: 'Current password',
        submit: 'Edit',
        errors: {
          newUsername: {
            required: 'This field is required',
            minlength: 'This field must be at least 3 characters long'
          },
          password: {
            required: 'This field is required',
            minlength: 'This field must be at least 6 characters long'
          }
        }
      },
      usersForm: {
        titles: [
          'List of users',
          'User Information',
          'User Privileges'
        ],
        tableHeaders: [
          'Employee ID',
          'Name',
          'Role',
          'Active?'
        ],
        active: 'Yes',
        inactive: 'No',
        role: 'User Role'
      },
      upload: {
        lab: {
          analysisLabel: 'Analysis Request Document',
          analysisPhotoLabel: 'Analysis Photo',
          link: 'External URL',
          resultLabel: 'Result Document',
          labNameLabel: 'Lab\'s Name',
          typeNameLabel: 'Analysis Type',
          subtype: 'Analysis Subtype',
          dateLabel: 'Sample Date',
          documentName: 'Document Name'
        },
        guarantee: {
          supplierNameLabel: 'Supplier Name',
          letterLabel: 'Guarantee Letter'
        },
        procedure: {
          sectionNameLabel: 'Section Name',
          procedureLabel: 'Procedure'
        },
        certificate: {
          productNameLabel: 'Name of Certificate or Permit',
          letterLabel: 'Certificate'
        },
        title: 'Document Upload',
        typeLabel: 'Document Type',
        zoneLabel: 'Zone',
        ranchLabel: 'Ranch',
        areaLabel: 'Area or Product',
        notesLabel: 'Notes or Comments',
        producerLabel: 'Production Unit',
        docDateLabel: 'Document Date',
        fileLabel: 'Document File',
        fileButtonLabel: 'Upload',
        supplierLabel: 'Supplier',
        certificateNameLabel: 'Name of Certificate or Permit',
        sectionLabel: 'Corresponding Section',
        errors: {
          documentDate: {
            required: 'This field is required'
          },
          zone: {
            required: 'This field is required',
            minlength: 'This field must be 3 characters long',
            maxlength: 'This field must be 3 characters long'
          },
          ranch: {
            required: 'This field is required',
            maxlength: 'This field must not be longer than 255 characters'
          },
          notes: {
            maxlength: 'This field must not be longer than 65535 characters'
          },
          link: {
            maxlength: 'This field must not be longer than 65535 characters'
          }
        }
      },
      search: {
        title: 'Search Document',
        startDateLabel: 'Start Date',
        endDateLabel: 'End Date',
        buttonLabel: 'Search',
        noSearchResults: 'No documents with those criteria were found'
      },
      display: {
        title: 'Display Document',
        checkbox: 'Has a physical copy?',
        lab: {
          tabs: [
            'Request',
            'Results'
          ]
        }
      },
      inventory: {
        title: 'Inventory Management',
        lab: {
          categoriesTitle: 'Analysis Categories',
          categoriesTab: 'Categories',
          productionUnitsTab: 'Prod. Units',
          labsTab: 'Laboratories',
          producerTitle: 'Add Production Unit',
          tableHeaders: [
            'Analysis Type',
            'Analysis Subtype',
            'Area/Product',
            'Subarea/Subproduct'
          ],
          labTableHeaders: [
            'Name'
          ],
          addTypeButton: 'Type',
          addSubTypeButton: 'Subtype',
          addProductButton: 'Area/Product',
          addSubProductButton: 'Subproduct',
          addLabButton: 'Add Lab',
          addProducerButton: 'Add PU',
          typeTitle: 'Add Analysis Type',
          subtypeTitle: 'Add Analysis Subtype',
          areaTitle: 'Add Area or Products',
          subAreaTitle: 'Add Subarea or Subproducts',
          labTitle: 'Add Laboratory',
          parentErrors: {
            required: 'This field is required'
          },
          errors: {
            required: 'This field is required',
            maxlength: 'This field must not exceed 255 characters long'
          }
        },
        guarantee: {
          addSupplier: 'Add Supplier',
          labTableHeaders: [
            'Supplier'
          ],
          supplierTitle: 'Add Supplier',
          addSupplierButton: 'Add'
        },
        procedure: {
          addSection: 'Add Section',
          labTableHeaders: [
            'Section'
          ],
          sectionTitle: 'Add Section',
          addSectionButton: 'Add'
        },
        certificate: {
          addProduct: 'Add Product',
          labTableHeaders: [
            'Name of Certificate or Permit'
          ],
          productTitle: 'Add Certificate',
          addProductButton: 'Add'
        }
      },
      documents: {
        title: 'Document Types',
        tableHeaders: [
          'Name'
        ],
        nameLabel: 'Type Name',
        addButtonLabel: 'Add',
        errors: {
          name: {
            required: 'This field is required',
            maxlength: 'This field must not exceed 255 characters length'
          }
        }
      },
      list: {
        view: 'View',
        assign: 'Asign Subarea/Subproduct',
        sign: 'Sign',
        numPhysicalDocs: 'Number of documents with physical copies',
        area: {
          tableHeaders: [
            'Date',
            'Zone',
            'Ranch',
            'PU',
            'Area/Product',
            'Physical Copy?',
            'View',
            'Delete'
          ]
        },
        lab: {
          tableHeaders: [
            'Date',
            'Zone',
            'PU',
            'Lab',
            'Analysis Type',
            'Sub-Type',
            'Area/Product',
            'Signature',
            'Subarea/Subproduct',
            'View',
            'Delete'
          ]
        },
        guarantee: {
          tableHeaders: [
            'Date',
            'Zone',
            'Supplier',
            'View',
            'Delete'
          ]
        },
        procedure: {
          tableHeaders: [
            'Date',
            'Doc. Name',
            'Zone',
            'Section',
            'View',
            'Delete'
          ]
        },
        training: {
          tableHeaders: [
            'Date',
            'Doc. Name',
            'Zone',
            'Section',
            'View',
            'Delete'
          ]
        },
        certificate: {
          tableHeaders: [
            'Date',
            'Zone',
            'Product',
            'View',
            'Delete'
          ]
        }
      },
      report: {
        title: 'Document Reports',
        lab: {
          from: 'From: ',
          to: 'To: ',
          docTypeLabel: 'Document Type: ',
          name: 'LABORATORIES',
          zone: 'Zone: ',
          typeLabel: 'Analysis Type: ',
          producer: 'P. U.'
        }
      },
      login: {
        0: 'Logged in successfully',
        1: 'Log in credentials are incorrect'
      },
      'check-session': {
        0: 'Already logged in'
      },
      'change-password': {
        0: 'Password changed successfully',
        1: 'Current password is incorrect'
      },
      'change-username': {
        0: 'Username changed successfully',
        1: 'The user name is already taken',
        2: 'The password is incorrect'
      },
      'capture-default': {
        0: 'Document uploaded successfully',
        1: 'Failed to upload the document file'
      },
      'capture-lab': {
        0: 'Document uploaded successfully',
        1: 'Failed to upload the document file'
      },
      'add-doc-type': {
        0: 'Document type added successfully',
        1: 'Failed to add document type; the name is already taken'
      },
      'delete-*': {
        0: 'Document was deleted successfully',
        1: 'Failed to delete document file'
      },
      'add-product': {
        0: 'Area or Product was added successfully'
      },
      'add-subarea': {
        0: 'Subarea or Subproduct was added successfully'
      },
      'edit-lab-subarea': {
        0: 'Subarea or Subproduct was updated successfully'
      },
      'add-lab': {
        0: 'The lab was added successfully'
      },
      'add-section': {
        0: 'The section was added successfully'
      },
      'add-analysis-type': {
        0: 'The analysis type was added successfully'
      },
      'add-analysis-subtype': {
        0: 'The analysis subtype was added successfully'
      },
      'add-producer': {
        0: 'The producer was added successfully'
      },
      'toggle-physical-copy-lab': {
        0: 'El estado de la copia física se guardó exitosamente'
      },
      'sign-*': {
        0: 'Document was signed successfully',
        1: 'Failed to sign document'
      },
      100: 'Unable to recognize the requested service',
      101: 'A server input argument was not send',
      102: 'A server input argument is not a numeric value',
      103: 'A server input argument is outside the correct interval',
      104: 'A server input argument is not an integer',
      105: 'A server input argument is not a real number',
      106: 'A server input argument doesn\'t have the proper character length',
      107: 
        'The character length of a server input argument is not within the ' +
        'proper interval',
      108: 'A server input argument is not a string',
      109: 'A server input argument is not an email string',
      110: 'A server input argument is not a boolean value',
      111: 'A server input argument is not a date or the format is incorrect',
      112: 'A server input argument is an empty array',
      113: 'A file sent to the server is not a document',
      114: 'A file sent to the server is not an image',
      115: 'A file could not be sent to the server',
      116: 'A server input argument is not a phone number',
      117: 'The user does not have the proper role to use this service',
      118: 'You are not logged in',
      200: 'Failed to create an instance of a DAO'
    }
  }

  get lang(): string {
    return localStorage.getItem('lang')
  }

  // Inicializa todos los textos de la aplicacion con el idioma que este 
  // seleccionado en ese momento, cualquiera que sea
  initMessages(): void {
    for (const msg in this.messages) {
      if (this.messages[msg]) {
        this.messages[msg] = 
          this.translations[localStorage.getItem('lang')][msg]
      }
    }
  }

  // Cambia los textos del sistema para que correspondan al idioma especificado
  // [in]   lang: el idioma elegido por el usuario, debe ser una opcion de:
  //        'en' o 'es'
  changeLanguage(lang: string): void {
    localStorage.setItem('lang', lang)
    for (const msg in this.messages) {
      if (this.messages[msg]) {
        this.messages[msg] = this.translations[lang][msg]
      }
    }
  }

  // Retorna el texto en el idioma elegido que sea adecuado para la combinacion 
  // de nombre de servicio y codigo de resultado especificados
  // [in]   service: el nombre del servicio cuyo mensaje queremos obtener
  // [in]   code: el codigo de resultado obtenido tras solicitar dicho servicio
  // [out]  return: el texto correspondiente al resultado obtenido por el 
  //        servicio especificado en el idioma seleccionado
  getServiceMessage(service: string, code: number): string {
    const lang = localStorage.getItem('lang')

    // inicializamos el almacenamiento temporal para el mensaje resultante
    let message = (lang === 'en') ?
      'An unknown error occurred' : 'Ocurrió un error desconocido'
    
    if (this.translations[lang][service] !== undefined) {
      if (this.translations[lang][service][code] !== undefined) {
        // si existe la combinacion de servicio y codigo de resultado 
        // especificados, retornamos ese
        message = this.translations[lang][service][code]
      }
    } else if (this.translations[lang][code] !== undefined) {
      // si la combinacion no existe, buscamos el mensaje que corresponda 
      // unicamente el codigo de resultado especificado
      message = this.translations[lang][code]
    }

    // retornamos el texto obtenido
    return message
  }
}
