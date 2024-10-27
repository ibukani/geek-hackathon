import React, { useEffect, useState } from 'react';
import { Heart, PenLine, LogOut } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import MemoryCard from './components/MemoryCard';
import NewMemoryForm from './components/NewMemoryForm';
import AuthForm from './components/AuthForm';
import MemoryForm from './components/MemoryForm';
import { useAuthStore } from './store/authStore';
import { useMemoryStore } from './store/memoryStore';

function App() {
  const [showMemoryForm, setShowMemoryForm] = useState(false);
  const { user, loading: authLoading, initialize, signOut } = useAuthStore();
  const { memories, loading: memoriesLoading, fetchMemories } = useMemoryStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (user) {
      fetchMemories();
    }
  }, [user, fetchMemories]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <AuthForm />
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <header className="bg-white/70 backdrop-blur-sm border-b border-pink-100 fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-pink-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              メモリーリレー
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowMemoryForm(true)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:opacity-90 transition-opacity"
            >
              <PenLine className="h-4 w-4" />
              <span>新しいメモリー</span>
            </button>
            <button
              onClick={() => signOut()}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        {showMemoryForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">新しいメモリーを作成</h2>
              <MemoryForm onClose={() => setShowMemoryForm(false)} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NewMemoryForm onClick={() => setShowMemoryForm(true)} />
          {memoriesLoading ? (
            <div className="col-span-full flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
            </div>
          ) : (
            memories.map((memory) => (
              <MemoryCard
                key={memory.id}
                {...memory}
                onDelete={() => useMemoryStore.getState().deleteMemory(memory.id)}
                onUpdate={(updates) => useMemoryStore.getState().updateMemory(memory.id, updates)}
              />
            ))
          )}
        </div>
      </main>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;