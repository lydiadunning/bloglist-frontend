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
  const requestUrl = baseUrl + '/' + id
  const response = await axios.put(requestUrl, newObject)
  return response.data
}

const deleteThis = async (id) => {
  const config = {
    headers: { Authorization: token }
  }
  const requestUrl = baseUrl + '/' + id
  const response = await axios.delete(requestUrl, config)
  return response.data
}

export default { getAll, create, setToken, update, deleteThis }