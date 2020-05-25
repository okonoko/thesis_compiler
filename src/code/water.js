export default function water(ast){

   function generateModule(ast){
        return `(module ${generateFunctions(ast)})`;
   }

   function generateFunction(name, params, statements){
       return `(func $${name} ${generateParams(params)} (result i32) ${statements})`
   }

   function generateParams(params){
       paramsString = '';
       params.forEach(param => paramsString += `(param $${param.name} ${param.type})`)
   }

}