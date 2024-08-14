const cities = require('../cities.json')
const provinces = require('../provinces.json')



exports.cities = (provinceId)=>{
    try {
        return cities.filter((item) => {return item.province_id == parseInt(provinceId)})
        
    } catch (error) {
        console.log(error);
    }
}

exports.provinces = ()=>{
    try {
        return provinces
        
    } catch (error) {
        console.log(error);
    }
}