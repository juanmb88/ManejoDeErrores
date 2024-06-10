import  {cartsModel}  from "../dao/models/carts.model.js";

export default class CartManager {

   // METODO PARA CREAR CARRITO
  ID_FIELD = "_id";

  async createCart() {
    try {
     let carrito = await cartsModel.create({products:[]});
     return carrito.toJSON()
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  //METODO PARA TRAER TODOS LOS CARRITOS
  async getAllCarts() {
    const carts = await cartsModel.find().lean();
    return carts;
  };
  //Obtener carrito por id
  async getCartById(id) {
    return await cartsModel.findOne({ _id: id }).populate("products.product").lean();
  };
  ///mandar un solo producto 
  async getOneBy(filtro={}) {
    return await cartsModel.findOne(filtro).lean();
  };

  
  async deleteCartById(id) {//ELIMINAR
    try {
      return await cartsModel.findByIdAndDelete({[this.ID_FIELD]: id})
    } catch (error) {
      console.log(error);
      return false;
    }
  }; 
  async update(id, carrito){  //ACTUALIZAR 
    return await cartsModel.updateOne({_id:id}, carrito)
}

async getOneByPopulate(filtro = {}) {//AGREGAR PRODUCTOS AL CARRITO
  return await cartsModel.findOne(filtro).populate("products.product").lean();
}
    

/*  async getAllProductsFromCart(id) {
  try {
    return await cartsModel.findById(id).populate("producto.products").select({productos: 1, _id:0});
  } catch (error) {
    console.log(error);
    return false;
  }
};  */


async decreaseProductQuantity(cid, pid) {//ELIMINAR PRODUCTO POR CANTIDAD RESTANDO QUANTITY
  try {
      const cart = await cartsModel.findById(cid);
      const productIndex = cart.products.findIndex(product => product.product == pid);

      if (productIndex !== -1) {
          // Si el producto existe en el carrito, disminuir su cantidad
          if (cart.products[productIndex].quantity > 1) {
              cart.products[productIndex].quantity -= 1;
              await cart.save();
          } else {
              // Si la cantidad es 1, eliminar el producto del carrito
              cart.products.splice(productIndex, 1);
              await cart.save();
          }
      }

      return true;
  } catch (error) {
      console.log(error);
      return false;
  }
 };

}