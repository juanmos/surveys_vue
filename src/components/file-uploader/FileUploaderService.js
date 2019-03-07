import axios from './../../endpoints/standart.js'

function upload (formData) {
  console.log('lo que envio al uploads')
  const url = `/uploads`
  return axios.post(url, formData, { headers: {
    'Content-Type': 'multipart/form-data'
  } })
    // get data
    .then(x => x.data)
    .then(x => x)
}

export { upload }
