export const validations = {
  nameRules: [
    v => !!v || 'Nombre es requerido'
  ],
  descriptionRules: [
    v => !!v || 'descripción es requerida'
  ],
  emailRules: [
    v => !!v || 'Email es requerido',
    v => /.+@.+/.test(v) || 'Email es invalido',
    v => v.length >= 6 || 'Minimo 6 caracteres'
  ]
}
