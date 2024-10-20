import React, { useState, useCallback, useEffect, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { GripVertical, Trash2, Share2, Plus } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';
import { showSuccessToast, showErrorToast } from '../utils/toast';

const DragItem = ({ id, index, item, moveItem, handleItemChange, handleItemDelete }) => {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: 'item',
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'item',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        moveItem(item.index, item.index, true);
      }
    },
  });

  drag(drop(ref));

  return (
    <div ref={ref} className={`flex items-center w-full mb-2 ${isDragging ? 'opacity-50' : ''}`}>
      <span className="mr-2 cursor-move touch-manipulation flex-shrink-0">
        <GripVertical size={24} />
      </span>
      <span className="mr-2 font-bold flex-shrink-0">{index + 1}.</span>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-base"
        type="text"
        value={item}
        onChange={(e) => handleItemChange(index, e.target.value)}
      />
      <button
        onClick={() => handleItemDelete(index)}
        className="ml-2 p-2 text-red-500 hover:text-red-700"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

const ListItem = ({ list, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(list.title);
  const [items, setItems] = useState(list.items);
  const [shareEmail, setShareEmail] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  const saveTimeoutRef = useRef(null);

  const saveChanges = useCallback(() => {
    if (isDirty) {
      onUpdate(list._id, { title, items: items.filter(item => item.trim() !== '') });
      setIsDirty(false);
    }
  }, [list._id, title, items, onUpdate, isDirty]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveChanges();
      }
    };
  }, [saveChanges]);

  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(saveChanges, 2000);
  }, [saveChanges]);

  const moveItem = useCallback((dragIndex, hoverIndex, shouldSave = false) => {
    setItems(oldItems => {
      const dragItem = oldItems[dragIndex];
      const newItems = [...oldItems];
      newItems.splice(dragIndex, 1);
      newItems.splice(hoverIndex, 0, dragItem);
      return newItems;
    });
    if (shouldSave) {
      setIsDirty(true);
      debouncedSave();
    }
  }, [debouncedSave]);

  const handleItemChange = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
    setIsDirty(true);
    debouncedSave();
  };

  const handleTitleChange = (value) => {
    setTitle(value);
    setIsDirty(true);
    debouncedSave();
  };

  const handleItemDelete = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    setIsDirty(true);
    debouncedSave();
  };

  const handleAddItem = () => {
    setItems([...items, '']);
    setIsDirty(true);
    debouncedSave();
  };

  const handleShare = async (e) => {
    e.preventDefault();
    try {
      // Implement sharing functionality
      showSuccessToast('List shared successfully!');
      setShareEmail('');
    } catch (error) {
      console.error('Error sharing list:', error);
      showErrorToast('Error sharing list. Please try again.');
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      saveChanges();
    }
    setIsEditing(!isEditing);
  };

  const backend = 'ontouchstart' in window ? TouchBackend : HTML5Backend;

  return (
    <div className="bg-white shadow-md rounded px-4 py-4 mb-4 relative">
      <button
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        onClick={() => setIsDeleteDialogOpen(true)}
      >
        <Trash2 size={20} />
      </button>
      {isEditing ? (
        <DndProvider backend={backend}>
          <div className="w-full">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2 text-base"
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
            <div className="space-y-2">
              {items.map((item, index) => (
                <DragItem
                  key={index}
                  id={index}
                  index={index}
                  item={item}
                  moveItem={moveItem}
                  handleItemChange={handleItemChange}
                  handleItemDelete={handleItemDelete}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddItem}
              className="mt-2 flex items-center justify-center w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus size={20} className="mr-2" />
              Add Item
            </button>
          </div>
        </DndProvider>
      ) : (
        <>
          <h3 className="text-xl font-bold mb-2">{list.title}</h3>
          <div className="mb-4 space-y-1">
            {list.items.map((item, index) => (
              <div key={index} className="flex items-center text-base">
                <span className="mr-2 flex-shrink-0">{index + 1}.</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="flex space-x-2 mb-4">
            <button
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-base flex-1"
              onClick={handleEditToggle}
            >
              Edit
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-base flex-1 flex items-center justify-center"
              onClick={handleShare}
            >
              <Share2 size={20} className="mr-2" />
              Share
            </button>
          </div>
        </>
      )}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          onDelete(list._id);
          setIsDeleteDialogOpen(false);
        }}
        message="Delete this list?"
      />
    </div>
  );
};

export default ListItem;