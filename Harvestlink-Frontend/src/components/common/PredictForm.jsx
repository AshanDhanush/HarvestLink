import React, { useState } from 'react';
import { getPricePrediction } from '../../services/predictionService';

const PredictForm = ({ onClose }) => {
  const [item, setItem] = useState('');
  const [date, setDate] = useState('');
  const [region, setRegion] = useState('Colombo');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!item || !date || !region) return alert('Please enter item, date and region');
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await getPricePrediction(item, date, region);
      if (!res) throw new Error('No response');
      setResult(res);
    } catch (err) {
      console.error('Prediction failed', err);
      setError(err.response?.data || err.message || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs text-gray-600">Item (fruit or vegetable)</label>
          <input value={item} onChange={(e) => setItem(e.target.value)} className="w-full p-2 border rounded" placeholder="e.g. Tomato" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-600">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="text-xs text-gray-600">Region</label>
            <input value={region} onChange={(e) => setRegion(e.target.value)} className="w-full p-2 border rounded" />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-100">Close</button>
          <button type="submit" className="px-4 py-2 rounded bg-emerald-600 text-white" disabled={loading}>{loading ? 'Predicting...' : 'Predict'}</button>
        </div>
      </form>

      {error && <div className="mt-3 text-sm text-red-600">{String(error)}</div>}

      {result && (
        <div className="mt-4 p-3 bg-white border rounded">
          <p className="text-sm text-gray-600">Prediction for {result.date || date} — {result.region || region}</p>
          <p className="text-2xl font-bold text-emerald-600">LKR {result.predicted_price_lkr ?? result.predicted_price ?? 'N/A'}</p>
          <p className="text-xs text-gray-500 mt-1">Season: {result.season || 'N/A'} • Festival: {result.festival_impact || 'N/A'}</p>
        </div>
      )}
    </div>
  );
};

export default PredictForm;
