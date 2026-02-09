'use client';

import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: input,
          templateId: 'auto-market'
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Gagal generate');
      
      setOutput(data);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            PromptFoundry
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Ubah ide mentah jadi prompt premium dalam 10 detik. Siap pakai untuk Midjourney, DALL-E, dan ChatGPT.
          </p>
        </header>

        {/* Generator */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Contoh: Cyberpunk coffee shop at night..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              >
                {loading ? 'Generating...' : 'Buat Prompt'}
              </button>
            </div>
            {error && (
              <p className="mt-3 text-red-600 text-sm">{error}</p>
            )}
            <p className="mt-2 text-gray-500 text-sm">
              Hasil: JSON siap copy-paste ke Midjourney/DALL-E
            </p>
          </form>
        </div>

        {/* Output */}
        {output && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Prompt Siap Pakai</h3>
              <button
                onClick={() => navigator.clipboard.writeText(JSON.stringify(output, null, 2))}
                className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
              >
                Salin JSON
              </button>
            </div>
            <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto max-h-96 font-mono">
              {JSON.stringify(output, null, 2)}
            </pre>
          </div>
        )}

        {/* Pricing */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-2">Butuh Lebih Banyak?</h2>
          <p className="text-gray-600 mb-6">Dapatkan 50+ template premium & fitur eksklusif</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: "Basic", price: "$9", desc: "10 Template Inti", features: ["AutoMarket Forge", "Format JSON"] },
              { name: "Pro", price: "$19", desc: "50 Template + Panduan", features: ["Semua Template", "Notion Guide", "Commercial License"], popular: true },
              { name: "Premium", price: "$39", desc: "Akses Seumur Hidup", features: ["Semua Fitur Pro", "Update Seumur Hidup", "Early Access"] }
            ].map((plan) => (
              <div key={plan.name} className={`border rounded-xl p-6 ${plan.popular ? 'ring-2 ring-indigo-500 relative' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
                    POPULER
                  </div>
                )}
                <h3 className="font-bold text-xl">{plan.name}</h3>
                <p className="text-3xl font-bold my-2">{plan.price}</p>
                <p className="text-gray-600 mb-4">{plan.desc}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-2 rounded-lg font-medium ${
                  plan.popular 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}>
                  Beli Sekarang
                </button>
              </div>
            ))}
          </div>
        </div>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} PromptFoundry. All prompts are commercial-use ready.
        </footer>
      </div>
    </div>
  );
}