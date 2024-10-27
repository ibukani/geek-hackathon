import React, { useState } from 'react';
import { Calendar, Send, Trash2, Edit2 } from 'lucide-react';
import { Memory } from '../store/memoryStore';
import { toast } from 'react-hot-toast';

interface MemoryCardProps extends Memory {
  onDelete: () => Promise<void>;
  onUpdate: (updates: Partial<Memory>) => Promise<void>;
}

function MemoryCard({ recipient, message, date, image_url, onDelete, onUpdate }: MemoryCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message);

  const handleDelete = async () => {
    if (window.confirm('このメモリーを削除してもよろしいですか？')) {
      try {
        await onDelete();
        toast.success('メモリーを削除しました');
      } catch (error) {
        toast.error('削除に失敗しました');
      }
    }
  };

  const handleUpdate = async () => {
    try {
      await onUpdate({ message: editedMessage });
      setIsEditing(false);
      toast.success('メモリーを更新しました');
    } catch (error) {
      toast.error('更新に失敗しました');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-pink-100">
      {image_url && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={image_url}
            alt="Memory"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">To: {recipient}</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{date}</span>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-500 hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editedMessage}
              onChange={(e) => setEditedMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              rows={4}
            />
            <div className="flex space-x-2">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
              >
                <Send className="h-4 w-4" />
                <span>更新</span>
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>
        )}
      </div>
    </div>
  );
}

export default MemoryCard;