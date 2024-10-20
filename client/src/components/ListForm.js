import React, { useState } from 'react';
import { GripVertical } from 'lucide-react';

const ListForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [items, setItems] = useState(['']);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, items: items.filter(item => item.trim() !== '') });
    setTitle('');
    setItems(['']);
  };

  const handleItemChange = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, '']);
  };

  const moveItem = (fromIndex, toIndex) => {
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    setItems(newItems);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
          List Title
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter list title"
          required
        />
      </div>
      {items.map((item, index) => (
        <div key={index} className="mb-4 flex items-center">
          <button
            type="button"
            className="mr-2 cursor-move"
            onMouseDown={(e) => {
              e.preventDefault();
              const startY = e.clientY;
              const handleMouseMove = (moveEvent) => {
                const currentY = moveEvent.clientY;
                const diff = Math.round((currentY - startY) / 30);
                if (diff !== 0) {
                  const newIndex = Math.max(0, Math.min(items.length - 1, index + diff));
                  moveItem(index, newIndex);
                }
              };
              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          >
            <GripVertical size={20} />
          </button>
          <span className="mr-2 font-bold">{index + 1}.</span>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={item}
            onChange={(e) => handleItemChange(index, e.target.value)}
            placeholder={`Enter item ${index + 1}`}
          />
        </div>
      ))}
      <div className="flex items-center justify-between mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={addItem}
        >
          Add Item
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Create List
        </button>
      </div>
    </form>
  );
};

export default ListForm;