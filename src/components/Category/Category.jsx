import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Axios from '../../axios/axios';
import Navbar from '../Navbar/Navbar';
import './Category.css';


 function Category() {
    const {categoryName} = useParams();
    const navigate = useNavigate();
    const [catcar, setcatcar] = useState([]);
   
      useEffect(() => {
    async function fetchCars() {
      try {
        const response = await Axios.get(
          `/cars/category/${categoryName}`
        );
        console.log(response.data, "category response");
        setcatcar(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchCars();
  }, [categoryName]);
  return (
    <>
    <Navbar />
    <div className="category-page">

        <h1 className='category-title'>{categoryName} models</h1>

        <div className="cars-container">
          {catcar.map((car) => (
            <div key={car._id} className="car-card" onClick={() => navigate(`/product/${car._id}`)}>
                <img src={car.image} alt={car.name} className="car-image" />
              <h2>{car.name}</h2>
              <p>{car.description}</p>
            </div>
          ))}
        </div>
      </div>
    


    </>
  );
}
export default Category;