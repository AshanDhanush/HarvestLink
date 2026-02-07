import React, { useState } from 'react';

const PredictionForm = ({ productName = '', onCancel }) => {
  const [item, setItem] = useState(productName || '');
  const [date, setDate] = useState('');
  const [region, setRegion] = useState('Colombo');
  const [predictedPrice, setPredictedPrice] = useState('');
  const [season, setSeason] = useState('');
  const [festivalImpact, setFestivalImpact] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Saving predictions has been disabled — close the form instead
    if (onCancel) onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="text-xs text-gray-600">Item</label>
        <input value={item} onChange={(e) => setItem(e.target.value)} className="w-full p-2 border rounded" />
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

      <div>
        <label className="text-xs text-gray-600">Predicted Price (LKR)</label>
        <input type="number" value={predictedPrice} onChange={(e) => setPredictedPrice(e.target.value)} className="w-full p-2 border rounded" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-600">Season</label>
          <input value={season} onChange={(e) => setSeason(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="text-xs text-gray-600">Festival Impact</label>
          <input value={festivalImpact} onChange={(e) => setFestivalImpact(e.target.value)} className="w-full p-2 border rounded" />
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-600">Notes (optional)</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-2 border rounded" rows={3} />
      </div>

      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-gray-100">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded bg-emerald-600 text-white">Close</button>
      </div>
    </form>
  );
};

export default PredictionForm;
