import React from 'react';
import axios from 'axios';

function App() {

  const [sku, setSku] = React.useState('')
  const [nombre, setNombre] = React.useState('')
  const [precio, setPrecio] = React.useState('')
  const [marca, setMarca] = React.useState('')
  const [stock, setStock] = React.useState('')
    
  const [productos, setProductos] = React.useState([])
  const [modoEdicion, setModoEdicion] = React.useState(false)
  const [id, setId] = React.useState('')
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
      const data = await fetch('https://flask-api-rest-product-2021.herokuapp.com/product/list')
      const productos = await data.json()
      console.log(productos.data)
      setProductos(productos.data)
  }

  const addProd = async (event) => {
    event.preventDefault();

    if(!sku.trim() || !nombre.trim() || !precio.trim() || !marca.trim() || !stock.trim()) {
      setError('Debe Ingresar todos los campos del formulario...')
      return
    }

    const bodyReq = {
      sku: sku,
      name: nombre,
      price: precio,
      brand: marca,
      stock: stock
    }
    console.log(bodyReq)
    
    let response = {};
    try {
      response = await axios.post('https://flask-api-rest-product-2021.herokuapp.com/product/add', bodyReq );
      console.log(response);
   } catch (err) {
      console.log( err )
   }

    setSku('')
    setNombre('')
    setPrecio('')
    setMarca('')
    setStock('')
    setError(null)

    fetchData()
  }

  const deleteProductDEL = async (id) => {
    console.log(id)
    let response = {}
    try {
      const urlDelete = 'https://flask-api-rest-product-2021.herokuapp.com/product/delete/' + id
      response = await axios.delete(urlDelete);
      console.log(response);
   } catch (err) {
      console.log( err )
   }
    fetchData()
  }

  const editarLoadDataForm = async (item) => {
    
    setModoEdicion(true)
    setSku(item.sku)
    setStock(item.stock)
    setMarca(item.brand)
    setPrecio(item.price)
    setNombre(item.name)
    setId(item.id)
  }


  const editProductPost = async (event) => {
    event.preventDefault();
    
    if(!sku.trim() || !nombre.trim() || !precio.toString().trim() || !marca.trim() || !stock.toString().trim()) {
      setError('Debe Ingresar todos los campos del formulario...')
      return
    }

    const bodyReq = {
      id: id,
      sku: sku,
      name: nombre,
      price: precio,
      brand: marca,
      stock: stock
    }

    let response = {};
    try {
      response = await axios.post('https://flask-api-rest-product-2021.herokuapp.com/product/edit', bodyReq );
      console.log(response);
    } catch (err) {
      console.log( err )
    }

    fetchData()
    
    setSku('')
    setNombre('')
    setPrecio('')
    setMarca('')
    setStock('')
    setError(null)
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center">ADMIN PRODUCT</h1>
      <hr/>
      <div className="row">
        <div className="col-8">
          <h4 className="text-center">List of products (id-sku-nombre-precio-marca-stock)</h4>
          <ul className="list-group">
            {
              productos.length === 0 ? (
                <li className="list-group-item">There is not products</li>
              ) : (
                productos.map(item => (
                  <li className="list-group-item" key={item.id}>
                    <span className="lead">{item.id}-</span>
                    <span className="lead">{item.sku}-</span>
                    <span className="lead">{item.name}-</span>
                    <span className="lead">{item.price}-</span>
                    <span className="lead">{item.brand}-</span>
                    <span className="lead">{item.stock}</span>
  
                    <button 
                      className="btn btn-danger btn-sm float-right mx-2"
                      onClick={() => deleteProductDEL(item.id)}
                    >
                      Delete
                    </button>
  
                    <button 
                      className="btn btn-warning btn-sm float-right"
                      onClick={() => editarLoadDataForm(item)}
                    >
                      Edit
                    </button>
  
                  </li>
                ))
              )

            }


          </ul>
        </div>
        <div className="col-4">
          <h4 className="text-center">
            {
              modoEdicion ? 'Editar Producto' : 'Add Producto'
            }
          </h4>
          <form onSubmit={modoEdicion ? editProductPost : addProd}>

            {
              error ? <span className="text-danger">{error}</span> : null
            }

            <input 
              type="text" 
              className="form-control mb-2"
              placeholder="Ingrese SKU"
              onChange={ e => setSku(e.target.value) }
              value={sku}
            />

            <input 
              type="text" 
              className="form-control mb-2"
              placeholder="Ingrese Nombre"
              onChange={ e => setNombre(e.target.value) }
              value={nombre}
            />

            <input 
              type="text" 
              className="form-control mb-2"
              placeholder="Ingrese Precio"
              onChange={ e => setPrecio(e.target.value) }
              value={precio}
            />

            <input 
              type="text" 
              className="form-control mb-2"
              placeholder="Ingrese Marca"
              onChange={ e => setMarca(e.target.value) }
              value={marca}
            />

            <input 
              type="text" 
              className="form-control mb-2"
              placeholder="Ingrese Stock"
              onChange={ e => setStock(e.target.value) }
              value={stock}
            />

            {
              modoEdicion ? (
                <button className="btn btn-warning btn-block" type="submit">Edit</button>
              ) : (
                <button className="btn btn-dark btn-block" type="submit">Add</button>
              )
            }

          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
