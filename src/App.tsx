import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Search, RefreshCw } from 'lucide-react';

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
}

function App() {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false'
      );
      const data = await response.json();
      setCryptos(data);
    } catch (error) {
      console.error('Error fetching crypto data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const filteredCryptos = cryptos.filter(crypto =>
    crypto.name.toLowerCase().includes(search.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(price);
  };

  const formatMarketCap = (marketCap: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(marketCap);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Crypto Price Tracker
          </h1>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search cryptocurrencies..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <RefreshCw className="animate-spin text-blue-500" size={32} />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCryptos.map((crypto) => (
              <div
                key={crypto.id}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-all duration-200 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <img src={crypto.image} alt={crypto.name} className="w-8 h-8 mr-3" />
                    <div>
                      <h2 className="font-semibold">{crypto.name}</h2>
                      <span className="text-sm text-gray-400 uppercase">{crypto.symbol}</span>
                    </div>
                  </div>
                  <div className={`flex items-center ${
                    crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {crypto.price_change_percentage_24h >= 0 ? (
                      <TrendingUp size={20} className="mr-1" />
                    ) : (
                      <TrendingDown size={20} className="mr-1" />
                    )}
                    <span className="font-medium">
                      {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price:</span>
                    <span className="font-medium">{formatPrice(crypto.current_price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Market Cap:</span>
                    <span className="font-medium">{formatMarketCap(crypto.market_cap)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;