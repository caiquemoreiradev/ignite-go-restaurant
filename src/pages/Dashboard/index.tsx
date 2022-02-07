import { useEffect, useState } from 'react';

import { Header } from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface FoodData {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
}

export function Dashboard() {

  const [foods, setFoods] = useState<FoodData[]>([]);
  const [editingFood, setEditingFood] = useState<FoodData>({} as FoodData);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalOpen, setEditModalopen] = useState(false);

  useEffect(() => {

    async function loadFood() {
      const response = await api.get('/foods');

      setFoods(response.data);
    }

    loadFood();
  }, []);

  async function handleAddFood(food: Omit<FoodData, 'id' | 'available'>) {

    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: Omit<FoodData, 'id' | 'available'>) {

    try {
      const foodUpdated = await api.put<FoodData>(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered)
  }

  function toggleModal() {

    setModalIsOpen(!modalIsOpen);
  }

  function toggleEditModal() {

    setEditModalopen(!editModalOpen);
  }

  function handleEditFood(food: FoodData) {

    setEditingFood(food);
    setEditModalopen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      
      <ModalAddFood
        isOpen={modalIsOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={() => handleDeleteFood(food.id)}
              handleEditFood={() => handleEditFood(food)}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
