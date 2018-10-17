export const validations = {
  nameRules: [
    v => !!v || 'Campo es requerido'
  ],
  emailRules: [
    v => !!v || 'Email es requerido',
    v => /.+@.+/.test(v) || 'Email es invalido',
    v => v.length >= 6 || 'Minimo 6 caracteres'
  ]
}
