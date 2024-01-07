import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

import './addproductform.css'

const AddFormProduct = () => {
  const [formData, setFormData] = useState({
    model: '',
    color: '',
    specs: '',
    description: '',
  });

  const [sizes, setSizes] = useState([]);

  const [categoryFilter, setCategoryFilter] = useState()

  const [selectedCategory, setSelectedCategory] = useState()

  useEffect(() => {
    const initialization = async () => {
      await axios.get('https://testagoy.onrender.comhttps://testagoy.onrender.comhttps://testagoy.onrender.comhttps://testagoy.onrender.comhttps://testagoy.onrender.com/api/category/')
      .then(response => {
          setCategoryFilter(response.data)
      })
    }

    initialization()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleAddSize = () => {
    if (formData.size && formData.priceAED && formData.priceUSD && formData.stocks) {
      const newSize = {
        size: formData.size,
        priceAED: formData.priceAED,
        priceUSD: formData.priceUSD,
        stocks: formData.stocks
      };
      setSizes((prevSizes) => [...prevSizes, newSize]);
      setFormData((prevData) => ({
        ...prevData,
        size: '',
        priceAED: '',
        priceUSD: '',
        stocks: ''
      }));
    }
  };
  
  const ref = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formDataForm = new FormData();
    formDataForm.append('model', formData.model);
    formDataForm.append('color', formData.color);
    formDataForm.append('specs', formData.specs);
    formDataForm.append('description', formData.description);
    formDataForm.append('groupId', selectedCategory.groupId);
    formDataForm.append('categoryId', selectedCategory._id);
    formDataForm.append('sizes', JSON.stringify(sizes));
    formDataForm.append('imageFile', selectedFile);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }

    await axios.post('https://testagoy.onrender.comhttps://testagoy.onrender.comhttps://testagoy.onrender.comhttps://testagoy.onrender.comhttps://testagoy.onrender.com/api/product/', formDataForm, config)
    .then(response => {
        console.log(response.data)
        // Reset the form after submission
        setFormData({
          model: '',
          color: '',
          specs: '',
          description: '',
          size: '',
          priceAED: '',
          priceUSD: '',
          stocks: ''
        });
        setSizes([]);
        setSelectedFile(null)
        ref.current.value = "";
    }).catch(err => console.log(err))
  };

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSelectCategory = (id) => {
    const selectedOption = categoryFilter.find(item => item._id === id);
    setSelectedCategory(selectedOption);
    console.log(selectedOption)
  };

  return (
    <form onSubmit={handleSubmit} className="container add-form">
      
      {categoryFilter && (
        <div className='form-group'>
          <label htmlFor="category">Category:</label>
          <select id="category" name="category" className='form-select' onChange={(e) => handleSelectCategory(e.target.value)}>
            <option value="">Select a category</option>
            {categoryFilter.map(item => (
              <option key={item._id} value={item._id}>{item.categoryName}</option>
            ))}
          </select>
        </div>
      )}
      <div className="form-group">
        <label htmlFor="model">Model:</label>
        <input
          type="text"
          id="model"
          className="form-control"
          name="model"
          value={formData.model}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="color">Color:</label>
        <input
          type="text"
          id="color"
          className="form-control"
          name="color"
          value={formData.color}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          className="form-control"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="specs">Specifications:</label>
        <textarea
          id="specs"
          className="form-control"
          name="specs"
          value={formData.specs}
          onChange={handleChange}
        />
      </div>
      <div className="form-group mt-2">
        <div className="d-flex">
          <input
            type="text"
            id="size"
            className="form-control mr-2"
            name="size"
            placeholder='Size'
            value={formData.size}
            onChange={handleChange}
          />
          <input
            type="number"
            id="priceAED"
            className="form-control"
            name="priceAED"
            placeholder="Price AED"
            value={formData.priceAED}
            onChange={handleChange}
          />
          <input
            type="number"
            id="priceUSD"
            className="form-control"
            name="priceUSD"
            placeholder="Price USD"
            value={formData.priceUSD}
            onChange={handleChange}
          />
          <input
            type="number"
            id="stocks"
            className="form-control"
            name="stocks"
            placeholder="Stock Quantity"
            value={formData.stocks}
            onChange={handleChange}
          />
        </div>
        <button
          type="button"
          className="btn btn-secondary my-2"
          onClick={handleAddSize}
        >
          Add Size
        </button>
      </div>
      <div>
        {sizes.map((size, index) => (
          <div key={index}>
            Size: {size.size} - PriceAED: {size.priceAED} - PriceUSD: {size.priceUSD} - Quantity: {size.stocks}
          </div>
        ))}
      </div>
      <div>
        <label htmlFor="model">Product Image:</label>
        <input type='file' id='imageFile' className='mt-2' name='imageFile' ref={ref} onChange={handleFileChange} />
      </div>
      <hr />
      <div>
        <label htmlFor="headerImageFile">Header Image:</label>
        <input type='file' id='headerImageFile' className='mt-2' name='headerImageFile' />
      </div>
      <div className="form-group mt-1">
        <label htmlFor="headerText">Header Text:</label>
        <input
          type="text"
          id="headerText"
          className="form-control"
          name="headerText"
        />
      </div>
      <button type="submit" className="btn btn-primary ml-3 my-2">
        Submit
      </button>
    </form>
  );
};

export default AddFormProduct;
