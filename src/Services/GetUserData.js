import axios from '../Utils/Axios'

function getUserData( pageIndex, pageCount){

    return new Promise( async (resolve, reject) => {
     try {
         let response = await axios.get(`/users?per_page=${pageCount}&page=${pageIndex}`)
         resolve(response.data);
     } catch (error) {
         reject({message: error})
     }
    })
 }

 function searchingColumns( pageINdes){

    return new Promise( async (resolve, reject) => {
     try {
         let response = await axios.get(`/users/${pageINdes}`)
         resolve(response.data);
     } catch (error) {
         reject({message: error})
     }
    })
 }

 export {getUserData, searchingColumns}