import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => {
    console.log(response.data)

    return response.data})
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
} 

const update = async (id, newObject) => {
  console.log(id, newObject)
  const requestUrl = baseUrl + '/' + id
  console.log(requestUrl)
  const response = await axios.put(requestUrl, newObject)
  return response.data
}


export default { getAll, create, setToken, update }