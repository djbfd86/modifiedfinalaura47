import React, { useState } from 'react';
import { Calendar, X, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { dateManager } from '../utils/dateManager';

const TaskDatePicker = ({ onDateSelect, onCancel, defaultCurrentDate, defaultEndDate }) => {
  const [currentDate, setCurrentDate] = useState(
    defaultCurrentDate ? defaultCurrentDate.toISOString().split('T')[0] : dateManager.getCurrentDateForInput()
  );
  const [endDate, setEndDate] = useState(
    defaultEndDate ? defaultEndDate.toISOString().split('T')[0] : ''
  );

  const handleOk = () => {
    if (currentDate && endDate) {
      const current = new Date(currentDate);
      const end = new Date(endDate);
      
      if (current <= end) {
        onDateSelect(current, end);
      } else {
        alert('End date must be after or equal to current date');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="bg-slate-800 border-slate-700 max-w-md w-full">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-blue-400" />
          </div>
          <CardTitle className="text-white">Create New Task</CardTitle>
          <p className="text-slate-400 text-sm">Set the current date and end date for this task</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-slate-300 text-sm font-medium">Current Date (Reconfirmation)</label>
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
            <p className="text-slate-500 text-xs">Confirm the current date for this task</p>
          </div>

          <div className="space-y-2">
            <label className="text-slate-300 text-sm font-medium">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={currentDate}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
            <p className="text-slate-500 text-xs">When should this task be completed</p>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              onClick={onCancel}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleOk}
              disabled={!currentDate || !endDate}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskDatePicker;