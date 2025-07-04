export const  fetchApi=async()=>{
    try {
        const response =   await fetch("http://omanphone.smsoman.com/api/configuration")
    

return response.json()
    } catch (error) {
        return error
    }


}
export const  fetchProduct=async()=>{
    try {
        const response =   await fetch("http://omanphone.smsoman.com/api/homepage")
        
    

return response.json()
    } catch (error) {
        return error
    }


}
export const  fetchProductdetails=async(params)=>{
    console.log("the params",params)
    try {
        const response =   await fetch(`http://omanphone.smsoman.com/api/productdetails?id=${params}`)
        
    

return response.json()
    } catch (error) {
        return error
    }


}
