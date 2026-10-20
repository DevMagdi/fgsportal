<?php
 
 namespace App\Http\Controllers\Settings\Product;

 use App\Http\Controllers\Controller;
 use App\Models\Product;
 use App\Models\SubProduct;
 use Illuminate\Http\Request;
 use App\Http\Controllers\ResponseTrait\ResponseApi;
 use Validator;
 
 
class SubProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */


    public function DeleteSubProduct(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                 'token'=>'required|string',
                'sub_product_id'=>'required|numeric|exists:sub_products,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $subproduct=  SubProduct::where('id',$request->sub_product_id)->first();

          if(!empty($subproduct->id)){

            $subproduct->delete();

            return ResponseApi::acceptedResponseApi(["message"=>"Deleted Success"],"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Sub Product not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function UpdateSubProductName(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'sub_product_name' => 'required|string|unique:sub_products',
                'token'=>'required|string',
                'sub_product_id'=>'required|numeric|exists:sub_products,id',
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $subproduct=  SubProduct::where('id',$request->sub_product_id)->first();

          if(!empty($subproduct->id)){
            
            $subproduct->update([
                'sub_product_name' =>$request->sub_product_name,
            ]);

            return ResponseApi::acceptedResponseApi($subproduct,"success",201);

          }else{
            return ResponseApi::badMethodErrorResponse(['message'=>"Sub Product not found"],"Validator Errors",400);

          }
         
        

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }
    public function CreateSubProduct(Request $request){
        try{
            $validator = Validator::make($request->all(), [
                'sub_product_name' => 'required|string|unique:sub_products',
                'token'=>'required|string',
                'products_id'=>'required|numeric|exists:products,id'
            ]);
            if ($validator->fails()) {
    
                return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
            }

          $subproduct=  SubProduct::create([

            'sub_product_name' =>$request->sub_product_name,
            'products_id' =>$request->products_id,
           ]);
         
        
          return ResponseApi::acceptedResponseApi($subproduct,"success",201);

             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(['message'=>"Server Error"],"server Error",500);

        }
        
    }




    public function GetSubProductForSpecificProduct(Request $request){
        try{
 
             if($request->has('product_name')){
                $validator = Validator::make($request->all(), [
                    'product_name' => 'required|string',
                    
                ]);
                if ($validator->fails()) {
    
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
                $product = Product::where('product_name','=',$request->product_name)->first();
                if(!empty($product)){

                    $subproduct = SubProduct::join('products', 'products.id', '=', 'products_id')
                    ->where('products.product_name','=',$request->product_name)->get();
    
                }else{
                    return ResponseApi::badMethodErrorResponse(['message'=>"department name not found"],"Empty",200);

                }

                 
 

            }else if($request->has('products_id')){
                $validator = Validator::make($request->all(), [
                    'products_id' => 'required|numeric',
                    
                ]);
                if ($validator->fails()) {
    
                    return ResponseApi::badMethodErrorResponse($validator->errors()->toArray(),"Validator Errors",400);
                }
                if($request->products_id==1){
                    $subProduct = SubProduct::all();
 
                    foreach($subProduct as $dep){

                        $array_reponse[] = [ 
                            'sub_product_name' =>$dep->sub_product_name,
                            'id'=>$dep->id

                        ];
                    }

                    return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

                }
                $product = Product::where('id',$request->products_id)->first();
                if(!empty($product->id)){
                        $subproduct = SubProduct::join('products', 'products.id', '=', 'products_id')
                        ->where('products.id','=',$request->products_id)->get();
                    }else{
                        return ResponseApi::badMethodErrorResponse(['message'=>"Product id not found"],"Empty",200);
    
                    }
          
            }else{
                return ResponseApi::notFoundResponse(null,"Empty",200);
            }
                if(!empty($subproduct[0]->id)){
                    foreach($subproduct as $dep){
                    $array_reponse[] = [ 
                        'sub_product_name' =>$dep->sub_product_name,
                        'id'=>$dep->id

                    ];
                }
                    return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

                }else{
                    return ResponseApi::notFoundResponse(null,"Empty",200);

                }
            
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse($e,"server Error",500);

        }
        
    }



    public function GetSubProductWithProduct(){
        try{
            
          $subproduct = SubProduct::all();
          if(!empty($subproduct[0]->id)){
            foreach($subproduct as $pro){
            $array_reponse[] = [ 
                'sub_product_name' =>$pro->sub_product_name,
                'product_name' =>$pro->products_id_fun->product_name,

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(null,"Empty",204);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(null,"server Error",500);

        }
        
    }
    public function GetAllSubProduct(){
        try{
          $subproduct = SubProduct::all();
          if(!empty($subproduct[0]->id)){
            foreach($subproduct as $pro){
            $array_reponse[] = [ 
                'sub_product_name' =>$pro->sub_product_name,
                'id'=>$pro->id

            ];
        }
            return ResponseApi::acceptedResponseApi($array_reponse,"success",201);

          }else{
            return ResponseApi::notFoundResponse(null,"Empty",204);

          }
             
        }catch(\Exception $e){
            return ResponseApi::badMethodErrorResponse(null,"server Error",500);

        }
        
    }




    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\SubProduct  $subProduct
     * @return \Illuminate\Http\Response
     */
    public function show(SubProduct $subProduct)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\SubProduct  $subProduct
     * @return \Illuminate\Http\Response
     */
    public function edit(SubProduct $subProduct)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\SubProduct  $subProduct
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SubProduct $subProduct)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\SubProduct  $subProduct
     * @return \Illuminate\Http\Response
     */
    public function destroy(SubProduct $subProduct)
    {
        //
    }
}
