import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';
import { LogIn } from 'lucide-react';

function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const signIn = useAuthStore(state => state.signIn);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      toast.success('ログインしました');
    } catch (error) {
      toast.error('ログインに失敗しました');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-sm border border-pink-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">ログイン</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            パスワード
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
        >
          <LogIn className="h-4 w-4" />
          <span>ログイン</span>
        </button>
      </form>
    </div>
  );
}

export default AuthForm;