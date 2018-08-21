export const validations = {
  nameRules: [
    v => !!v || 'Nombre es requerido',
    v => v.length <= 10 || 'Nombre debe ser no mayor a 10 caracteres'
  ],
  emailRules: [
    v => !!v || 'Email es requerido',
    v => /.+@.+/.test(v) || 'Email es invalido'
  ]
}
